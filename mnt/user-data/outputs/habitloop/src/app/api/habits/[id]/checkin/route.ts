import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/habits/[id]/checkin
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habitId = params.id
    
    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      }
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create or update check-in for today
    const checkin = await prisma.habitCheckin.upsert({
      where: {
        habitId_date: {
          habitId,
          date: today,
        }
      },
      update: {
        completed: true,
      },
      create: {
        habitId,
        userId: session.user.id,
        date: today,
        completed: true,
      }
    })

    return NextResponse.json({ checkin })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to create check-in' },
      { status: 500 }
    )
  }
}

// DELETE /api/habits/[id]/checkin - Undo today's check-in
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habitId = params.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.habitCheckin.deleteMany({
      where: {
        habitId,
        userId: session.user.id,
        date: today,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to delete check-in' },
      { status: 500 }
    )
  }
}
