'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import { toast } from 'sonner';

export type ReservaFormState = {

  doc_ident: string;
  matric_emb: string;
  id_servicio: string;
  fecha_llegada: string;
  fecha_salida: string; 
  tipo_pago: string;
  notas: string;
};

export const SERVICIOS = [
  { value: "8", label: "Alojamiento" },
  { value: "9", label: "Restaurante" },
  { value: "1", label: "Atraque" },
  { value: "10", label: "Mantenimiento" },
];

export const validarReserva = (
  field: keyof ReservaFormState,
  value: string,
  form?: ReservaFormState
): string | null => {
  switch (field) {
    case 'doc_ident': {
      const val = value.trim().toUpperCase();
      if (!val) return "El documento de identidad es obligatorio.";
      if (!/^[VEJPG]-\d{7,9}$/.test(val)) {
        return "Formato inválido. Use V/J/E/P/G- seguido de 7 a 9 dígitos. Ej: V-12345678.";
      }
      break;
    }

    case 'matric_emb': {
      const val = value.trim();
      if (!val) return "La matrícula es obligatoria.";
      if (!/^[A-Za-z0-9\-]{4,15}$/.test(val)) {
        return "Debe tener entre 4 y 15 caracteres: letras, números o guiones.";
      }
      if (/--/.test(val) || val.startsWith("-") || val.endsWith("-")) {
        return "La matrícula no puede tener guiones consecutivos, ni comenzar o terminar con guion.";
      }
      break;
    }

    case 'id_servicio': {
      if (!value) return "Debe seleccionar un tipo de servicio.";
      const idsPermitidos = SERVICIOS.map(s => s.value);
      if (!idsPermitidos.includes(value)) {
        return "El tipo de servicio seleccionado no es válido.";
      }
      break;
    }

    case 'fecha_llegada': {
      if (!value) return "Debe ingresar la fecha de llegada.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return "Formato inválido. Use el formato YYYY-MM-DD.";
      }
      const fecha = new Date(value + "T00:00:00");
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      if (isNaN(fecha.getTime())) {
        return "La fecha ingresada no es válida.";
      }
      if (fecha < hoy) {
        return "La fecha debe ser hoy o futura.";
      }
      break;
    }

    case 'fecha_salida': {
      if (!value) return "Debe ingresar la fecha de salida.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return "Formato inválido. Use el formato YYYY-MM-DD.";
      }

      const salida = new Date(value + "T00:00:00");
      if (isNaN(salida.getTime())) {
        return "La fecha de salida no es válida.";
      }

      // Validamos fecha llegada para comparar
      if (form?.fecha_llegada) {
        const llegada = new Date(form.fecha_llegada + "T00:00:00");
        if (!isNaN(llegada.getTime())) {
          if (salida < llegada) {
            return "La fecha de salida no puede ser anterior a la fecha de llegada.";
          }
        }
      }

      // (Opcional) La fecha de salida no puede ser pasada (antes de hoy)
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (salida < hoy) {
        return "La fecha de salida debe ser hoy o una fecha futura.";
      }

      break;
    }

    case 'tipo_pago': {
      if (!value) return "Debe seleccionar un tipo de pago.";
      if (!["efectivo", "tarjeta", "transferencia"].includes(value)) {
        return "Tipo de pago no reconocido.";
      }
      break;
    }

    case 'notas': {
      if (value) {
        if (value.length > 200) return "Las notas no pueden superar los 200 caracteres.";
        if (/[<>$%{}[\]|^~]/.test(value)) {
          return "Las notas no deben contener caracteres especiales como < > $ % { } [ ] | ^ ~.";
        }
        if (!/^[\w\s.,;:¡!¿?()@áéíóúÁÉÍÓÚñÑ-]*$/.test(value)) {
          return "Use solo letras, números y puntuación básica.";
        }
      }
      break;
    }
    default:
      return null;
  }
  return null;
};



