# Member 2 — Groups & Expense Management (Expanded)

## What is included
- backend: models, middleware, routes, server (Express + Mongoose)
- frontend: two React pages (GroupPage, ExpensePage)
- .env.example to help set environment variables

## Quick start (backend)
1. Copy `backend/.env.example` -> `backend/.env` and fill values.
2. From `backend/`: `npm init -y` then `npm install express mongoose dotenv cors jsonwebtoken`
3. Start MongoDB locally or provide a cloud URI.
4. Run `node server.js`

## Quick start (frontend)
1. From `frontend/`: `npx create-react-app .` (if not already)
2. `npm install axios`
3. Add a route or import the pages into your app and run `npm start`

## Notes
- This module assumes a user/auth system (Member 1) that issues JWTs. The middleware expects decoded token with `id` field.
- For demos, you can create a dummy JWT with payload `{ "id": "<some-id>", "name": "Demo" }` signed using the `JWT_SECRET` to test protected endpoints.
