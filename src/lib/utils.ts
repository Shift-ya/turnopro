/**
 * Utilidad para combinar clases de Tailwind CSS
 * Permite usar className condicional de forma limpia
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
