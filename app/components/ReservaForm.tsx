import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase'; // Ajusta la ruta a tu cliente supabase

const ReservaForm = () => {
  const [form, setForm] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
