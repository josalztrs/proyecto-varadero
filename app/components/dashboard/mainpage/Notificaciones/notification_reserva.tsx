"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import NotificationList, { NotificationItem } from "./notification";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/app/lib/supabase/supabase";

type Cliente = {
  nombre: string;
  doc_ident: string;
  correo: string;
  telefono: string;
  nacionalidad?: string;
};

type Servicio = {
  id: number;
  tipo: string;
};

type ReservaDetalle = {
  id: number;
  doc_cliente: string;
  matric_emb: string;
  id_servicio: number;
  fecha_est: string;
  fecha_sal: string;
  estado: string;
  notas?: string | null;
  tipo_pago?: string | null;
  cliente: Cliente | null;
  servicio: Servicio | null;
};

const ReservaNotification = () => {
  const [showModal, setShowModal] = useState(false);
  const [detalle, setDetalle] = useState<ReservaDetalle | null>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.reserv_id) return;
    setDetalleLoading(true);
    setShowModal(true);

    const { data: reserva, error } = await supabase
      .from("reservaciones")
      .select(
        "id, doc_cliente, matric_emb, id_servicio, fecha_est, fecha_sal, estado, notas, tipo_pago"
      )
      .eq("id", Number(notification.reserv_id))
      .maybeSingle();

    if (error || !reserva) {
      setDetalle(null);
      setDetalleLoading(false);
      return;
    }

    const { data: cliente } = await supabase
      .from("cliente")
      .select("nombre, doc_ident, correo, telefono, nacionalidad")
      .eq("doc_ident", reserva.doc_cliente)
      .maybeSingle();

    const { data: servicio } = await supabase
      .from("servicios")
      .select("id, tipo")
      .eq("id", reserva.id_servicio)
      .maybeSingle();

    setDetalle({
      ...reserva,
      cliente: cliente ?? null,
      servicio: servicio ?? null,
    });
    setDetalleLoading(false);
  };

  const handleDecision = async (decision: "aprobada" | "rechazada") => {
    if (!detalle) return;
    setDetalleLoading(true);
    const { error } = await supabase
      .from("reservaciones")
      .update({ estado: decision })
      .eq("id", detalle.id);

    if (!error) {
      setDetalle((prev) => (prev ? { ...prev, estado: decision } : prev));
      setShowModal(false);
    }
    setDetalleLoading(false);
  };

  const modalContent = (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full mx-4 p-8 relative text-gray-900 dark:text-white"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 dark:hover:text-cyan-400 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar modal"
              type="button"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-amber-500 dark:text-cyan-400 text-center">
              Detalle de Reserva
            </h2>
            {detalleLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Cargando información...
              </div>
            ) : detalle && detalle.cliente && detalle.servicio ? (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Cliente:</span> {detalle.cliente.nombre}
                </div>
                <div>
                  <span className="font-semibold">Documento:</span> {detalle.cliente.doc_ident}
                </div>
                <div>
                  <span className="font-semibold">Correo:</span> {detalle.cliente.correo}
                </div>
                <div>
                  <span className="font-semibold">Teléfono:</span> {detalle.cliente.telefono}
                </div>
                {detalle.cliente.nacionalidad && (
                  <div>
                    <span className="font-semibold">Nacionalidad:</span> {detalle.cliente.nacionalidad}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Servicio:</span> {detalle.servicio.tipo}
                </div>
                <div>
                  <span className="font-semibold">Matrícula embarcación:</span> {detalle.matric_emb}
                </div>
                <div>
                  <span className="font-semibold">Fecha estimada:</span> {detalle.fecha_est}
                </div>
                <div>
                  <span className="font-semibold">Fecha de salida:</span> {detalle.fecha_sal}
                </div>
                <div>
                  <span className="font-semibold">Tipo de pago:</span> {detalle.tipo_pago}
                </div>
                <div>
                  <span className="font-semibold">Estado:</span>{" "}
                  <span
                    className={
                      detalle.estado === "aprobada"
                        ? "text-green-600"
                        : detalle.estado === "rechazada"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {detalle.estado.charAt(0).toUpperCase() + detalle.estado.slice(1)}
                  </span>
                </div>
                {detalle.notas && (
                  <div>
                    <span className="font-semibold">Nota:</span>{" "}
                    <span className="italic">{detalle.notas}</span>
                  </div>
                )}
                {detalle.estado === "pendiente" && (
                  <div className="flex gap-4 mt-6 justify-center">
                    <button
                      type="button"
                      onClick={() => handleDecision("aprobada")}
                      disabled={detalleLoading}
                      className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision("rechazada")}
                      disabled={detalleLoading}
                      className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-red-500">
                No se pudo cargar la información de la reserva.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <NotificationList onNotificationClick={handleNotificationClick} />
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(modalContent, document.getElementById("portal-root")!)}
    </>
  );
};

export default ReservaNotification;
