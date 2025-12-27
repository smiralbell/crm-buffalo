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
import { Plus } from 'lucide-react'
import { createContact } from '@/app/actions/contacts'
import { useRouter } from 'next/navigation'

export function CreateContactDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createContact(formData)
    setLoading(false)
    
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to create contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Create Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your CRM
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Basic Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Name</Label>
                    <Input id="nombre" name="nombre" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram_user">Instagram</Label>
                    <Input id="instagram_user" name="instagram_user" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Phone</Label>
                    <Input id="telefono" name="telefono" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="empresa">Company</Label>
                    <Input id="empresa" name="empresa" />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Datos fiscales</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="direccion_fiscal">Dirección Fiscal</Label>
                    <Input id="direccion_fiscal" name="direccion_fiscal" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input id="ciudad" name="ciudad" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="codigo_postal">Código Postal</Label>
                      <Input id="codigo_postal" name="codigo_postal" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pais">País</Label>
                    <Input id="pais" name="pais" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cif">CIF</Label>
                      <Input id="cif" name="cif" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dni">DNI</Label>
                      <Input id="dni" name="dni" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input id="iban" name="iban" />
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
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

