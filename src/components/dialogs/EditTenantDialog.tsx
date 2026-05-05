import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export const EditTenantDialog: React.FC<EditTenantDialogProps> = ({
  tenant,
  onSave,
  isLoading = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [primaryColor, setPrimaryColor] = React.useState(
    tenant.primaryColor || "#6366f1"
  );
  const [formData, setFormData] = React.useState({
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone || "",
    address: tenant.address || "",
    slug: tenant.slug,
  });

  // Sincronizar el estado local cuando el tenant cambia
  React.useEffect(() => {
    setPrimaryColor(tenant.primaryColor || "#6366f1");
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
      primaryColor: primaryColor,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar datos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar información del negocio</DialogTitle>
          <DialogDescription>
            Actualiza los datos de tu negocio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del negocio</Label>
            <Input
              id="name"
              placeholder="Mi Negocio"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email del negocio</Label>
            <Input
              id="email"
              type="email"
              placeholder="info@mynegocio.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="+54 9 11 1234-5678"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Calle Principal 123, Piso 4"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL pública (slug)</Label>
            <Input
              id="slug"
              placeholder="mi-negocio"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Color Picker Button */}
          <div className="space-y-2">
            <Label>Color primario</Label>
            <div className="flex items-center gap-3">
              <EditTenantColorDialog
                initialColor={primaryColor}
                onSave={(color) => setPrimaryColor(color)}
                isLoading={isLoading}
                triggerAsButton={true}
                colorCircle={true}
              />
              <span className="text-sm text-gray-600">{primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveData} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
