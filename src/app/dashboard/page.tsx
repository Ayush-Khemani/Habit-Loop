'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getDateString, calculateStreak, formatDate } from '@/lib/utils'
import { Check, Plus, LogOut, Flame } from 'lucide-react'

type Habit = {
  id: string
  title: string
  description: string | null
  frequency: string
  category: string | null
  checkins: { id: string; date: string; completed: boolean }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ title: '', description: '', frequency: 'DAILY' as const })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      fetchHabits()
    }
  }, [status, router])

  async function fetchHabits() {
    try {
      const res = await fetch('/api/habits')
      if (res.ok) {
        const data = await res.json()
        setHabits(data.habits || [])
      }
    } catch (err) {
      console.error('Failed to fetch habits', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckin(habitId: string) {
    try {
      const res = await fetch(`/api/habits/${habitId}/checkin`, { method: 'POST' })
      if (res.ok) {
        await fetchHabits()
      }
    } catch (err) {
      console.error('Check-in failed', err)
    }
  }

  async function handleAddHabit(e: React.FormEvent) {
    e.preventDefault()
    if (!newHabit.title.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newHabit.title.trim(),
          description: newHabit.description.trim() || undefined,
          frequency: newHabit.frequency,
        }),
      })
      if (res.ok) {
        setNewHabit({ title: '', description: '', frequency: 'DAILY' })
        setShowAddForm(false)
        await fetchHabits()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create habit')
      }
    } catch (err) {
      console.error('Create habit failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  const today = getDateString()

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="text-2xl font-bold">
            HabitLoop
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Habits</h1>
            <p className="text-muted-foreground">
              Check in daily to build streaks and stay accountable.
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add habit
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New habit</CardTitle>
              <CardDescription>Give it a name and optional description.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddHabit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="e.g. Morning run"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input
                    placeholder="e.g. 5k before work"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create habit'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {habits.length === 0 && !showAddForm ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">No habits yet. Add your first one to get started.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => {
              const checkinsWithDate = habit.checkins.map((c) => ({
                ...c,
                date: new Date(c.date),
              }))
              const streak = calculateStreak(
                checkinsWithDate.map((c) => ({ date: c.date, completed: c.completed }))
              )
              const checkedInToday = habit.checkins.some(
                (c) => getDateString(new Date(c.date)) === today
              )
              return (
                <Card key={habit.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{habit.title}</CardTitle>
                      {habit.description && (
                        <CardDescription>{habit.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-medium">{streak} day streak</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Today: {checkedInToday ? 'Done' : 'Not yet'}
                      </span>
                      <Button
                        size="sm"
                        variant={checkedInToday ? 'secondary' : 'default'}
                        disabled={checkedInToday}
                        onClick={() => handleCheckin(habit.id)}
                      >
                        {checkedInToday ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Done
                          </>
                        ) : (
                          'Check in'
                        )}
                      </Button>
                    </div>
                    {habit.checkins.length > 0 && habit.checkins[0] && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Last: {formatDate(habit.checkins[0].date)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
