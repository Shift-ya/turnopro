import { createContext, useRef, ReactNode } from 'react';
import Toaster, { type ToasterRef } from '@/components/ui/toaster';
import type { ToastProps } from '@/types/toast';

interface ToastContextType {
  show: (props: ToastProps) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provider de Toast que envuelve toda la aplicación
 * Proporciona el contexto para usar useToast() en cualquier componente
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const toasterRef = useRef<ToasterRef>(null);

  const show = (props: ToastProps) => {
    if (toasterRef.current) {
      toasterRef.current.show(props);
    }
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toaster ref={toasterRef} />
    </ToastContext.Provider>
  );
}
