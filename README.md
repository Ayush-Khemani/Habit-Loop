# HabitLoop - Social Habit Accountability App

## 🎯 Problem Statement
People don't stick to habits because they lack accountability and social support. HabitLoop fixes this by creating small accountability groups where members check in daily and keep each other motivated.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel (frontend) + Railway (database)

## 🚀 Quick Start

**→ First time? Use [YOUR_STEPS.md](./YOUR_STEPS.md)** for a short guide with **free database options** (Neon, Supabase, ElephantSQL — no Railway needed) and exact commands.

### Prerequisites
- Node.js 18+
- PostgreSQL database (free tier from Neon / Supabase / ElephantSQL — see YOUR_STEPS.md)
- npm or yarn

### Installation

```bash
# Install dependencies (required first)
npm install

# Set up environment variables
# Copy .env.example to .env.local and fill in your values:
#   DATABASE_URL - PostgreSQL connection string
#   NEXTAUTH_SECRET - run: openssl rand -base64 32
#   NEXTAUTH_URL - http://localhost:3000 for local dev
cp .env.example .env.local
# (On Windows: copy .env.example .env.local)

# Generate Prisma client and create database tables
npx prisma generate
npx prisma db push

# Optional: seed demo data (demo@habitloop.com / password123)
npm run db:seed

# Run development server
npm run dev
```

Visit **http://localhost:3000**

- **Home**: Landing page with Login / Get Started
- **Sign up**: Create account → redirects to Dashboard
- **Login**: Sign in → redirects to Dashboard
- **Dashboard**: View habits, add habits, daily check-in, see streaks

## 📁 Project Structure

```
habitloop/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Main app pages
│   │   └── layout.tsx
│   ├── components/            # React components
│   │   ├── ui/               # shadcn components
│   │   └── features/         # Feature-specific components
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── public/
```

## 🎯 MVP Features

### Phase 1 (Week 1-2)
- [x] User authentication (signup/login)
- [x] Create habits
- [x] Join groups
- [x] Daily check-ins
- [x] Group feed
- [x] Basic streaks

### Phase 2 (Week 3-4)
- [ ] Notifications system
- [ ] Weekly reports
- [ ] Group rankings
- [ ] Mobile responsive design

## 📊 Database Schema

### Core Models
- **Users**: User accounts
- **Habits**: Individual habits
- **Groups**: Accountability groups
- **GroupMembers**: Group membership
- **HabitCheckins**: Daily check-in records

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 📝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/habit-creation
   ```

2. **Make changes and test**
   ```bash
   npm run dev
   ```

3. **Update database schema if needed**
   ```bash
   npx prisma db push
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add habit creation feature"
   git push
   ```

## 🚢 Deployment

### Database (Railway)
1. Create a PostgreSQL database on Railway
2. Copy the connection string
3. Add to Vercel environment variables

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Add environment variables
3. Deploy

## 🤝 Contributing

This is a learning project. Feel free to experiment and improve!

## 📄 License

MIT
