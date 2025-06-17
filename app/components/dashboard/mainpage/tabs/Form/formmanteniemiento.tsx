// Matrícula Embarcación: 3 letras mayúsculas, guion, 4 dígitos (ej: ABC-1234)
export const validateMatriculaEmb = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!/^[A-Z]{3}-\d{4}$/.test(trimmed)) {
    return 'La matrícula debe tener el formato ABC-1234 (3 letras, guion y 4 números).';
  }
  return null;
};

// Concepto de Mantenimiento: Letras, números, espacios, guiones, tildes. 3-32 caracteres, sin dobles espacios/guiones, ni al inicio/final.
export const validateConcepto = (value: string) => {
  const trimmed = value.trim();
  if (
    trimmed.length < 3 ||
    trimmed.length > 32 ||
    !/^[A-ZÁÉÍÓÚÑ0-9 -]+$/i.test(trimmed) ||
    /^[- ]|[- ]$/.test(trimmed) ||
    / {2,}/.test(trimmed) ||
    /--+/.test(trimmed)
  ) {
    return 'El concepto solo puede contener letras, números, espacios y guiones, entre 3 y 32 caracteres, sin dobles espacios/guiones ni al inicio/final.';
  }
  return null;
};

// Fecha de Mantenimiento: Debe ser una fecha válida y no futura
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

// Precio: Número positivo, máximo 4 dígitos enteros, puede tener decimales (hasta 2)
export const validatePrecio = (value: string | number) => {
  const str = String(value).trim();
  // Permite hasta 4 dígitos enteros y opcionalmente hasta 2 decimales
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(str)) {
    return 'El precio debe ser un número positivo de hasta 4 dígitos y máximo 2 decimales.';
  }
  const num = Number(str);
  if (isNaN(num) || num <= 0) {
    return 'El precio debe ser un número positivo.';
  }
  return null;
};

// Documento del Empleado Responsable: Solo letras, números y guiones, 5-11 caracteres
export const validateDocEmpl = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (
    trimmed.length < 5 ||
    trimmed.length > 11 ||
    !/^[A-Z0-9-]+$/i.test(trimmed)
  ) {
    return 'El documento debe tener entre 5 y 11 caracteres, solo letras, números y guiones.';
  }
  return null;
};