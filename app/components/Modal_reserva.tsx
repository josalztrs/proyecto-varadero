"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase/supabase";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  nombre: "",
  telefono: "",
  doc_ident: "",
  correo: "",
  tipo_embarcacion: "",
  matric_emb: "",
  id_servicio: "",
  fecha_llegada: "",
  tipo_pago: "",
  notas: "",
};

const SERVICIOS = [
  { value: "8", label: "Alojamiento" },
  { value: "9", label: "Restaurante" },
  { value: "1", label: "Atraque" },
  { value: "10", label: "Mantenimiento" },
];

const validarReserva = (form: typeof initialFormData) => {
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,32}$/.test(form.nombre.trim())) {
    return "El nombre debe tener entre 3 y 32 letras.";
  }
  if (!/^\+?\d{8,16}$/.test(form.telefono.trim())) {
    return "El teléfono debe tener entre 8 y 16 dígitos (puede iniciar con +).";
  }
  if (!/^[VEJPG]-\d{7,9}$/i.test(form.doc_ident.trim())) {
    return "El documento debe tener el formato V-12345678.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
    return "El correo electrónico no es válido.";
  }
  if (!form.tipo_embarcacion) {
    return "Seleccione el tipo de embarcación.";
  }
  if (!form.matric_emb) {
    return "Ingrese la matrícula de la embarcación.";
  }
  if (!form.id_servicio) {
    return "Seleccione el tipo de servicio.";
  }
  if (!form.fecha_llegada) {
    return "Seleccione la fecha de llegada.";
  }
  const fecha = new Date(form.fecha_llegada + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha.getTime()) || fecha < hoy) {
    return "La fecha de llegada debe ser hoy o una fecha futura.";
  }
  if (!form.tipo_pago) {
    return "Seleccione el tipo de pago.";
  }
  if (form.notas && form.notas.length > 200) {
    return "Las notas no pueden exceder 200 caracteres.";
  }
  return null;
};

const ReservaModal = ({ isOpen, onClose }: ReservaModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const error = validarReserva(formData);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setLoading(true);

    try {
      // Buscar cliente por doc_ident
      const { data: cliente, error: errorCliente } = await supabase
        .from("cliente")
        .select("doc_ident, nombre")
        .eq("doc_ident", formData.doc_ident)
        .maybeSingle();

      if (errorCliente) throw errorCliente;

      if (!cliente) {
        setErrorMsg("El cliente no está registrado. Debe estar registrado para hacer una reserva.");
        setLoading(false);
        return;
      }

      // Crear reserva y obtener el id generado
      const { data: reservaData, error: errorReserva } = await supabase
        .from("reservaciones")
        .insert([
          {
            doc_cliente: cliente.doc_ident,
            matric_emb: formData.matric_emb,
            id_servicio: Number(formData.id_servicio),
            fecha_est: formData.fecha_llegada,
            estado: "pendiente",
          },
        ])
        .select("id")
        .single();

      if (errorReserva) throw errorReserva;

      // Crear notificación para admin asociada a la reserva
      const { error: errorNotificacion } = await supabase.from("notificaciones").insert([
        {
          titulo: "Nueva reserva pendiente",
          mensaje: `Cliente ${cliente.nombre} realizó una nueva reserva.`,
          leido: false,
          reserv_id: reservaData?.id,
        },
      ]);
      if (errorNotificacion) throw errorNotificacion;

      setSuccessMsg("Reserva creada correctamente. ¡Gracias!");
      setFormData(initialFormData);
    } catch (error) {
      let errorMsgText = "Ocurrió un error al crear la reserva. Intente nuevamente.";
      if (error instanceof Error) {
        console.error("Error en la reserva:", error.message);
        errorMsgText = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        console.error("Error en la reserva:", (error as { message: string }).message);
        errorMsgText = (error as { message: string }).message;
      } else {
        console.error("Error en la reserva:", error);
      }
      setErrorMsg(errorMsgText);
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
            {/* Nombre */}
            <div className="flex flex-col">
              <label htmlFor="nombre" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingrese su nombre completo"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col">
              <label htmlFor="telefono" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Ingrese su teléfono"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* Documento de Identidad */}
            <div className="flex flex-col">
              <label htmlFor="doc_ident" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Documento de Identidad
              </label>
              <input
                type="text"
                id="doc_ident"
                name="doc_ident"
                placeholder="Ingrese su documento"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.doc_ident}
                onChange={handleChange}
              />
            </div>

            {/* Correo Electrónico */}
            <div className="flex flex-col">
              <label htmlFor="correo" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@correo.com"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            {/* Matrícula de Embarcación */}
            <div className="flex flex-col">
              <label htmlFor="matric_emb" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Matrícula de Embarcación
              </label>
              <input
                type="text"
                id="matric_emb"
                name="matric_emb"
                placeholder="Ingrese la matrícula de la embarcación"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.matric_emb}
                onChange={handleChange}
              />
            </div>

            {/* Tipo de Servicio */}
            <div className="flex flex-col">
              <label htmlFor="id_servicio" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Tipo de Servicio
              </label>
              <select
                id="id_servicio"
                name="id_servicio"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.id_servicio}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                {SERVICIOS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Llegada */}
            <div className="flex flex-col">
              <label htmlFor="fecha_llegada" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Fecha de Llegada
              </label>
              <input
                type="date"
                id="fecha_llegada"
                name="fecha_llegada"
                required
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.fecha_llegada}
                onChange={handleChange}
              />
            </div>

            {/* Tipo de Pago */}
            <div className="flex flex-col">
              <label htmlFor="tipo_pago" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
                Tipo de Pago
              </label>
              <select
                id="tipo_pago"
                name="tipo_pago"
                required
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

            {/* Notas */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="notas" className="mb-2 font-semibold text-amber-400 dark:text-cyan-400">
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
