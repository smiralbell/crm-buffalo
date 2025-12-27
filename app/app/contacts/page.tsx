import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { CreateContactDialog } from '@/components/create-contact-dialog'
import { ContactRowActions } from '@/components/contact-row-actions'

async function getContacts(search?: string) {
  const where = search
    ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { empresa: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  return prisma.contact.findMany({
    where,
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      nombre: true,
      email: true,
      empresa: true,
      telefono: true,
      instagram_user: true,
      direccion_fiscal: true,
      ciudad: true,
      codigo_postal: true,
      pais: true,
      cif: true,
      dni: true,
      iban: true,
      leads: {
        select: {
          id: true,
        },
        take: 1, // Solo necesitamos saber si tiene leads, no todos
      },
    },
  })
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const contacts = await getContacts(searchParams.search)

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <form action="/app/contacts" method="get" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search contacts..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <CreateContactDialog />
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Lead</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact: any) => (
                  <tr key={contact.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      {contact.nombre || '-'}
                    </td>
                    <td className="px-4 py-3">{contact.email}</td>
                    <td className="px-4 py-3">{contact.empresa || '-'}</td>
                    <td className="px-4 py-3">{contact.telefono || '-'}</td>
                    <td className="px-4 py-3">
                      {(contact.leads && contact.leads.length > 0) ? (
                        <span className="text-sm text-primary">Yes</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ContactRowActions contact={{
                        id: contact.id,
                        nombre: contact.nombre,
                        email: contact.email,
                        instagram_user: contact.instagram_user,
                        telefono: contact.telefono,
                        empresa: contact.empresa,
                        direccion_fiscal: contact.direccion_fiscal,
                        ciudad: contact.ciudad,
                        codigo_postal: contact.codigo_postal,
                        pais: contact.pais,
                        cif: contact.cif,
                        dni: contact.dni,
                        iban: contact.iban,
                      }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No contacts found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

