/* eslint-disable @typescript-eslint/no-explicit-any */
// Utilidad para normalizar el tipo
const normalizaTipo = (tipo?: string) =>
  tipo ? tipo.trim().toUpperCase().replace(/ /g, '_') : '';


export const validateMatricula = (value: string, allValues?: any) => {
  const trimmed = value.trim().toUpperCase();
  const tipoNorm = normalizaTipo(allValues?.tipo);

  if (!tipoNorm) return 'Debe seleccionar el tipo de embarcación antes de la matrícula.';

  if (tipoNorm === 'LANCHA') {
    if (!/^LNC-\d{4}$/.test(trimmed)) {
      return 'La matrícula de una Lancha debe tener el formato LNC-1234.';
    }
  } else if (tipoNorm === 'YATE') {
    if (!/^YAT-\d{4}$/.test(trimmed)) {
      return 'La matrícula de un Yate debe tener el formato YAT-1234.';
    }
  } else if (tipoNorm === 'MOTO_ACUATICA') {
    if (!/^MTA-\d{3}$/.test(trimmed)) {
      return 'La matrícula de una Moto Acuática debe tener el formato MTA-123.';
    }
  } else {
    return 'Tipo de embarcación no válido.';
  }
  return null;
};

// Nombre Embarcación: Letras, números, espacios, guiones, tildes. 3-32 caracteres, sin dobles espacios/guiones, ni al inicio/final.
export const validateNombreEmbarcacion = (value: string) => {
  const trimmed = value.trim();
  if (
    trimmed.length < 3 ||
    trimmed.length > 32 ||
    !/^[A-ZÁÉÍÓÚÑ0-9 -]+$/i.test(trimmed) ||
    /^[- ]|[- ]$/.test(trimmed) ||
    / {2,}/.test(trimmed) ||
    /--+/.test(trimmed)
  ) {
    return 'El nombre solo puede contener letras, números, espacios y guiones, entre 3 y 32 caracteres, sin dobles espacios/guiones ni al inicio/final.';
  }
  return null;
};

// Tipo: Solo acepta los valores permitidos
export const validateTipo = (value: string) => {
  if (!value) return 'Debes seleccionar el tipo de embarcación.';
  const normalizado = value.trim().toUpperCase().replace(/ /g, '_');
  const tiposValidos = ['LANCHA', 'YATE', 'MOTO_ACUATICA'];
  if (!tiposValidos.includes(normalizado)) {
    return 'El tipo debe ser Lancha, Yate o Moto Acuática.';
  }
  return null;
};

// Marca/Modelo: Letras, números, espacios, guiones, tildes. 2-20 caracteres, sin dobles espacios/guiones, ni al inicio/final.
export const validateMarcaModelo = (value: string) => {
  const trimmed = value.trim();
  if (
    trimmed.length < 2 ||
    trimmed.length > 20 ||
    !/^[A-ZÁÉÍÓÚÑ0-9 -]+$/i.test(trimmed) ||
    /^[- ]|[- ]$/.test(trimmed) ||
    / {2,}/.test(trimmed) ||
    /--+/.test(trimmed)
  ) {
    return 'La marca/modelo solo puede contener letras, números, espacios y guiones, entre 2 y 20 caracteres, sin dobles espacios/guiones ni al inicio/final.';
  }
  return null;
};

// Características: Letras, números, espacios, guiones, tildes. 3-32 caracteres, sin dobles espacios/guiones, ni al inicio/final.
export const validateCaracteristicas = (value: string) => {
  const trimmed = value.trim();
  if (
    trimmed.length < 3 ||
    trimmed.length > 32 ||
    !/^[A-ZÁÉÍÓÚÑ0-9 -]+$/i.test(trimmed) ||
    /^[- ]|[- ]$/.test(trimmed) ||
    / {2,}/.test(trimmed) ||
    /--+/.test(trimmed)
  ) {
    return 'Las características solo pueden contener letras, números, espacios y guiones, entre 3 y 32 caracteres, sin dobles espacios/guiones ni al inicio/final.';
  }
  return null;
};

// Documento de Identidad Cliente: V/E/J/P/G- seguido de 7 a 9 dígitos
export const validateCedCliente = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!/^[VEJPG]-\d{7,9}$/.test(trimmed)) {
    return 'El documento debe tener el formato V-12345678, J-123456789, etc.';
  }
  return null;
};

// Amarres condicionales según tipo, solo números, máximo 2 dígitos
export const validateAmarresAsign = (value: string | number, allValues?: any) => {
  const str = String(value).trim();
  const tipoNorm = normalizaTipo(allValues?.tipo);

  if (!/^\d{1,2}$/.test(str)) {
    return 'Los amarres asignados deben ser un número entero positivo de hasta 2 dígitos.';
  }
  const num = Number(str);

  if (!tipoNorm) return 'Debe seleccionar el tipo de embarcación antes de los amarres.';

  if (tipoNorm === 'LANCHA') {
    if (num < 1 || num > 5) return 'Las lanchas pueden tener entre 1 y 5 amarres.';
  } else if (tipoNorm === 'YATE') {
    if (num < 2 || num > 20) return 'Los yates pueden tener entre 2 y 20 amarres.';
  } else if (tipoNorm === 'MOTO_ACUATICA') {
    if (num !== 1) return 'Las motos acuáticas solo pueden tener 1 amarre.';
  } else {
    return 'Tipo de embarcación no válido.';
  }
  return null;
};

// Cuadrante condicional según tipo, solo números, máximo 6 dígitos
export const validateCuadrAsign = (value: string | number, allValues?: any) => {
  const str = String(value).trim();
  const tipoNorm = normalizaTipo(allValues?.tipo);

  if (!/^\d{1,6}$/.test(str)) {
    return 'El cuadrante debe ser un número entero positivo de hasta 6 dígitos.';
  }
  const num = Number(str);

  if (!tipoNorm) return 'Debe seleccionar el tipo de embarcación antes del cuadrante.';

  if (tipoNorm === 'LANCHA') {
    if (num < 1 || num > 100) return 'Las lanchas pueden estar en cuadrantes del 1 al 100.';
  } else if (tipoNorm === 'YATE') {
    if (num < 101 || num > 500) return 'Los yates pueden estar en cuadrantes del 101 al 500.';
  } else if (tipoNorm === 'MOTO_ACUATICA') {
    if (num < 501 || num > 999) return 'Las motos acuáticas pueden estar en cuadrantes del 501 al 999.';
  } else {
    return 'Tipo de embarcación no válido.';
  }
  return null;
};