import prisma from '@/prisma/client'

export async function getLinkedRecord(action: string, id: string) {
  if (action === 'referral') {
    const record = await prisma.treasureMap.findUnique({
      where: { id },
      select: {
        id: true,
        clientName: true,
        clientPhone: true,
        serviceNeeded: true,
        notes: true,
        status: true,
        createdAt: true,
        giver: { select: { name: true, company: true } },
        receiver: { select: { name: true, company: true } }
      }
    })
    return record ? { type: 'referral', data: { ...record, createdAt: record.createdAt.toISOString() } } : null
  }

  if (action === 'f2f') {
    const record = await prisma.parley.findUnique({
      where: { id },
      select: {
        id: true,
        scheduledAt: true,
        notes: true,
        status: true,
        createdAt: true,
        requester: { select: { name: true, company: true } },
        recipient: { select: { name: true, company: true } }
      }
    })
    return record
      ? {
          type: 'f2f',
          data: { ...record, scheduledAt: record.scheduledAt.toISOString(), createdAt: record.createdAt.toISOString() }
        }
      : null
  }

  if (action === 'closed') {
    const record = await prisma.anchor.findUnique({
      where: { id },
      select: {
        id: true,
        businessValue: true,
        description: true,
        closedDate: true,
        notes: true,
        status: true,
        createdAt: true,
        giver: { select: { name: true, company: true } },
        receiver: { select: { name: true, company: true } }
      }
    })
    return record
      ? {
          type: 'closed',
          data: {
            ...record,
            businessValue: Number(record.businessValue),
            closedDate: record.closedDate.toISOString(),
            createdAt: record.createdAt.toISOString()
          }
        }
      : null
  }

  return null
}
