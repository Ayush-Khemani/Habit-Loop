import { NextResponse } from 'next/server'
import { prisma, ensureDb } from '@/lib/prisma'

/**
 * GET /api/health - Check DB connection. Open in browser to see the real error if signup fails.
 */
export async function GET() {
  try {
    await ensureDb()
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, db: 'connected' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    const code = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : ''
    console.error('Health check error:', msg, code)
    return NextResponse.json(
      { ok: false, error: msg, code: String(code) },
      { status: 500 }
    )
  }
}
