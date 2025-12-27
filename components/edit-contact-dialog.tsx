'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import { updateContact } from '@/app/actions/contacts'
import { useRouter } from 'next/navigation'

interface Contact {
  id: number
  nombre: string | null
  email: string
  instagram_user: string | null
  telefono: string | null
  empresa: string | null
  direccion_fiscal?: string | null
  ciudad?: string | null
  codigo_postal?: string | null
  pais?: string | null
  cif?: string | null
  dni?: string | null
  iban?: string | null
}

export function EditContactDialog({ 
  contact,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: { 
  contact: Contact
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateContact(contact.id, formData)
    setLoading(false)
    
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to update contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update contact information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Basic Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Name</Label>
                    <Input id="nombre" name="nombre" defaultValue={contact.nombre || ''} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" defaultValue={contact.email} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram_user">Instagram</Label>
                    <Input
                      id="instagram_user"
                      name="instagram_user"
                      defaultValue={contact.instagram_user || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Phone</Label>
                    <Input id="telefono" name="telefono" defaultValue={contact.telefono || ''} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="empresa">Company</Label>
                    <Input id="empresa" name="empresa" defaultValue={contact.empresa || ''} />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Datos fiscales</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="direccion_fiscal">Dirección Fiscal</Label>
                    <Input id="direccion_fiscal" name="direccion_fiscal" defaultValue={contact.direccion_fiscal || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input id="ciudad" name="ciudad" defaultValue={contact.ciudad || ''} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="codigo_postal">Código Postal</Label>
                      <Input id="codigo_postal" name="codigo_postal" defaultValue={contact.codigo_postal || ''} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pais">País</Label>
                    <Input id="pais" name="pais" defaultValue={contact.pais || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cif">CIF</Label>
                      <Input id="cif" name="cif" defaultValue={contact.cif || ''} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dni">DNI</Label>
                      <Input id="dni" name="dni" defaultValue={contact.dni || ''} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input id="iban" name="iban" defaultValue={contact.iban || ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

