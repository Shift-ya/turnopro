import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteDialogProps {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => Promise<void> | void;
  children: React.ReactNode;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  title = "Confirmar eliminacion",
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  isLoading = false,
  onConfirm,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error en confirmacion:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button onClick={() => setOpen(true)} className="contents">
        {children}
      </button>

      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-rose-400/20 bg-rose-400/10 text-rose-200">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f52ccf]">Accion sensible</div>
              <DialogTitle className="mt-2">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting || isLoading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={submitting || isLoading}>
            {submitting ? "Eliminando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
