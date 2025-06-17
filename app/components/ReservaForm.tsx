import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase'; // Ajusta la ruta a tu cliente supabase

type ReservaFormState = {
  nombre: string;
  doc_ident: string;
  telefono: string;
  correo: string;
  tipo_embarcacion: string;
  tipo_servicio: string;
  fecha_llegada: string;
  tipo_pago: string;
  nota: string;
};

const ReservaForm = () => {
  const [form, setForm] = useState<ReservaFormState>({
    nombre: '',
    doc_ident: '',
    telefono: '',
    correo: '',
    tipo_embarcacion: '',
    tipo_servicio: '',
    fecha_llegada: '',
    tipo_pago: '',
    nota: '',
  });

  const validarReserva = (form: ReservaFormState) => {
  // Validación de nombre: solo letras, espacios, tildes, 3-32 caracteres
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,32}$/.test(form.nombre.trim())) {
    return "El nombre debe tener entre 3 y 32 letras.";
  }
  // Teléfono: internacional, mínimo 8 dígitos
  if (!/^\+?\d{8,16}$/.test(form.telefono.trim())) {
    return "El teléfono debe tener entre 8 y 16 dígitos (puede iniciar con +).";
  }
  // Documento de identidad: V/E/J/P/G- seguido de 7-9 dígitos
  if (!/^[VEJPG]-\d{7,9}$/i.test(form.doc_ident.trim())) {
    return "El documento debe tener el formato V-12345678.";
  }
  // Correo electrónico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
    return "El correo electrónico no es válido.";
  }
  // Tipo de embarcación
  if (!form.tipo_embarcacion) {
    return "Seleccione el tipo de embarcación.";
  }
  // Tipo de servicio
  if (!form.tipo_servicio) {
    return "Seleccione el tipo de servicio.";
  }
  // Fecha de llegada: debe ser válida y no pasada
  if (!form.fecha_llegada) {
    return "Seleccione la fecha de llegada.";
  }
  const fecha = new Date(form.fecha_llegada);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha.getTime()) || fecha < hoy) {
    return "La fecha de llegada debe ser hoy o una fecha futura.";
  }
  // Tipo de pago
  if (!form.tipo_pago) {
    return "Seleccione el tipo de pago.";
  }
  // Notas: opcional, máximo 200 caracteres
  if (form.nota && form.nota.length > 200) {
    return "Las notas no pueden exceder 200 caracteres.";
  }
  return null;
};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const error = validarReserva(form);
  if (error) {
    alert(error);
    return;
  }

    try {
      // 1. Verificar si el cliente ya existe por doc_ident
      const { data: clientes, error: errorCliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('doc_ident', form.doc_ident)
        .limit(1)
        .single();

      if (errorCliente && errorCliente.code !== 'PGRST116') { // PGRST116 = no encontrado
        throw errorCliente;
      }

      let cliente_id = clientes?.id;

      // 2. Si no existe cliente, crear
      if (!cliente_id) {
        const { data: nuevoCliente, error: errorInsertCliente } = await supabase
          .from('clientes')
          .insert({
            nombre: form.nombre,
            doc_ident: form.doc_ident,
            telefono: form.telefono,
            correo: form.correo,
          })
          .select('id')
          .single();

        if (errorInsertCliente) throw errorInsertCliente;
        cliente_id = nuevoCliente.id;
      }

      // 3. Insertar reservación sin precio, espacio ni estado (que pone admin)
      const { data: nuevaReservacion, error: errorReservacion } = await supabase
        .from('reservaciones')
        .insert({
          cliente_id,
          tipo_embarcacion: form.tipo_embarcacion,
          tipo_servicio: form.tipo_servicio,
          fecha_llegada: form.fecha_llegada,
          tipo_pago: form.tipo_pago,
          nota: form.nota,
          // estado NO se inserta aquí, será manejado por admin luego
        })
        .select('id')
        .single();

      if (errorReservacion) throw errorReservacion;

      // 4. Crear notificación para administrador
      await supabase.from('notificaciones').insert({
        mensaje: `Nueva reservación recibida de ${form.nombre}`,
        tipo: 'info',
        reservacion_id: nuevaReservacion.id,
      });

      alert('Reservación enviada correctamente. El administrador la revisará.');

      // Limpiar form o cerrar modal si quieres
      setForm({
        nombre: '',
        doc_ident: '',
        telefono: '',
        correo: '',
        tipo_embarcacion: '',
        tipo_servicio: '',
        fecha_llegada: '',
        tipo_pago: '',
        nota: '',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('Error al guardar la reservación: ' + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tus inputs con onChange={handleChange} y value={form.campo} */}
    </form>
  );
};

export default ReservaForm;
