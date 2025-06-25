"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabase/supabase";
import {
  ReservaFormState,
  SERVICIOS,
  validarReserva,
} from "./ReservaForm";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: ReservaFormState = {
  nombre: "",
  doc_ident: "",
  matric_emb: "",
  id_servicio: "",
  fecha_llegada: "",
  tipo_pago: "",
  notas: "",
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { scale: 0.95, y: 40, opacity: 0 },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { scale: 0.95, y: 40, opacity: 0, transition: { duration: 0.15 } },
};

const ReservaModal = ({ isOpen, onClose }: ReservaModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ReservaFormState, string>>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name !== "nombre") {
      const error = validarReserva(name as keyof ReservaFormState, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
  if (isOpen) {
    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
  } else {
    // Restaurar scroll del body
    document.body.style.overflow = "";
  }
  // Limpieza por si el componente se desmonta
  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validar todos los campos excepto nombre antes de enviar
    const newErrors: Partial<Record<keyof ReservaFormState, string>> = {};
    for (const key of Object.keys(formData) as (keyof ReservaFormState)[]) {
      if (key === "nombre") continue;
      const error = validarReserva(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMsg("Por favor, corrige los errores antes de continuar.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Verificar si cliente existe
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

      // Verificar si embarcación existe y pertenece al cliente
      const { data: embarcacion, error: errorEmbarcacion } = await supabase
        .from("embarcacion")
        .select("matricula, ced_cliente")
        .eq("matricula", formData.matric_emb)
        .maybeSingle();

      if (errorEmbarcacion) throw errorEmbarcacion;

      if (!embarcacion) {
        setErrorMsg("La embarcación no está registrada en el sistema.");
        setLoading(false);
        return;
      }

      if (embarcacion.ced_cliente !== cliente.doc_ident) {
        setErrorMsg("La embarcación no pertenece al cliente con el documento de identidad proporcionado.");
        setLoading(false);
        return;
      }

      // Insertar reserva
      const { data: reservaData, error: errorReserva } = await supabase
        .from("reservaciones")
        .insert([
          {
            doc_cliente: cliente.doc_ident,
            matric_emb: formData.matric_emb,
            id_servicio: Number(formData.id_servicio),
            fecha_est: formData.fecha_llegada,
            estado: "pendiente",
            notas: formData.notas,
            tipo_pago: formData.tipo_pago,
          },
        ])
        .select("id")
        .single();

      if (errorReserva) throw errorReserva;

      // Insertar notificación
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
        errorMsgText = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        errorMsgText = (error as { message: string }).message;
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
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-30 overflow-y-auto"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-slate-900 rounded-xl shadow-xl max-w-5xl w-full mx-4 p-8 relative text-white"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 dark:hover:text-cyan-400 text-2xl font-bold"
            onClick={onClose}
            aria-label="Cerrar modal"
            type="button"
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
            {/* Documento de Identidad */}
            <div className="flex flex-col">
              <label
                htmlFor="doc_ident"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Documento de Identidad{" "}
                <span className="text-xs text-gray-400 block">
                  Ej: V-12345678 (V/J/E/P/G seguido de guion y 7-9 números)
                </span>
              </label>
              <input
                type="text"
                id="doc_ident"
                name="doc_ident"
                placeholder="Ingrese su documento"
                required
                maxLength={11}
                pattern="^[VEJPG]-\d{7,9}$"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.doc_ident}
                onChange={handleChange}
              />
              {errors.doc_ident && (
                <span className="text-sm text-red-500 mt-1">{errors.doc_ident}</span>
              )}
            </div>

            {/* Matrícula de Embarcación */}
            <div className="flex flex-col">
              <label
                htmlFor="matric_emb"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Matrícula de Embarcación{" "}
                <span className="text-xs text-gray-400 block">
                  Ej: ABCD-1234 (letras, números y guion, 4-15 caracteres)
                </span>
              </label>
              <input
                type="text"
                id="matric_emb"
                name="matric_emb"
                placeholder="Ingrese la matrícula de la embarcación"
                required
                minLength={4}
                maxLength={15}
                pattern="^[A-Za-z0-9\-]{4,15}$"
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.matric_emb}
                onChange={handleChange}
              />
              {errors.matric_emb && (
                <span className="text-sm text-red-500 mt-1">{errors.matric_emb}</span>
              )}
            </div>

            {/* Tipo de Servicio */}
            <div className="flex flex-col">
              <label
                htmlFor="id_servicio"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Tipo de Servicio{" "}
                <span className="text-xs text-gray-400 block">Seleccione una opción</span>
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
              {errors.id_servicio && (
                <span className="text-sm text-red-500 mt-1">{errors.id_servicio}</span>
              )}
            </div>

            {/* Fecha de Llegada */}
            <div className="flex flex-col">
              <label
                htmlFor="fecha_llegada"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Fecha de Llegada{" "}
                <span className="text-xs text-gray-400 block">Ej: 2025-07-01 (hoy o fecha futura)</span>
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
              {errors.fecha_llegada && (
                <span className="text-sm text-red-500 mt-1">{errors.fecha_llegada}</span>
              )}
            </div>

            {/* Tipo de Pago */}
            <div className="flex flex-col">
              <label
                htmlFor="tipo_pago"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Tipo de Pago{" "}
                <span className="text-xs text-gray-400 block">Seleccione una opción</span>
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
              {errors.tipo_pago && (
                <span className="text-sm text-red-500 mt-1">{errors.tipo_pago}</span>
              )}
            </div>

            {/* Notas */}
            <div className="flex flex-col md:col-span-2">
              <label
                htmlFor="notas"
                className="mb-2 font-semibold text-amber-400 dark:text-cyan-400"
              >
                Notas{" "}
                <span className="text-xs text-gray-400 block">
                  Opcional. Máximo 200 caracteres. Solo letras, números y signos básicos.
                </span>
              </label>
              <textarea
                id="notas"
                name="notas"
                rows={3}
                placeholder="Notas adicionales o requerimientos"
                maxLength={200}
                className="rounded-md border border-amber-400/50 dark:border-cyan-400/50 bg-slate-800 px-3 py-2 text-white resize-y focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-400"
                value={formData.notas}
                onChange={handleChange}
              />
              {errors.notas && (
                <span className="text-sm text-red-500 mt-1">{errors.notas}</span>
              )}
            </div>

            {/* Mensajes generales */}
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
