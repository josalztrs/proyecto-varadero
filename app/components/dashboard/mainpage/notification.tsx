'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/supabase';
import { Tables } from '@/app/lib/supabase/db_types';

// Define el tipo de la notificación basándose en tu esquema de Supabase
type NotificationItem = Tables<'notificaciones'> & {
  type?: 'info' | 'warning' | 'error' | 'success'; // Campo `tipo` de Supabase mapeado a tipos más específicos de Tailwind
  read?: boolean; // Alias para la UI
  timestamp?: Date; // Alias para la UI
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función auxiliar para mapear el 'tipo' de Supabase a tus tipos de Tailwind
  const mapSupabaseTypeToUIType = (supabaseType: string | null): NotificationItem['type'] => {
    switch (supabaseType?.toLowerCase()) {
      case 'confirmacion':
      case 'success':
        return 'success';
      case 'advertencia':
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'recordatorio':
      case 'info':
      default:
        return 'info';
    }
  };

  // Cargar notificaciones iniciales al montar el componente
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Limitar a las últimas 20 notificaciones

      if (error) {
        console.error('Error fetching notifications:', error);
      } else if (data) {
        // Mapea los datos de Supabase a NotificationItem, añadiendo el `type` para la UI
        const formattedNotifications: NotificationItem[] = data.map((n: Tables<'notificaciones'>) => ({
          ...n,
          type: mapSupabaseTypeToUIType(n.tipo), // Mapea el tipo de la base de datos
          // Propiedades adicionales para la UI (no afectan el tipo base)
          read: n.leido, // Alias para la UI
          timestamp: new Date(n.created_at || n.fecha), // Alias para la UI
        }));
        setNotifications(formattedNotifications);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  // Suscripción a cambios en tiempo real de Supabase
  useEffect(() => {
    const channel = supabase
      .channel('public:notificaciones') // Nombre del canal (coincide con pg_notify)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificaciones' },
        (payload: { new: unknown; }) => {
          // Cuando se inserta una nueva notificación
          const newNotification: NotificationItem = {
            ...(payload.new as Tables<'notificaciones'>),
            id: (payload.new as Tables<'notificaciones'>).id,
            read: (payload.new as Tables<'notificaciones'>).leido,
            timestamp: new Date(
              (payload.new as Tables<'notificaciones'>).created_at ||
                (payload.new as Tables<'notificaciones'>).fecha
            ),
            type: mapSupabaseTypeToUIType((payload.new as Tables<'notificaciones'>).tipo),
          };
          setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notificaciones' },
        (payload: { new: unknown; }) => {
          // Cuando se actualiza una notificación (ej. leída)
          const updatedNotificationData = payload.new as Tables<'notificaciones'>;
          setNotifications((prev) =>
            prev.map((notif) =>
              String(notif.id) === String(updatedNotificationData.id)
                ? {
                    ...notif,
                    read: updatedNotificationData.leido,
                    message: updatedNotificationData.mensaje,
                    type: mapSupabaseTypeToUIType(updatedNotificationData.tipo),
                  }
                : notif
            )
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notificaciones' },
        (payload: { old: unknown; }) => {
          // Cuando se elimina una notificación
          const deletedId = String((payload.old as Tables<'notificaciones'>).id);
          setNotifications((prev) => prev.filter((n) => String(n.id) !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll arriba cuando se abre el panel
  useEffect(() => {
    if (isOpen && notificationsRef.current) {
      notificationsRef.current.scrollTop = 0;
    }
  }, [notifications, isOpen]);

  // Modificada para actualizar la base de datos
  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leido: true })
      .eq('id', parseInt(id)); // Asegúrate de que el ID sea numérico si en la DB es int

    if (error) {
      console.error('Error marking notification as read:', error);
    }
    // El Realtime Listener actualizará el estado local
  }, []);

  // Modificada para actualizar la base de datos
  const markAllAsRead = useCallback(async () => {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leido: true })
      .eq('leido', false); // Marcar solo las no leídas como leídas

    if (error) {
      console.error('Error marking all notifications as read:', error);
    }
    // El Realtime Listener actualizará el estado local
  }, []);

  // Modificada para eliminar de la base de datos
  const deleteNotification = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('id', parseInt(id)); // Asegúrate de que el ID sea numérico si en la DB es int

    if (error) {
      console.error('Error deleting notification:', error);
    }
    // El Realtime Listener actualizará el estado local
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Cuando se abre el panel, se marcan todas como leídas
      // Esto dispara el markAllAsRead que actualiza la DB
      markAllAsRead();
    }
  };

  const hasUnreadNotifications = notifications.some((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: NotificationItem['type'] = 'info') => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Notificaciones"
      >
        {hasUnreadNotifications ? (
          <div className="relative">
            <FaBell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        ) : (
          <FaBell className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black/10 dark:ring-white/10 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">Notificaciones</h3>
              <button
                title="Cerrar notificaciones"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Cargando notificaciones...
                </div>
              ) : notifications.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => markAsRead(String(notification.id))}
                    >
                      <div className="flex justify-between">
                        <div className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                          {notification.mensaje} {/* Usa 'mensaje' de la DB */}
                        </div>
                        <button
                          title="Eliminar notificación"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(String(notification.id));
                          }}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.timestamp
                            ? notification.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                        {!notification.read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center">
                  <FaBellSlash className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No tienes notificaciones
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-700 text-right">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Marcar todas como leídas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;