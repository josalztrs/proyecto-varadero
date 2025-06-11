'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'error' | 'success';
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

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

  // Generador de notificaciones de ejemplo (reemplaza con fuente real)
  useEffect(() => {
    const types: NotificationItem['type'][] = ['info', 'warning', 'error', 'success'];
    const messages = [
      'Nuevo mensaje recibido',
      'Tarea completada con éxito',
      'Advertencia del sistema',
      'Error en el proceso',
      'Actualización disponible'
    ];

    const intervalId = setInterval(() => {
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        message: messages[Math.floor(Math.random() * messages.length)],
        read: false,
        timestamp: new Date(),
        type: types[Math.floor(Math.random() * types.length)]
      };
      setNotifications(prev => [newNotification, ...prev].slice(0, 20));
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  // Scroll arriba cuando se abre el panel
  useEffect(() => {
    if (isOpen && notificationsRef.current) {
      notificationsRef.current.scrollTop = 0;
    }
  }, [notifications, isOpen]);

  // Función para agregar notificaciones desde fuera (si quieres exponer)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const hasUnreadNotifications = notifications.some(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: NotificationItem['type'] = 'info') => {
    switch (type) {
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
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
                title='.'
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
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
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <div className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                          {notification.message}
                        </div>
                        <button
                          title='.'
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
