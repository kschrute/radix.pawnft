import type { NextRequest, NextResponse } from 'next/server'
import db from '@/db'

export const revalidate = 60

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams
  const component = searchParams.get('component')

  if (!component) {
    return Response.error()
  }

  const loan = await db.loan.create({
    data: {
      component
    }
  })

  return Response.json({
    loan,
  })
}
