/**
 * Toast utilities para uso en operaciones comunes
 * DRY: Centraliza la lógica de toasts para operaciones CRUD
 */

import type { ToastProps } from '@/types/toast';
import { TOAST_MESSAGES } from '@/types/toast';

/**
 * Maneja una operación asíncrona y muestra toasts automáticamente
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    show: (props: ToastProps) => void;
    successMessage?: Omit<ToastProps, 'variant'>;
    errorMessage?: Omit<ToastProps, 'variant'>;
  }
): Promise<T | null> {
  try {
    const result = await operation();
    if (options.successMessage) {
      options.show({
        variant: 'success',
        duration: 3000,
        ...options.successMessage,
      });
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    options.show({
      variant: 'error',
      duration: 4000,
      ...options.errorMessage,
      message: options.errorMessage?.message || message,
    });
    return null;
  }
}

/**
 * Toasts predefinidas para profesionales
 */
export const professionalToasts = {
  updateSuccess: () => TOAST_MESSAGES.professional.updateSuccess,
  updateError: () => TOAST_MESSAGES.professional.updateError,
  deleteSuccess: () => TOAST_MESSAGES.professional.deleteSuccess,
  deleteError: () => TOAST_MESSAGES.professional.deleteError,
  createSuccess: () => TOAST_MESSAGES.professional.createSuccess,
  createError: () => TOAST_MESSAGES.professional.createError,
} as const;

/**
 * Toasts predefinidas para servicios
 */
export const serviceToasts = {
  updateSuccess: () => TOAST_MESSAGES.service.updateSuccess,
  updateError: () => TOAST_MESSAGES.service.updateError,
  deleteSuccess: () => TOAST_MESSAGES.service.deleteSuccess,
  deleteError: () => TOAST_MESSAGES.service.deleteError,
  createSuccess: () => TOAST_MESSAGES.service.createSuccess,
  createError: () => TOAST_MESSAGES.service.createError,
} as const;

/**
 * Toasts predefinidas para citas
 */
export const appointmentToasts = {
  createSuccess: () => TOAST_MESSAGES.appointment.createSuccess,
  createError: () => TOAST_MESSAGES.appointment.createError,
  cancelSuccess: () => TOAST_MESSAGES.appointment.cancelSuccess,
  cancelError: () => TOAST_MESSAGES.appointment.cancelError,
} as const;
