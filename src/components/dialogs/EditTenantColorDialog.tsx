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

  const presetColors = ["#2ed7ff", "#5e92ff", "#7f4dff", "#f52ccf", "#17c47d", "#f2a93b", "#ef4f7f", "#71717a"];

  const handleConfirm = () => {
    onSave(primaryColor);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {colorCircle ? (
          <button
            className="h-12 w-12 cursor-pointer rounded-full border-2 border-white/10 transition hover:scale-105 hover:border-white/20"
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
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="eyebrow w-fit">Brand color</div>
          <DialogTitle>Color primario del tema</DialogTitle>
          <DialogDescription>Elige un color predefinido o usa un valor hexadecimal personalizado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label>Colores predefinidos</Label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-11 w-11 rounded-full border-2 transition-all ${
                    primaryColor === color ? "scale-110 border-white shadow-[0_0_0_4px_rgba(94,146,255,0.15)]" : "border-white/10 hover:scale-105 hover:border-white/20"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimaryColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Color personalizado</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-2xl border border-white/10 bg-[#0d0d0d] p-1"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  if (e.target.value.startsWith("#") && e.target.value.length === 7) {
                    setPrimaryColor(e.target.value);
                  }
                }}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/5 p-4" style={{ boxShadow: `inset 0 0 0 1px ${primaryColor}20` }}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full border border-white/10" style={{ backgroundColor: primaryColor }} />
              <div>
                <p className="text-sm font-semibold text-white">Vista previa del color</p>
                <p className="text-xs text-[#a1a1aa]">{primaryColor}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
