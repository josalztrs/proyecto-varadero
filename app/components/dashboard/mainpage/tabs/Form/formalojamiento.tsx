// Fecha de Ocupación: Debe ser una fecha válida y no futura
export const validateFecha = (value: string) => {
  if (!value) return 'La fecha es obligatoria.';
  const fecha = new Date(value);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha.getTime())) {
    return 'La fecha no es válida.';
  }
  if (fecha > hoy) {
    return 'La fecha no puede ser futura.';
  }
  return null;
};

// Doc. Ident. Cliente: VACIO o formato V/E/J/P/G- seguido de 7 a 9 dígitos, sin espacios ni caracteres extra
export const validateDocCliente = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed || trimmed === 'VACIO') {
    return null; // Permitir campo vacío o "VACIO" para desocupar
  }
  // Prefijo válido, guion, número de 8 o 9 dígitos, sin ceros a la izquierda, sin caracteres extra
  if (
    !/^(V|E|J|P|G)-[1-9]\d{7,8}$/.test(trimmed)
  ) {
    return 'El documento debe tener el formato V-12345678, J-123456789, sin ceros a la izquierda, ni espacios ni caracteres extra. O escriba "VACIO" para desocupar.';
  }
  return null;
};