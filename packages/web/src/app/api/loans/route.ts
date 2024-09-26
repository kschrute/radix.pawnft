import db from '@/db'
import type { NextRequest, NextResponse } from 'next/server'

export const revalidate = 60

export async function GET(req: NextRequest, res: NextResponse) {
  return Response.json({
    loans: await db.loan.findMany(),
  })
}
