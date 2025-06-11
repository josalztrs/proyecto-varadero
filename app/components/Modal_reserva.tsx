"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservaModal = ({ isOpen, onClose }: ReservaModalProps) => {
  const supabase = createClientComponentClient();

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    doc_ident: "",
    correo: "",
    tipo_embarcacion: "",
    tipo_servicio: "",
    fecha_llegada: "",
    tipo_pago: "",
    notas: "",
  });

  // Estado para mensajes
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validación básica
    const {
      nombre,
      telefono,
      doc_ident,
      correo,
      tipo_embarcacion,
      tipo_servicio,
      fecha_llegada,
      tipo_pago,
    } = formData;

    if (
      !nombre ||
      !telefono ||
      !doc_ident ||
      !correo ||
      !tipo_embarcacion ||
      !tipo_servicio ||
      !fecha_llegada ||
      !tipo_pago
    ) {
      setErrorMsg("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // 1. Buscar cliente por doc_ident
      const { data: clientes, error: errorCliente } = await supabase
        .from("clientes")
        .select("id")
        .eq("doc_ident", doc_ident)
        .limit(1)
        .maybeSingle();

      if (errorCliente) throw errorCliente;

      let cliente_id: number;

      if (clientes) {
        // Cliente existe
        cliente_id = clientes.id;
      } else {
        // Crear nuevo cliente
        const { data: clienteNuevo, error: errorNuevoCliente } = await supabase
          .from("clientes")
          .insert([
            {
              nombre,
              telefono,
              doc_ident,
              correo,
            },
          ])
          .select("id")
          .single();

        if (errorNuevoCliente) throw errorNuevoCliente;

        cliente_id = clienteNuevo.id;
      }

      // 2. Crear reserva
      const { error: errorReserva } = await supabase.from("reservaciones").insert([
        {
          cliente_id,
          tipo_embarcacion,
          tipo_servicio,
          fecha_llegada,
          tipo_pago,
          notas: formData.notas,
          estado: "pendiente",
          // fecha_registro se autogenera en la DB
        },
      ]);

      if (errorReserva) throw errorReserva;

      // 3. Crear notificación para admin
      const { error: errorNotificacion } = await supabase.from("notificaciones").insert([
        {
          titulo: "Nueva reserva pendiente",
          mensaje: `Cliente ${nombre} realizó una nueva reserva.`,
          leido: false,
        },
      ]);
      if (errorNotificacion) throw errorNotificacion;

      setSuccessMsg("Reserva creada correctamente. ¡Gracias!");
      // Resetear formulario
      setFormData({
        nombre: "",
        telefono: "",
        doc_ident: "",
        correo: "",
        tipo_embarcacion: "",
        tipo_servicio: "",
        fecha_llegada: "",
        tipo_pago: "",
        notas: "",
      });

      // Opcional: cerrar modal después de un tiempo
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Error en la reserva:", error);
      setErrorMsg("Ocurrió un error al crear la reserva. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-900 rounded-xl shadow-xl max-w-5xl w-full mx-4 p-8 relative text-white"
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 dark:hover:text-cyan-400 text-2xl font-bold"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold mb-6 text-amber-400 dark:text-cyan-400">
            Reserva tu espacio
          </h2>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-white"
            onSubmit={handleSubmit}
          >
            {/* Aquí cada input con value y onChange */}
            <div className="flex flex-col">
              <label
                htmlFor="nombre"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingrese su nombre"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="telefono"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Ingrese su teléfono"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="doc_ident"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Documento de Identidad
              </label>
              <input
                type="text"
                id="doc_ident"
                name="doc_ident"
                placeholder="Ingrese su documento"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.doc_ident}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="correo"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@correo.com"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="tipo_embarcacion"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Tipo de Embarcación
              </label>
              <select
                id="tipo_embarcacion"
                name="tipo_embarcacion"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.tipo_embarcacion}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="yate">Yate</option>
                <option value="lancha">Lancha</option>
                <option value="pesquero">Pesquero</option>
                <option value="moto_acuatica">Moto Acuática</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="tipo_servicio"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Tipo de Servicio
              </label>
              <select
                id="tipo_servicio"
                name="tipo_servicio"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.tipo_servicio}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="alquiler_espacio">Alquiler de Espacio</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="alojamiento">Alojamiento</option>
                <option value="comidas_bebidas">Comidas y Bebidas</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="fecha_llegada"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Fecha de Llegada
              </label>
              <input
                type="date"
                id="fecha_llegada"
                name="fecha_llegada"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.fecha_llegada}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="tipo_pago"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Tipo de Pago
              </label>
              <select
                id="tipo_pago"
                name="tipo_pago"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.tipo_pago}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label
                htmlFor="notas"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Notas
              </label>
              <textarea
                id="notas"
                name="notas"
                rows={3}
                placeholder="Notas adicionales o requerimientos"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white resize-y focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.notas}
                onChange={handleChange}
              />
            </div>

            {/* Mensajes */}
            {errorMsg && (
              <p className="md:col-span-2 text-red-500 font-semibold">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="md:col-span-2 text-green-500 font-semibold">{successMsg}</p>
            )}

            {/* Botones */}
            <div className="md:col-span-2 mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-md bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 transition text-white font-semibold"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReservaModal;