const ReservaForm = () => {
  const [form, setForm] = useState<ReservaFormState>({
    doc_ident: '',
    matric_emb: '',
    id_servicio: '',
    fecha_llegada: '',
    fecha_salida: '', // Aunque no se usa, se mantiene para futuras expansiones
    tipo_pago: '',
    notas: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservaFormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: keyof ReservaFormState, value: string) => {
  const updatedForm = { ...form, [field]: value };
  setForm(updatedForm);
  const errorMsg = validarReserva(field, value, updatedForm); // <-- pasa el form completo
  setErrors((prev) => ({ ...prev, [field]: errorMsg || undefined }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<typeof errors> = {};
    let hasError = false;

    (Object.keys(form) as (keyof ReservaFormState)[]).forEach((key) => {
      const errorMsg = validarReserva(key, form[key] ?? '');
      if (errorMsg) {
        newErrors[key] = errorMsg;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      toast.error("Corrige los campos con error.");
      return;
    }

    setLoading(true);

    try {
      const { data: cliente, error: errorCliente } = await supabase
        .from('cliente')
        .select('doc_ident, nombre')
        .eq('doc_ident', form.doc_ident)
        .maybeSingle();

      if (errorCliente) throw errorCliente;

      if (!cliente) {
        toast.warning("Cliente no registrado. Debe registrarse antes de reservar.");
        setLoading(false);
        return;
      }

      const { data: reservaData, error: errorReserva } = await supabase
        .from('reservaciones')
        .insert([{
          doc_cliente: cliente.doc_ident,
          matric_emb: form.matric_emb,
          id_servicio: Number(form.id_servicio),
          fecha_est: form.fecha_llegada,
          estado: "pendiente",
          notas: form.notas,
          tipo_pago: form.tipo_pago,
        }])
        .select('id')
        .single();

      if (errorReserva) throw errorReserva;

      const { error: errorNotificacion } = await supabase
        .from('notificaciones')
        .insert([{
          titulo: "Nueva reserva pendiente",
          mensaje: `Cliente ${cliente.nombre} realizó una nueva reserva.`,
          leido: false,
          reserv_id: reservaData?.id,
        }]);

      if (errorNotificacion) throw errorNotificacion;

      toast.success("Reservación enviada correctamente.");
      setForm({
        doc_ident: '',
        matric_emb: '',
        id_servicio: '',
        fecha_llegada: '',
        fecha_salida: '', // Aunque no se usa, se mantiene para futuras expansiones
        tipo_pago: '',
        notas: '',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error inesperado';
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Nueva Reserva</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        {[
          {
            label: 'Documento de Identidad',
            name: 'doc_ident',
            type: 'text',
            placeholder: 'V-12345678',
            maxLength: 11,
          },
          {
            label: 'Matrícula de Embarcación',
            name: 'matric_emb',
            type: 'text',
            placeholder: 'Ej: ABCD-1234',
            maxLength: 15,
          },
        ].map(({ label, name, ...inputProps }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              {...inputProps}
              name={name}
              value={form[name as keyof ReservaFormState]}
              onChange={(e) => handleFieldChange(name as keyof ReservaFormState, e.target.value)}
              className={`w-full rounded-md px-3 py-2 border ${
                errors[name as keyof ReservaFormState] ? 'border-red-500' : 'border-gray-300'
              } dark:bg-gray-700 dark:text-white`}
              required
            />
            {errors[name as keyof ReservaFormState] && (
              <p className="text-sm text-red-500 mt-1">{errors[name as keyof ReservaFormState]}</p>
            )}
          </div>
        ))}

        {/* Select de Servicio */}
        <div>
          <label className="block font-medium mb-1">Tipo de Servicio</label>
          <select
            name="id_servicio"
            value={form.id_servicio}
            onChange={(e) => handleFieldChange('id_servicio', e.target.value)}
            className={`w-full rounded-md px-3 py-2 border ${
              errors.id_servicio ? 'border-red-500' : 'border-gray-300'
            } dark:bg-gray-700 dark:text-white`}
            required
          >
            <option value="">Seleccione...</option>
            {SERVICIOS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.id_servicio && <p className="text-sm text-red-500 mt-1">{errors.id_servicio}</p>}
        </div>

        {/* Fecha de Llegada */}
        <div>
          <label className="block font-medium mb-1">Fecha de Llegada</label>
          <input
            type="date"
            name="fecha_llegada"
            value={form.fecha_llegada}
            onChange={(e) => handleFieldChange('fecha_llegada', e.target.value)}
            className={`w-full rounded-md px-3 py-2 border ${
              errors.fecha_llegada ? 'border-red-500' : 'border-gray-300'
            } dark:bg-gray-700 dark:text-white`}
            required
          />
          {errors.fecha_llegada && <p className="text-sm text-red-500 mt-1">{errors.fecha_llegada}</p>}
        </div>

        {/* Tipo de Pago */}
        <div>
          <label className="block font-medium mb-1">Tipo de Pago</label>
          <select
            name="tipo_pago"
            value={form.tipo_pago}
            onChange={(e) => handleFieldChange('tipo_pago', e.target.value)}
            className={`w-full rounded-md px-3 py-2 border ${
              errors.tipo_pago ? 'border-red-500' : 'border-gray-300'
            } dark:bg-gray-700 dark:text-white`}
            required
          >
            <option value="">Seleccione...</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
          {errors.tipo_pago && <p className="text-sm text-red-500 mt-1">{errors.tipo_pago}</p>}
        </div>

        {/* Notas */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Notas</label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={(e) => handleFieldChange('notas', e.target.value)}
            className={`w-full rounded-md px-3 py-2 border ${
              errors.notas ? 'border-red-500' : 'border-gray-300'
            } dark:bg-gray-700 dark:text-white`}
            maxLength={200}
            placeholder="Notas adicionales o requerimientos"
          />
          {errors.notas && <p className="text-sm text-red-500 mt-1">{errors.notas}</p>}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors duration-150"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

export default ReservaForm;
