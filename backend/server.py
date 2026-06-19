from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Vikastra Technologies API")
api_router = APIRouter(prefix="/api")


# ============ Models ============
class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str = Field(min_length=1, max_length=4000)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


# ============ Auth helpers ============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"message": "Vikastra Technologies API", "status": "online"}


@api_router.post("/auth/login")
async def login(payload: LoginInput, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=43200,
        path="/",
    )
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "token": token,
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


@api_router.post("/contact", response_model=Lead)
async def create_lead(payload: ContactCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)
    return lead


@api_router.get("/admin/leads", response_model=List[Lead])
async def list_leads(_: dict = Depends(get_current_user)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, _: dict = Depends(get_current_user)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "deleted"}


@api_router.patch("/admin/leads/{lead_id}")
async def update_lead_status(lead_id: str, status: str, _: dict = Depends(get_current_user)):
    if status not in ("new", "contacted", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.leads.update_one({"id": lead_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "updated", "status": status}


@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(get_current_user)):
    total = await db.leads.count_documents({})
    new = await db.leads.count_documents({"status": "new"})
    contacted = await db.leads.count_documents({"status": "contacted"})
    closed = await db.leads.count_documents({"status": "closed"})
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent = await db.leads.count_documents({"created_at": {"$gte": seven_days_ago}})
    return {
        "total": total,
        "new": new,
        "contacted": contacted,
        "closed": closed,
        "recent_7d": recent,
    }


app.include_router(api_router)
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()  # This should match your existing app definition

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>Vikastra API Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #0f172a;
                    color: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background-color: #1e293b;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    max-width: 450px;
                }
                h1 { color: #38bdf8; margin-top: 0; }
                p { color: #94a3b8; line-height: 1.6; }
                .btn {
                    display: inline-block;
                    background-color: #38bdf8;
                    color: #0f172a;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    transition: background 0.2s;
                }
                .btn:hover { background-color: #0ea5e9; }
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #4ade80;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    background-color: #4ade80;
                    border-radius: 50%;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="status"><span class="dot"></span> Service Live</div>
                <h1>Welcome to Vikastra</h1>
                <p>Your backend service is compiled and successfully connected to the database cluster.</p>
                <a href="/docs" class="btn">Explore Interactive API Docs</a>
            </div>
        </body>
    </html>
    """
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@vikastra.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Vikastra Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin user seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Admin password updated: {admin_email}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
