import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

/**
 * Hook personalizado para usar toasts en cualquier componente
 * Proporciona métodos helper para los tipos más comunes
 *
 * Uso:
 * const { show, success, error, warning } = useToast();
 * success({ message: 'Profesional actualizado' });
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }

  return {
    /**
     * Muestra un toast personalizado
     */
    show: context.show,

    /**
     * Muestra un toast de éxito
     */
    success: (props: Parameters<typeof context.show>[0]) =>
      context.show({
        variant: 'success',
        duration: 3000,
        ...props,
      }),

    /**
     * Muestra un toast de error
     */
    error: (props: Parameters<typeof context.show>[0]) =>
      context.show({
        variant: 'error',
        duration: 4000,
        ...props,
      }),

    /**
     * Muestra un toast de advertencia
     */
    warning: (props: Parameters<typeof context.show>[0]) =>
      context.show({
        variant: 'warning',
        duration: 4000,
        ...props,
      }),

    /**
     * Muestra un toast de info
     */
    info: (props: Parameters<typeof context.show>[0]) =>
      context.show({
        variant: 'default',
        duration: 3000,
        ...props,
      }),
  };
}
