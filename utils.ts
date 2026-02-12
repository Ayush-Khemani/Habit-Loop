import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function calculateStreak(checkins: { date: Date; completed: boolean }[]): number {
  if (checkins.length === 0) return 0
  
  const sortedCheckins = checkins
    .filter(c => c.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  if (sortedCheckins.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedCheckins.length; i++) {
    const checkinDate = new Date(sortedCheckins[i].date)
    checkinDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (checkinDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getConsistencyScore(checkins: { completed: boolean }[], totalDays: number): number {
  if (totalDays === 0) return 0
  const completedDays = checkins.filter(c => c.completed).length
  return Math.round((completedDays / totalDays) * 100)
}
