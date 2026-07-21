PG House Management Portal (Beginner-friendly)

This is a simple full-stack Paying Guest (PG) House Management Portal built with Next.js (pages router), SQLite and Prisma, and Tailwind CSS.

Features
- Dashboard with summary counts
- Room management (add, edit, delete, mark occupied/vacant)
- Tenant management (add, edit, delete, assign room)
- Rent management (record payments, view history)
- Complaint management (add, update status, delete)
- Simple admin login (no libraries)

Admin credentials
- Username: admin
- Password: admin123

Quick start
1. Install dependencies:
   npm install

2. Generate Prisma client and push schema to SQLite DB:
   npm run prisma:generate
   npm run prisma:push

3. Seed the database with sample data:
   npm run seed

4. Start the dev server:
   npm run dev

Open http://localhost:3000 and login at /login

Notes for beginners
- Authentication is intentionally simple: a cookie named `pg_admin` is set when logging in. This is fine for a demo project but not production.
- Prisma schema is in prisma/schema.prisma. Database file: prisma/dev.db (created automatically when pushing).
- API routes are under pages/api and use the Prisma client at lib/prisma.js.
- Tailwind is configured in tailwind.config.js and styles/globals.css.

This project is designed to be readable and easy to extend for college projects.
