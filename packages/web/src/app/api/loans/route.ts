import type { NextRequest, NextResponse } from 'next/server'
import db from '@/db'

export const revalidate = 60

export async function GET(req: NextRequest, res: NextResponse) {
  return Response.json({
    loans: await db.loan.findMany(),
  })
}
