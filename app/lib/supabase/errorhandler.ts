import { toast } from 'sonner'; // Asumiendo que usas Sonner para los toasts

export function handleSupabaseError(error: unknown, defaultMessage: string = 'Ocurrió un error.') {
  console.error("Supabase Error:", error);
  if (error && typeof error === 'object' && 'message' in error) {
    toast.error((error as { message: string }).message);
  } else {
    toast.error(defaultMessage);
  }
}