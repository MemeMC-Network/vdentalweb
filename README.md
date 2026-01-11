# vdentalweb — Velic Dental (VDental) website

This repository contains a static website and serverless API endpoints for managing site content via the GitHub REST API.

Setup
- Do not commit secrets. Set the following environment variables in Vercel or your deployment provider:
  - ADMIN_USER
  - ADMIN_PASSWORD
  - GITHUB_TOKEN
  - JWT_SECRET
  - REPO_OWNER
  - REPO_NAME

Local dev
- You can run a local static server for the frontend. Serverless functions that interact with GitHub expect the environment variables to be set.

Admin
- Admin UI: /admin/login.html and /admin/editor.html
- Login posts to /api/login and receives a JWT.
- Editor uses /api/content to load content and /api/save and /api/upload to persist changes.

Deployment
- This project is configured for Vercel (see vercel.json). Add environment variables in the Vercel dashboard and deploy.

Security
- Never commit your GITHUB_TOKEN or passwords.


