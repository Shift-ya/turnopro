import * as React from "react";
import { BaseFormDialog, type FormField } from "./BaseFormDialog";

interface CreateProfessionalDialogProps {
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    speciality: string;
    active: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateProfessionalDialog: React.FC<CreateProfessionalDialogProps> = ({
  onSave,
  isLoading = false,
}) => {
  const fields: FormField[] = [
    {
      id: "fullName",
      label: "Nombre y apellido",
      type: "text",
      placeholder: "Juan Perez",
      required: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "juan@empresa.com",
      required: true,
    },
    {
      id: "phone",
      label: "Teléfono",
      type: "text",
      placeholder: "+54 9 1234567890",
    },
    {
      id: "speciality",
      label: "Especialidad",
      type: "text",
      placeholder: "General",
    },
    {
      id: "active",
      label: "Activo",
      type: "select",
      required: true,
      options: [
        { value: "true", label: "Sí" },
        { value: "false", label: "No" },
      ],
      defaultValue: "true",
    },
  ];

  const handleSubmit = async (data: Record<string, string | number>) => {
    const fullNameRaw = data.fullName as string;
    const fullName = fullNameRaw.trim();
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "-";

    await onSave({
      firstName,
      lastName,
      email: data.email as string,
      phone: data.phone as string,
      speciality: (data.speciality as string) || "General",
      active: (data.active as string) === "true",
    });
  };

  return (
    <BaseFormDialog
      title="Agregar Profesional"
      description="Completa los datos del profesional"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
      triggerLabel="+ Agregar Profesional"
      isLoading={isLoading}
      triggerAsChild={false}
    />
  );
};

