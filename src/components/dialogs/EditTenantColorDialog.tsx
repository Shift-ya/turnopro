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

interface EditTenantColorDialogProps {
  initialColor: string;
  onSave: (color: string) => void;
  isLoading?: boolean;
  triggerAsButton?: boolean;
  colorCircle?: boolean;
}

export const EditTenantColorDialog: React.FC<EditTenantColorDialogProps> = ({
  initialColor,
  onSave,
  isLoading = false,
  triggerAsButton = false,
  colorCircle = false,
}) => {
  const [primaryColor, setPrimaryColor] = React.useState(initialColor);
  const [open, setOpen] = React.useState(false);

  const presetColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#64748b",
  ];

  const handleConfirm = () => {
    onSave(primaryColor);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {colorCircle ? (
          <button
            className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 transition cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            title="Click para editar color"
          />
        ) : triggerAsButton ? (
          <Button variant="outline" size="sm">
            Editar color
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            Editar color
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Color primario del tema</DialogTitle>
          <DialogDescription>
            Elige un color predefinido o personaliza con un valor hexadecimal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colores predefinidos
            </label>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    primaryColor === color
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimaryColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color personalizado
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-lg border-2 border-gray-300 p-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  if (
                    e.target.value.startsWith("#") &&
                    e.target.value.length === 7
                  ) {
                    setPrimaryColor(e.target.value);
                  }
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className="p-4 rounded-lg border-2"
            style={{ borderColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Vista previa del color
                </p>
                <p className="text-xs text-gray-500">{primaryColor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
