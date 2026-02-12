import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const groupSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  type: z.enum(['PUBLIC', 'PRIVATE', 'INVITE_ONLY']),
  maxMembers: z.number().min(2).max(10).default(6),
})

// GET /api/groups - Get all groups user is a member of
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          }
        },
        groupHabits: {
          include: {
            habit: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  }
                },
                checkins: {
                  where: {
                    date: {
                      gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ groups })
  } catch (error) {
    console.error('Get groups error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

// POST /api/groups - Create a new group
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = groupSchema.parse(body)

    // Generate invite code for invite-only groups
    const inviteCode = data.type === 'INVITE_ONLY' 
      ? Math.random().toString(36).substring(2, 10).toUpperCase()
      : undefined

    const group = await prisma.group.create({
      data: {
        ...data,
        inviteCode,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create group error:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}
