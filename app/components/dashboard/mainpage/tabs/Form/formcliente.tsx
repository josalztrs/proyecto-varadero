// Validaciones específicas para los campos del cliente

// Nombre: Solo letras (mayúsculas/minúsculas), tildes, espacios, guiones. Sin dobles espacios/guiones, ni al inicio/final.
export const validateNombre = (value: string) => {
  const trimmed = value.trim();
  if (
    !/^[A-ZÁÉÍÓÚÑáéíóúñ -]{3,32}$/i.test(trimmed) ||
    /^[- ]|[- ]$/.test(trimmed) || // No inicia/termina con espacio o guion
    / {2,}/.test(trimmed) ||      // No dobles espacios
    /--+/.test(trimmed)           // No dobles guiones
  ) {
    return 'El nombre debe tener entre 3 y 32 letras, solo letras, espacios y guiones, sin dobles espacios/guiones ni al inicio/final.';
  }
  return null;
};

// Documento de Identidad: V/E/J/P/G- seguido de 7 a 9 dígitos, sin espacios.
export const validateDocIdent = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!/^[VEJPG]-\d{7,9}$/.test(trimmed)) {
    return 'El documento debe tener el formato V-12345678, J-123456789, etc.';
  }
  return null;
};

// Correo: Formato estándar, sin espacios, dominio válido.
export const validateCorreo = (value: string) => {
  const trimmed = value.trim();
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed) ||
    /\s/.test(trimmed)
  ) {
    return 'El correo electrónico no es válido.';
  }
  return null;
};

// Nacionalidad: Solo letras, tildes, espacios, guiones. Sin dobles espacios/guiones, ni al inicio/final.
export const validateNacionalidad = (value: string) => {
  const trimmed = value.trim();
  if (
    trimmed &&
    (
      !/^[A-ZÁÉÍÓÚÑáéíóúñ -]{3,32}$/i.test(trimmed) ||
      /^[- ]|[- ]$/.test(trimmed) ||
      / {2,}/.test(trimmed) ||
      /--+/.test(trimmed)
    )
  ) {
    return 'La nacionalidad solo puede contener letras, espacios y guiones, sin dobles espacios/guiones ni al inicio/final, y entre 3 y 32 caracteres.';
  }
  return null;
};

// Teléfono: Solo formato internacional, + seguido de 8 a 15 dígitos, sin espacios ni otros símbolos.
export const validateTelefono = (value: string) => {
  const trimmed = value.trim();
  if (!/^\+\d{8,15}$/.test(trimmed)) {
    return 'El teléfono debe tener el formato internacional, por ejemplo: +584167778232';
  }
  return null;
};

