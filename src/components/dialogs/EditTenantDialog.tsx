import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EditTenantColorDialog } from "./EditTenantColorDialog";
import type { ApiTenant } from "@/lib/api";

interface EditTenantDialogProps {
  tenant: ApiTenant;
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    slug: string;
    primaryColor: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const EditTenantDialog: React.FC<EditTenantDialogProps> = ({ tenant, onSave, isLoading = false }) => {
  const [open, setOpen] = React.useState(false);
  const [primaryColor, setPrimaryColor] = React.useState(tenant.primaryColor || "#5e92ff");
  const [formData, setFormData] = React.useState({
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone || "",
    address: tenant.address || "",
    slug: tenant.slug,
  });

  React.useEffect(() => {
    setPrimaryColor(tenant.primaryColor || "#5e92ff");
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone || "",
      address: tenant.address || "",
      slug: tenant.slug,
    });
  }, [tenant]);

  const handleSaveData = async () => {
    await onSave({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      slug: formData.slug,
      primaryColor,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar datos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="eyebrow w-fit">Configuracion</div>
          <DialogTitle>Editar informacion del negocio</DialogTitle>
          <DialogDescription>Actualiza los datos visibles de tu negocio y define el color principal del tema.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del negocio</Label>
            <Input id="name" placeholder="Mi Negocio" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email del negocio</Label>
            <Input id="email" type="email" placeholder="info@minegocio.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input id="phone" placeholder="+54 9 11 1234-5678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Direccion</Label>
            <Input id="address" placeholder="Calle Principal 123, Piso 4" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL publica (slug)</Label>
            <Input id="slug" placeholder="mi-negocio" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} disabled={isLoading} />
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <Label>Color primario</Label>
            <div className="mt-3 flex items-center gap-3">
              <EditTenantColorDialog
                initialColor={primaryColor}
                onSave={(color) => setPrimaryColor(color)}
                isLoading={isLoading}
                triggerAsButton
                colorCircle
              />
              <span className="text-sm font-medium text-[#a1a1aa]">{primaryColor}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSaveData} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
