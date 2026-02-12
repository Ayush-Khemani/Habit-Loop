import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma, ensureDb } from '@/lib/prisma'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: Request) {
  try {
    await ensureDb()
    const body = await req.json()
    const { name, email, password } = signupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    const isDev = process.env.NODE_ENV === 'development'
    const errMessage = error instanceof Error ? error.message : String(error)
    const errCode = error && typeof error === 'object' && 'code' in error ? String((error as { code: string }).code) : ''
    console.error('Signup error:', errMessage, errCode || '', error)

    if (errMessage.includes('relation') && errMessage.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database tables missing. Run: npx prisma db push with your production DATABASE_URL in .env' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Something went wrong',
        debug: errMessage + (errCode ? ` [${errCode}]` : ''),
      },
      { status: 500 }
    )
  }
}
