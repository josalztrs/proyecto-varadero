// Nombre Completo: Solo letras, espacios, tildes, guiones. 3-32 caracteres, sin dobles espacios/guiones, ni al inicio/final, sin números ni caracteres especiales.
export const validateNombre = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'El nombre es obligatorio.';
  }
  if (
    trimmed.length < 3 ||
    trimmed.length > 32
  ) {
    return 'El nombre debe tener entre 3 y 32 caracteres.';
  }
  if (!/^[A-ZÁÉÍÓÚÑáéíóúñ ]+(-[A-ZÁÉÍÓÚÑáéíóúñ ]+)*$/i.test(trimmed)) {
    return 'El nombre solo puede contener letras, espacios y guiones, sin números ni caracteres especiales.';
  }
  if (/ {2,}/.test(trimmed) || /--+/.test(trimmed)) {
    return 'El nombre no puede tener dobles espacios ni dobles guiones.';
  }
  if (/^[- ]|[- ]$/.test(trimmed)) {
    return 'El nombre no puede iniciar ni terminar con espacio o guion.';
  }
  return null;
};

// Cédula: V/E/J/P/C/G- seguido de 7 a 9 dígitos, sin espacios, sin caracteres extra.
export const validateCedula = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) {
    return 'La cédula es obligatoria.';
  }
  if (!/^[VEJPCG]-\d{7,9}$/.test(trimmed)) {
    return 'La cédula debe tener el formato V-12345678, E-123456789, etc., sin espacios ni caracteres extra.';
  }
  return null;
};

// Correo Electrónico: Formato estándar, sin espacios, máximo 32 caracteres, sin caracteres especiales consecutivos.
export const validateEmail = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'El correo electrónico es obligatorio.';
  }
  if (trimmed.length > 32) {
    return 'El correo electrónico no puede exceder 32 caracteres.';
  }
  if (/\s/.test(trimmed)) {
    return 'El correo electrónico no puede contener espacios.';
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return 'El correo electrónico no es válido.';
  }
  if (/\.\.|--|__|@@/.test(trimmed)) {
    return 'El correo electrónico no puede tener caracteres especiales consecutivos.';
  }
  return null;
};

// Teléfono: Formato internacional, + seguido de 8 a 15 dígitos, sin espacios, sin caracteres extra.
export const validateTelefono = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'El teléfono es obligatorio.';
  }
  if (!/^\+\d{8,15}$/.test(trimmed)) {
    return 'El teléfono debe tener el formato internacional, por ejemplo: +584121234567, sin espacios ni caracteres extra.';
  }
  return null;
};

// Oficio / Servicio: Debe ser un valor seleccionado (número positivo, entero, no string vacía).
export const validateOficioId = (value: number | string) => {
  if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
    return 'Debe seleccionar un oficio válido.';
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    return 'Debe seleccionar un oficio válido.';
  }
  return null;
};