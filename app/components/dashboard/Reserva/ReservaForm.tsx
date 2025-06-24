import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';

export type ReservaFormState = {
  nombre: string;
  doc_ident: string;
  matric_emb: string;
  id_servicio: string;
  fecha_llegada: string;
  tipo_pago: string;
  notas: string;
};

export const SERVICIOS = [
  { value: "8", label: "Alojamiento" },
  { value: "9", label: "Restaurante" },
  { value: "1", label: "Atraque" },
  { value: "10", label: "Mantenimiento" },
];

// Validación robusta para todos los campos (sin validación de nombre)
export const validarReserva = (form: ReservaFormState) => {
  // Se elimina la validación de nombre
  if (!/^[VEJPG]-\d{7,9}$/.test(form.doc_ident.trim().toUpperCase())) {
    return "El documento debe tener el formato V-12345678, J-123456789, etc.";
  }
  if (!/^[A-Za-z0-9\-]{4,15}$/.test(form.matric_emb.trim())) {
    return "La matrícula debe tener entre 4 y 15 caracteres, solo letras, números y guiones.";
  }
  if (!["8", "9", "1", "10"].includes(form.id_servicio)) {
    return "Seleccione un tipo de servicio válido.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha_llegada)) {
    return "Seleccione una fecha válida.";
  }
  const fecha = new Date(form.fecha_llegada + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha.getTime()) || fecha < hoy) {
    return "La fecha de llegada debe ser hoy o una fecha futura.";
  }
  if (!["efectivo", "tarjeta", "transferencia"].includes(form.tipo_pago)) {
    return "Seleccione un tipo de pago válido.";
  }
  if (form.notas && /[^\w\s.,;:¡!¿?()@áéíóúÁÉÍÓÚñÑ-]/.test(form.notas)) {
    return "Las notas solo pueden contener letras, números y signos de puntuación básicos.";
  }
  if (form.notas && form.notas.length > 200) {
    return "Las notas no pueden exceder 200 caracteres.";
  }
  return null;
};

// Handlers personalizados para limitar lo que se digita en los campos
export const useInputHandlers = (
  setForm: React.Dispatch<React.SetStateAction<ReservaFormState>>
) => ({
  // Se elimina handleNombreChange
  handleDocIdentChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^VEJPG0-9-]/g, '');
    value = value.slice(0, 11);
    setForm(prev => ({ ...prev, doc_ident: value }));
  },
  handleMatriculaChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Za-z0-9\-]/g, '');
    value = value.slice(0, 15);
    setForm(prev => ({ ...prev, matric_emb: value }));
  },
  handleNotasChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value.replace(/[^\w\s.,;:¡!¿?()@áéíóúÁÉÍÓÚñÑ-]/g, '');
    value = value.slice(0, 200);
    setForm(prev => ({ ...prev, notas: value }));
  },
});

const ReservaForm = () => {
  const [form, setForm] = useState<ReservaFormState>({
    nombre: '',
    doc_ident: '',
    matric_emb: '',
    id_servicio: '',
    fecha_llegada: '',
    tipo_pago: '',
    notas: '',
  });
  const [loading, setLoading] = useState(false);

  const {
    handleDocIdentChange,
    handleMatriculaChange,
    handleNotasChange,
  } = useInputHandlers(setForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // No se valida el nombre
    const error = validarReserva(form);
    if (error) {
      alert(error);
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
        alert("El cliente no está registrado. Debe estar registrado para hacer una reserva.");
        setLoading(false);
        return;
      }

      const { data: reservaData, error: errorReserva } = await supabase
        .from('reservaciones')
        .insert([
          {
            doc_cliente: cliente.doc_ident,
            matric_emb: form.matric_emb,
            id_servicio: Number(form.id_servicio),
            fecha_est: form.fecha_llegada,
            estado: "pendiente",
            notas: form.notas,         // Guardar notas
            tipo_pago: form.tipo_pago, // Guardar tipo de pago
          },
        ])
        .select('id')
        .single();

      if (errorReserva) throw errorReserva;

      const { error: errorNotificacion } = await supabase.from('notificaciones').insert([
        {
          titulo: "Nueva reserva pendiente",
          mensaje: `Cliente ${cliente.nombre} realizó una nueva reserva.`,
          leido: false,
          reserv_id: reservaData?.id,
        },
      ]);
      if (errorNotificacion) throw errorNotificacion;

      alert('Reservación enviada correctamente. El administrador la revisará.');

      setForm({
        nombre: '',
        doc_ident: '',
        matric_emb: '',
        id_servicio: '',
        fecha_llegada: '',
        tipo_pago: '',
        notas: '',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error);
      alert('Error al guardar la reservación: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Nueva Reserva</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        {/* Se elimina el campo de nombre */}
        <div>
          <label className="block font-medium mb-1">Documento de Identidad</label>
          <input
            type="text"
            name="doc_ident"
            value={form.doc_ident}
            onChange={handleDocIdentChange}
            required
            maxLength={11}
            pattern="^[VEJPG]-\d{7,9}$"
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
            placeholder="V-12345678"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Matrícula de Embarcación</label>
          <input
            type="text"
            name="matric_emb"
            value={form.matric_emb}
            onChange={handleMatriculaChange}
            required
            minLength={4}
            maxLength={15}
            pattern="^[A-Za-z0-9\-]{4,15}$"
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
            placeholder="Ej: ABCD-1234"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tipo de Servicio</label>
          <select
            name="id_servicio"
            value={form.id_servicio}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
          >
            <option value="">Seleccione...</option>
            {SERVICIOS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Fecha de Llegada</label>
          <input
            type="date"
            name="fecha_llegada"
            value={form.fecha_llegada}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tipo de Pago</label>
          <select
            name="tipo_pago"
            value={form.tipo_pago}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
          >
            <option value="">Seleccione...</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Notas</label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleNotasChange}
            maxLength={200}
            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2"
            placeholder="Notas adicionales o requerimientos"
          />
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
