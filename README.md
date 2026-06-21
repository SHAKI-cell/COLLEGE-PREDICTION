# College Discovery Platform (UniDiscover)

A production-grade, highly responsive, and modern College Discovery Platform inspired by Careers360 and Collegedunia. Designed with a SaaS dashboard aesthetic using Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and NextAuth.js.

---

## 🚀 Features

1. **Authentication & Saved Colleges**: Credentials-based register, login, session validation, and a bookmarking system to save/remove target universities.
2. **Interactive Listing & Smart Search**: Debounced search and multiple filters (State, City, Type, Fee Range, Rating, Placement Package) with URL query syncing.
3. **Premium College Profiles**: Tab-based layout covering Overview, Courses & Fees, Placements, Facilities, Admission criteria, and student review forms.
4. **Comparison Matrix**: Side-by-side comparative table for up to 3 colleges, comparing critical metrics (Fees, Placements, Rating, Type) with dynamic quick-search adding.
5. **SEO & UX Excellence**: Dynamic metadata generator, skeleton loading cards, toast notices, custom empty states, and fully responsive layouts.

---

## 📂 Project Structure

```
src/
├── app/                      # Next.js App Router files
│   ├── api/                  # API Endpoint handlers
│   │   ├── auth/             # Registration and NextAuth routing
│   │   ├── colleges/         # Listing, filtering, and detail APIs
│   │   └── saved/            # Bookmarks toggle and fetch APIs
│   ├── auth/                 # Register & Login unified forms page
│   ├── colleges/             # Listing and dynamic Detail ([slug]) pages
│   ├── compare/              # Comparison matrix page
│   ├── dashboard/            # Student bookmarking dashboard
│   ├── layout.tsx            # Root HTML layout and providers wrapper
│   └── page.tsx              # Landing Page with direct server queries
├── components/               # Shared interactive React components
│   ├── CompareContext.tsx    # Context managing compared colleges
│   ├── CollegeCard.tsx       # Reusable college stats & bookmark card
│   ├── HomeSearch.tsx        # Landing Page search input and quick tags
│   ├── Navbar.tsx            # Main navigation header
│   ├── Footer.tsx            # Site footer with statistics
│   ├── Providers.tsx         # NextAuth, QueryClient, and Toast wrapper
│   └── Toast.tsx             # Context for animated notifications
├── lib/                      # Shared helper configurations
│   ├── auth.ts               # NextAuth setup and validation rules
│   └── db.ts                 # Prisma Client singleton
prisma/
├── schema.prisma             # Database schema models (Prisma 7 format)
├── seed.ts                   # Seed script with 50+ Indian colleges
└── migrations/               # Database SQL schema history
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory. You can copy the template from `.env.example`:

```env
# Database connection URL (e.g., local PostgreSQL or Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# NextAuth configurations
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_key_at_least_32_chars"
```

---

## 🛠️ Database Setup

Prisma 7 separates DB configuration into `prisma.config.ts` and the model declarations in `schema.prisma`.

### 1. Validate Schema
Verify that the schema contains no errors:
```bash
npx prisma validate
```

### 2. Generate Prisma Client
Create the localized types mapping the schema models:
```bash
npx prisma generate
```

### 3. Run Migrations
Run the initial migration to build the PostgreSQL database schema:
```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database
Seed the database with 50+ realistic Indian universities (including IITs, NITs, and Private Universities) along with courses and student reviews:
```bash
npx prisma db seed
```

---

## 💻 Local Run Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deployment Guide

### Neon PostgreSQL Setup (Database)
1. Sign up on [Neon Console](https://neon.tech/) and create a new project.
2. Select **PostgreSQL** as the database engine and copy the provided connection URL (begins with `postgresql://`).
3. Paste the connection string into the `DATABASE_URL` field in your `.env` file (remember to append `?sslmode=require` if it's missing).

### Vercel Setup (Next.js Application)
1. Sign up on [Vercel](https://vercel.com/) and link your GitHub repository containing this project.
2. In Vercel Console, click **Add New Project** and select the repository.
3. Under **Environment Variables**, add:
   * `DATABASE_URL` (your Neon connection string)
   * `NEXTAUTH_URL` (your production URL, e.g. `https://your-app.vercel.app`)
   * `NEXTAUTH_SECRET` (your secure random secret key)
4. Click **Deploy**.
5. Once deployment completes, open the terminal in Vercel or locally to run production migrations and seeding:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
