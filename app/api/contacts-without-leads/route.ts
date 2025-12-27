import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const contactsWithLeads = await prisma.lead.findMany({
      select: { contact_id: true },
    })
    const contactIdsWithLeads = new Set(contactsWithLeads.map((l: { contact_id: number }) => l.contact_id))

    const contacts = await prisma.contact.findMany({
      where: {
        id: {
          notIn: Array.from(contactIdsWithLeads),
        },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
      },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

