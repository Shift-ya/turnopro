import * as React from "react";
import { BaseFormDialog, type FormField } from "./BaseFormDialog";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiService } from "@/lib/api";

interface EditServiceDialogProps {
  service: ApiService;
  onSave: (data: { name: string; description: string; duration: number; price: number; active: boolean; category: string }) => Promise<void>;
  isLoading?: boolean;
}

export const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  service,
  onSave,
  isLoading = false,
}) => {
  const fields: FormField[] = [
    {
      id: "name",
      label: "Nombre del servicio",
      type: "text",
      placeholder: "Masaje relajante",
      required: true,
      defaultValue: service.name,
    },
    {
      id: "description",
      label: "Descripción",
      type: "textarea",
      placeholder: "Describe qué incluye este servicio...",
      defaultValue: service.description || "",
    },
    {
      id: "category",
      label: "Categoría",
      type: "text",
      placeholder: "Masajes, Tratamientos, etc.",
      defaultValue: service.category || "General",
    },
    {
      id: "duration",
      label: "Duración (minutos)",
      type: "number",
      placeholder: "60",
      required: true,
      defaultValue: service.duration,
    },
    {
      id: "price",
      label: "Precio ($)",
      type: "number",
      placeholder: "0",
      required: true,
      defaultValue: service.price,
    },
  ];

  const handleSubmit = async (data: Record<string, string | number>) => {
    await onSave({
      name: data.name as string,
      description: data.description as string,
      category: data.category as string,
      duration: Number(data.duration),
      price: Number(data.price),
      active: service.active,
    });
  };

  return (
    <BaseFormDialog
      triggerLabel="Editar"
      triggerVariant="outline"
      title="Editar Servicio"
      description={`Actualizando "${service.name}"`}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Actualizar"
      isLoading={isLoading}
      triggerAsChild
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-blue-100 transition-all duration-200"
        title="Editar"
      >
        <Pencil className="h-4 w-4 transition-transform group-hover:scale-110" />
      </Button>
    </BaseFormDialog>
  );
};
