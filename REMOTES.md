# Git remotes

This project uses two remotes:

| Remote   | Repo        | Use                          |
|----------|-------------|------------------------------|
| **origin** | Habit-Loop  | Main repo (where you push first) |
| **vercel** | habitloop   | Connected to Vercel – push here to deploy |

## Push to both (so Vercel gets the latest)

```powershell
git push origin main
git push vercel main
```

Or push only to Vercel to trigger a deploy:

```powershell
git push vercel main
```

If `git push vercel main` says the histories diverged, use (only if you’re sure):

```powershell
git push vercel main --force
```

That overwrites the **habitloop** repo with your current **Habit-Loop** code and triggers a Vercel deploy.
