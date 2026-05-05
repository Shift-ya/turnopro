import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
}

interface BaseFormDialogProps {
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string | number>) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  triggerAsChild?: boolean;
}

export const BaseFormDialog = ({
  triggerLabel = "Abrir",
  triggerVariant = "default",
  title,
  description,
  fields,
  onSubmit,
  submitLabel = "Guardar cambios",
  cancelLabel = "Cancelar",
  isLoading = false,
  children,
  triggerAsChild = false,
}: BaseFormDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const initialData: Record<string, string | number> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue || "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (id: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={triggerAsChild}>
        {children ? (
          children
        ) : (
          <Button variant={triggerVariant}>{triggerLabel}</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="animate-in fade-in slide-in-from-top-2 duration-500">{title}</DialogTitle>
          {description && <DialogDescription className="animate-in fade-in slide-in-from-top-2 duration-500 delay-75">{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className={`space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-${idx * 75}`} style={{ animationDelay: `${idx * 75}ms` }}>
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 transition-all"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 transition-all"
                >
                  <option value="">Selecciona una opción</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 transition-all"
                />
              )}
            </div>
          ))}

          <DialogFooter className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting || isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={submitting || isLoading}
            >
              {submitting || isLoading ? "Guardando..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
