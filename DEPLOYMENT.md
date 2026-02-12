# Deployment Guide for HabitLoop

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Railway account (for PostgreSQL)

## Step 1: Database Setup (Railway)

1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Provision PostgreSQL"
3. Once created, click on the PostgreSQL service
4. Go to "Variables" tab
5. Copy the `DATABASE_URL` value

## Step 2: Prepare Your Code

1. Initialize Git repository:
```bash
cd habitloop
git init
git add .
git commit -m "Initial commit"
```

2. Create GitHub repository and push:
```bash
git remote add origin https://github.com/yourusername/habitloop.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "Add New Project"
3. Import your HabitLoop repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   - `DATABASE_URL`: (paste from Railway)
   - `NEXTAUTH_SECRET`: (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: (will be your Vercel URL, e.g., `https://habitloop.vercel.app`)

6. Click "Deploy"

## Step 4: Post-Deployment Setup

After deployment completes:

1. Go to your Vercel project settings
2. Update `NEXTAUTH_URL` to your actual Vercel URL
3. Redeploy if needed

## Step 5: Database Migration

The database schema will automatically sync on first deployment because we're using `prisma db push` in the build process.

However, for production, you should:

1. Run migrations locally first:
```bash
npx prisma migrate dev --name init
```

2. Update your `package.json` build script:
```json
"build": "prisma migrate deploy && next build"
```

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string from Railway
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your production URL (e.g., `https://habitloop.vercel.app`)

### Optional (for future features)
- `SMTP_HOST` - For email notifications
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password

## Monitoring and Maintenance

### View Logs
- Vercel: Project → Deployments → Click deployment → Logs
- Railway: Service → Deployments → View logs

### Database Management
```bash
# View database in browser
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

### Scaling Considerations

**Free Tier Limits:**
- Vercel: 100GB bandwidth/month, 100 deployments/day
- Railway: 500 hours/month, 1GB storage (sufficient for MVP)

**When to upgrade:**
- More than 1000 daily active users → Upgrade Railway
- Heavy traffic → Consider Vercel Pro
- Need custom domain → Available on free tier!

## Custom Domain Setup

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `habitloop.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to use custom domain
5. Redeploy

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all environment variables are set
- Verify `package.json` scripts are correct

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check Railway database is running
- Ensure IP whitelist allows Vercel (Railway allows all by default)

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Production Checklist

Before launching to users:

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (auto with Vercel)
- [ ] Error tracking setup (e.g., Sentry)
- [ ] Analytics configured (e.g., PostHog, Google Analytics)
- [ ] Backup strategy for database
- [ ] Monitoring alerts configured

## Backup Strategy

### Automated Backups (Railway)
Railway Pro includes automated daily backups. For free tier:

1. Set up a cron job to export data:
```bash
# Create backup script
npx prisma db pull
pg_dump $DATABASE_URL > backup.sql
```

2. Use GitHub Actions to run weekly backups

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20240115.sql
```

## CI/CD Pipeline

For automatic deployments:

1. Vercel automatically deploys on every push to `main`
2. Preview deployments for pull requests
3. Run tests before deployment:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm test
```

## Performance Optimization

### Before Launch
- [ ] Enable Vercel Speed Insights
- [ ] Configure image optimization
- [ ] Set up CDN for static assets
- [ ] Enable compression

### Monitoring
- Use Vercel Analytics for real-time metrics
- Monitor API response times
- Track database query performance with Prisma

---

**You're ready to deploy!** 🚀

The entire setup should take about 15-20 minutes. Once deployed, share your Vercel URL to start testing with real users.
