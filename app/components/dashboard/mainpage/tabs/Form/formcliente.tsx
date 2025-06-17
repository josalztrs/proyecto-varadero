// Validaciones específicas para los campos del cliente

// Nombre: Solo letras (mayúsculas/minúsculas), tildes, espacios, guiones. Sin dobles espacios/guiones, ni al inicio/final, sin números ni caracteres especiales.
export const validateNombre = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'El nombre es obligatorio.';
  }
  if (trimmed.length < 3 || trimmed.length > 32) {
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

// Documento de Identidad: V/E/J/P/G- seguido de 7 a 9 dígitos, sin espacios, sin caracteres extra.
export const validateDocIdent = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) {
    return 'El documento es obligatorio.';
  }
  if (!/^[VEJPG]-\d{7,9}$/.test(trimmed)) {
    return 'El documento debe tener el formato V-12345678, J-123456789, etc., sin espacios ni caracteres extra.';
  }
  return null;
};

// Correo: Formato estándar, sin espacios, dominio válido, máximo 32 caracteres, sin caracteres especiales consecutivos.
export const validateCorreo = (value: string) => {
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

// Nacionalidad: Solo letras, tildes, espacios, guiones. Sin dobles espacios/guiones, ni al inicio/final, 3-32 caracteres.
export const validateNacionalidad = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null; // Si es opcional, permite vacío

  if (
    trimmed.length < 3 ||
    trimmed.length > 32
  ) {
    return 'La nacionalidad debe tener entre 3 y 32 caracteres.';
  }
  if (!/^[A-ZÁÉÍÓÚÑáéíóúñ ]+(-[A-ZÁÉÍÓÚÑáéíóúñ ]+)*$/i.test(trimmed)) {
    return 'La nacionalidad solo puede contener letras, espacios y guiones, sin números ni caracteres especiales.';
  }
  if (/ {2,}/.test(trimmed) || /--+/.test(trimmed)) {
    return 'La nacionalidad no puede tener dobles espacios ni dobles guiones.';
  }
  if (/^[- ]|[- ]$/.test(trimmed)) {
    return 'La nacionalidad no puede iniciar ni terminar con espacio o guion.';
  }
  return null;
};

// Teléfono: Solo formato internacional, + seguido de 8 a 15 dígitos, sin espacios ni otros símbolos.
export const validateTelefono = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'El teléfono es obligatorio.';
  }
  if (!/^\+\d{8,15}$/.test(trimmed)) {
    return 'El teléfono debe tener el formato internacional, por ejemplo: +584167778232, sin espacios ni caracteres extra.';
  }
  return null;
};

