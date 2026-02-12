import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">HabitLoop</h1>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-bold tracking-tight">
              Build Better Habits with
              <span className="text-primary"> Social Accountability</span>
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join small accountability groups. Check in daily. Keep each other motivated.
              The social pressure and support combo that actually works.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg">
                Start Building Habits Today
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold">Why HabitLoop Works</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 text-4xl">👥</div>
                <h4 className="mb-2 text-xl font-semibold">Social Accountability</h4>
                <p className="text-muted-foreground">
                  Join groups of 3-6 people working on similar habits. When someone misses a check-in,
                  the whole group knows.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 text-4xl">🔥</div>
                <h4 className="mb-2 text-xl font-semibold">Daily Check-ins</h4>
                <p className="text-muted-foreground">
                  Simple tap to confirm you completed your habit. Build streaks and see your progress
                  alongside your group.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 text-4xl">📊</div>
                <h4 className="mb-2 text-xl font-semibold">Track Progress Together</h4>
                <p className="text-muted-foreground">
                  Weekly reports show consistency scores and group rankings. Celebrate wins together
                  and support each other through challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="mb-6 text-3xl font-bold">Ready to build lasting habits?</h3>
            <p className="mb-8 text-xl text-muted-foreground">
              Join thousands of people holding each other accountable.
            </p>
            <Link href="/signup">
              <Button size="lg">Create Your Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 HabitLoop. Built with accountability in mind.
        </div>
      </footer>
    </div>
  )
}
