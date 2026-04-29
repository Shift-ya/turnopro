import * as React from "react";
import { BaseFormDialog, type FormField } from "./BaseFormDialog";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiProfessional } from "@/lib/api";

interface EditProfessionalDialogProps {
  professional: ApiProfessional;
  onSave: (data: { firstName: string; lastName: string; email: string; phone: string; speciality: string; active: boolean }) => Promise<void>;
  isLoading?: boolean;
}

export const EditProfessionalDialog: React.FC<EditProfessionalDialogProps> = ({
  professional,
  onSave,
  isLoading = false,
}) => {
  const [firstName, ...lastNameParts] = professional.name.split(" ");
  const lastName = lastNameParts.join(" ") || "-";

  const fields: FormField[] = [
    {
      id: "firstName",
      label: "Nombre",
      type: "text",
      placeholder: "Juan",
      required: true,
      defaultValue: firstName,
    },
    {
      id: "lastName",
      label: "Apellido",
      type: "text",
      placeholder: "Pérez",
      required: true,
      defaultValue: lastName,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "juan@example.com",
      required: true,
      defaultValue: professional.email || "",
    },
    {
      id: "phone",
      label: "Teléfono",
      type: "text",
      placeholder: "+34 612 345 678",
      defaultValue: professional.phone || "",
    },
    {
      id: "speciality",
      label: "Especialidad",
      type: "text",
      placeholder: "Masaje terapéutico, Pilates, etc.",
      defaultValue: professional.speciality || "General",
    },
  ];

  const handleSubmit = async (data: Record<string, string | number>) => {
    await onSave({
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      email: data.email as string,
      phone: data.phone as string,
      speciality: data.speciality as string,
      active: professional.active,
    });
  };

  return (
    <BaseFormDialog
      triggerLabel="Editar"
      triggerVariant="outline"
      title="Editar Profesional"
      description={`Actualizando información de ${professional.name}`}
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
