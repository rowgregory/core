import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'

export async function POST(req: NextRequest, { params }: any) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reportType, description } = await req.json()

    const report = await prisma.suspiciousActivityReport.create({
      data: {
        reportType,
        description,
        reporterId: session.user.id,
        chapterId: params.chapterId,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ success: true, report })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
