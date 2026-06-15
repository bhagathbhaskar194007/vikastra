"""Vikastra Technologies backend API tests"""
import os
import requests
import pytest
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get REACT_APP_BACKEND_URL
load_dotenv(Path(__file__).parent.parent.parent / "frontend" / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = "admin@vikastra.com"
ADMIN_PASSWORD = "Vikastra@2025"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "online"
        assert "Vikastra" in data.get("message", "")


# ---------- Contact (public) ----------
class TestContact:
    def test_create_lead_success(self, session):
        payload = {
            "name": "TEST_User",
            "email": "TEST_user@example.com",
            "phone": "9999999999",
            "service": "Web Development",
            "message": "TEST_message please ignore",
        }
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str)
        assert data["status"] == "new"
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        # store for cleanup
        pytest.created_lead_id = data["id"]

    def test_create_lead_missing_email(self, session):
        r = session.post(f"{BASE_URL}/api/contact",
                         json={"name": "X", "message": "hi"})
        assert r.status_code == 422

    def test_create_lead_invalid_email(self, session):
        r = session.post(f"{BASE_URL}/api/contact",
                         json={"name": "X", "email": "not-an-email", "message": "hi"})
        assert r.status_code == 422

    def test_create_lead_empty_message(self, session):
        r = session.post(f"{BASE_URL}/api/contact",
                         json={"name": "X", "email": "a@b.com", "message": ""})
        assert r.status_code == 422


# ---------- Auth ----------
class TestAuth:
    def test_login_success_sets_cookie(self, session):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        for k in ("id", "email", "name", "role", "token"):
            assert k in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        # cookie set
        assert "access_token" in s.cookies.get_dict() or any(
            c.name == "access_token" for c in s.cookies
        )

    def test_login_wrong_password(self, session):
        r = session.post(f"{BASE_URL}/api/auth/login",
                         json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_login_wrong_email(self, session):
        r = session.post(f"{BASE_URL}/api/auth/login",
                         json={"email": "nobody@x.com", "password": "x"})
        assert r.status_code == 401

    def test_me_with_bearer(self, session, auth_headers):
        r = session.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert set(data.keys()) >= {"id", "email", "name", "role"}

    def test_me_with_cookie(self):
        s = requests.Session()
        login = s.post(f"{BASE_URL}/api/auth/login",
                       json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert login.status_code == 200
        r = s.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_unauthenticated(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_logout_clears_cookie(self):
        s = requests.Session()
        s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.post(f"{BASE_URL}/api/auth/logout")
        assert r.status_code == 200
        # cookie should be cleared (max-age 0 or empty)
        # after delete_cookie, the cookie jar may still hold an empty value
        token_after = s.cookies.get("access_token")
        assert not token_after


# ---------- Admin (auth required) ----------
class TestAdmin:
    def test_admin_leads_requires_auth(self, session):
        r = requests.get(f"{BASE_URL}/api/admin/leads")
        assert r.status_code == 401

    def test_admin_stats_requires_auth(self, session):
        r = requests.get(f"{BASE_URL}/api/admin/stats")
        assert r.status_code == 401

    def test_list_leads_sorted(self, session, auth_headers):
        r = session.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers)
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list)
        if len(leads) >= 2:
            # sorted desc by created_at
            assert leads[0]["created_at"] >= leads[1]["created_at"]
        # the lead we created in TestContact should be present
        if hasattr(pytest, "created_lead_id"):
            assert any(l["id"] == pytest.created_lead_id for l in leads)

    def test_stats_shape(self, session, auth_headers):
        r = session.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ("total", "new", "contacted", "closed", "recent_7d"):
            assert k in data
            assert isinstance(data[k], int)

    def test_patch_lead_status(self, session, auth_headers):
        # create a lead first
        c = session.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_patch", "email": "TEST_patch@x.com",
            "message": "patch test"
        })
        assert c.status_code == 200
        lead_id = c.json()["id"]

        r = session.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}?status=contacted",
            headers=auth_headers,
        )
        assert r.status_code == 200
        assert r.json().get("status") == "contacted"

        # verify persisted
        leads = session.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers).json()
        match = [l for l in leads if l["id"] == lead_id]
        assert match and match[0]["status"] == "contacted"

        # invalid status
        r2 = session.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}?status=bogus",
            headers=auth_headers,
        )
        assert r2.status_code == 400

        # cleanup
        session.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=auth_headers)

    def test_delete_lead(self, session, auth_headers):
        c = session.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_del", "email": "TEST_del@x.com",
            "message": "delete test"
        })
        lead_id = c.json()["id"]

        r = session.delete(f"{BASE_URL}/api/admin/leads/{lead_id}",
                           headers=auth_headers)
        assert r.status_code == 200

        # GET should not find it now
        leads = session.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers).json()
        assert not any(l["id"] == lead_id for l in leads)

        # delete again -> 404
        r2 = session.delete(f"{BASE_URL}/api/admin/leads/{lead_id}",
                            headers=auth_headers)
        assert r2.status_code == 404


# ---------- Cleanup ----------
def teardown_module(module):
    """Best-effort cleanup of TEST_ prefixed leads."""
    try:
        s = requests.Session()
        login = s.post(f"{BASE_URL}/api/auth/login",
                       json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if login.status_code != 200:
            return
        token = login.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        leads = s.get(f"{BASE_URL}/api/admin/leads", headers=headers).json()
        for l in leads:
            if str(l.get("name", "")).startswith("TEST_") or \
               str(l.get("email", "")).startswith("TEST_"):
                s.delete(f"{BASE_URL}/api/admin/leads/{l['id']}", headers=headers)
    except Exception:
        pass
