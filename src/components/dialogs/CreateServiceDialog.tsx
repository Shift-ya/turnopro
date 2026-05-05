import * as React from "react";
import { BaseFormDialog, type FormField } from "./BaseFormDialog";
import type { ApiService } from "@/lib/api";

interface CreateServiceDialogProps {
  onSave: (data: { name: string; description: string; duration: number; price: number; category: string }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateServiceDialog: React.FC<CreateServiceDialogProps> = ({
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
    },
    {
      id: "description",
      label: "Descripción",
      type: "textarea",
      placeholder: "Describe qué incluye este servicio...",
    },
    {
      id: "category",
      label: "Categoría",
      type: "text",
      placeholder: "Masajes, Tratamientos, etc.",
    },
    {
      id: "duration",
      label: "Duración (minutos)",
      type: "number",
      placeholder: "60",
      required: true,
    },
    {
      id: "price",
      label: "Precio ($)",
      type: "number",
      placeholder: "0",
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, string | number>) => {
    await onSave({
      name: data.name as string,
      description: data.description as string,
      category: data.category as string,
      duration: Number(data.duration),
      price: Number(data.price),
    });
  };

  return (
    <BaseFormDialog
      title="Agregar nuevo servicio"
      description="Completa los datos del servicio que deseas agregar"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Agregar servicio"
      triggerLabel="Agregar Servicio"
      isLoading={isLoading}
    />
  );
};
