# Vikastra Technologies — Product Requirements

## Original Problem Statement
Premium futuristic 3D website for Vikastra Technologies (technology studio: Web, Mobile, Software, IoT, AI, Project Dev, Tech Training). Tesla × Apple × SpaceX × SaaS aesthetic. Dark theme, glassmorphism, neon blue + cyan + purple, 3D hero with floating logo + particles + glowing lines. Includes services grid, about with 3D globe, portfolio showcase, contact section, footer. Contact: vikasthratechnologies@gmail.com, phones 7012845860 / 8086756642.

## User Choices
- Scope: Landing site + contact form + admin dashboard to manage leads
- 3D approach: Hybrid — vanilla Three.js (hero + globe) + Framer Motion elsewhere
- Portfolio: 6 professional placeholder projects
- Logo: Stylized V monogram + VIKASTRA wordmark
- Colors: Neon cyan dominant with cyan/purple gradient mix

## Architecture
- Backend: FastAPI + MongoDB, JWT auth (HttpOnly cookie + Bearer fallback), admin seeded from .env
- Frontend: React (CRA + Craco) + Tailwind + shadcn/ui, vanilla Three.js (not r3f, due to visual-edits babel incompat), Framer Motion, Lenis smooth scroll, Sonner toasts, React Router (/, /admin/login, /admin)

## Personas
- Visitor / Lead: Browses landing, submits contact form
- Admin (Vikastra team): Logs into /admin, manages leads (view/update status/delete), sees stats

## Core Requirements (Static)
- 7 service cards, premium 3D hero, 3D animated globe, 6-project portfolio carousel, working contact form, admin dashboard with stats + lead CRUD, responsive, dark glassmorphism aesthetic

## What's Implemented (2025-12)
- ✅ Backend: auth/login, /me, /logout, /contact, /admin/leads (GET/PATCH/DELETE), /admin/stats
- ✅ Frontend: Hero (Three.js orb + rings + particles + parallax), Navbar, Logo marquee, Services grid (7 cards, 3D tilt), About (3D globe), Portfolio (6 projects), Contact form, Footer with marquee
- ✅ Admin login + Admin dashboard (stats, leads list w/ search, detail panel, status update, delete, logout)
- ✅ All endpoints + flows verified by testing_agent_v3 — 100% pass

## Backlog (P0 / P1 / P2)
- P1: Replace native confirm() delete with custom dialog modal
- P1: Move PATCH lead status to JSON body (RESTful)
- P1: Store created_at as BSON date for proper range queries
- P2: Add testimonials section / case-study deep-dive pages
- P2: Add blog/insights section
- P2: Add email notification (Resend/SMTP) when a new lead arrives
- P2: Add file/attachment upload to contact form

## Credentials
See /app/memory/test_credentials.md
