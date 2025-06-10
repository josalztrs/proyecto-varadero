/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaCheckCircle, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { supabase } from '@/app/lib/supabase/supabase'; // Asegúrate de que esta ruta sea correcta para tu proyecto
import type { Tables } from '@/app/lib/supabase/db_types'; // Asegúrate de que esta ruta sea correcta para tu proyecto
import { toast } from 'sonner'; // Para notificaciones
import { useRouter } from 'next/navigation'; // Importar useRouter si estás en App Router para revalidatePath

// --- Definiciones de Tipos Específicos para el Componente ---
// Usamos Tables para obtener los tipos directamente de tu db_types.ts
type Transaccion = Tables<'transacciones'>;
type Cliente = Tables<'cliente'>;
type Servicio = Tables<'servicios'>;

// Tipo extendido para las transacciones que incluya detalles relacionados
// Ahora los detalles de cliente y servicio se obtienen directamente con el join
// y no necesitan ser marcados como opcionales, ya que el join devolverá null si no existe.
export interface TransaccionWithDetails extends Transaccion {
  cliente: {
    nombre: Cliente['nombre'];
    correo: Cliente['correo'];
    doc_ident: Cliente['doc_ident'];
    telefono: Cliente['telefono'];
    nacionalidad: Cliente['nacionalidad'];
  } | null;
  servicios: {
    tipo: Servicio['tipo'];
    precio: Servicio['precio'];
    perdidas: Servicio['perdidas'];
  } | null;
}

// Interfaz para la definición de columnas de la tabla
interface TableColumn {
  key: keyof Transaccion | 'cliente_nombre' | 'servicio_tipo' | 'servicio_perdidas' | 'actions';
  label: string;
  // Función para renderizar el contenido de la celda (útil para formatear o añadir JSX)
  render?: (item: TransaccionWithDetails) => React.ReactNode;
  // Propiedad para definir columnas que muestran datos de tablas relacionadas y que queremos un popover
  isRelatedDisplay?: {
    originalKey: keyof Transaccion; // La clave foránea original en "transacciones" (ej. 'id_cliente', 'id_servicio')
    label: string; // Etiqueta para el popover de detalles relacionados
    // Columnas a mostrar en el popover al pasar el ratón desde el objeto relacionado
    hoverDisplayColumns: { key: keyof Cliente | keyof Servicio | 'id' | 'created_at' | 'modified_at'; label: string; format?: (value: any) => string; }[];
  };
  // Si la columna debe ocultarse en pantallas pequeñas (útil para responsive)
  hideOnMobile?: boolean;
}

// --- Componente Principal ---
const ContabTransactionsViewer: React.FC = () => {
  const router = useRouter(); // Inicializa useRouter
  const [transactions, setTransactions] = useState<TransaccionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Estados para el popover de detalles al pasar el ratón
  const [hoveredItemDetails, setHoveredItemDetails] = useState<any | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref para controlar el timeout del hover

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<TransaccionWithDetails[]>([]);


  // Estado para manejar el estado de carga al actualizar el pago
  const [updatingPaymentId, setUpdatingPaymentId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 10; // Número de elementos a mostrar por página

  // --- Función para obtener las transacciones y sus detalles relacionados ---
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Optimizando la consulta con el "join" implícito de Supabase
      // 'cliente(nombre,correo,doc_ident,telefono,nacionalidad)' obtendrá solo esas columnas del cliente relacionado
      // 'servicios(tipo,precio,perdidas)' obtendrá solo esas columnas del servicio relacionado
      const {
        data: txs,
        error: txError,
        count,
      } = await supabase
        .from('transacciones')
        .select(
          `
          *,
          cliente(nombre, correo, doc_ident, telefono, nacionalidad),
          servicios(tipo, precio, perdidas)
        `,
          { count: 'exact' }
        )
        .order('fecha', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (txError) throw txError;

      if (count !== null) {
        setTotalItems(count);
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

      setTransactions(txs || []);
      setFilteredTransactions(txs || []); // Inicialmente, los filtrados son todos los obtenidos
    } catch (err: any) {
      console.error('Error al cargar las transacciones:', err.message);
      setError('Error al cargar las transacciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Se vuelve a ejecutar si currentPage cambia

  // Cargar las transacciones cuando el componente se monta o la página cambia
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // --- Efecto para el filtrado cuando cambia searchTerm o transactions ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTransactions(transactions);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = transactions.filter((item) => {
      // Comprueba si alguna columna contiene el término de búsqueda
      return transactionColumns.some((column) => {
        // Excluir columnas que no tienen sentido buscar o que ya están manejadas
        if (column.key === 'actions' || column.key === 'id_cliente' || column.key === 'id_servicio') {
          return false;
        }

        let valueToSearch: string = '';

        if (column.key === 'cliente_nombre' && item.cliente) {
          valueToSearch = item.cliente.nombre?.toLowerCase() || '';
        } else if (column.key === 'servicio_tipo' && item.servicios) {
          valueToSearch = item.servicios.tipo?.toLowerCase() || '';
        } else if (column.key === 'servicio_perdidas' && item.servicios) {
          valueToSearch = item.servicios.perdidas !== null ? String(item.servicios.perdidas) : '';
        } else if (column.key === 'fecha') {
          valueToSearch = item.fecha ? new Date(item.fecha).toLocaleDateString().toLowerCase() : '';
        } else if (column.key === 'monto_total') {
          valueToSearch = item.monto_total ? parseFloat(item.monto_total).toLocaleString('es-VE', { minimumFractionDigits: 2 }).toLowerCase() : '';
        } else {
          // Para columnas directas de Transaccion
          const directValue = item[column.key as keyof Transaccion]; // Acceso directo a la propiedad
          valueToSearch = directValue !== undefined && directValue !== null ? String(directValue).toLowerCase() : '';
        }
        return valueToSearch.includes(lowerCaseSearchTerm);
      });
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]); // Dependencias para re-filtrar

  // --- Manejadores de Eventos para el Popover de Hover ---
  const handleMouseEnter = useCallback((
    e: React.MouseEvent,
    item: TransaccionWithDetails,
    column: TableColumn
  ) => {
    // Limpiar cualquier timeout anterior para evitar parpadeos
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Retrasar la aparición del popover
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverPosition({ x: e.clientX + 10, y: e.clientY + 10 });

      // Determinar qué detalles mostrar basados en la columna y si cliente/servicio existen
      if (column.key === 'cliente_nombre' && item.cliente) {
        setHoveredItemDetails({ details: item.cliente, column: column });
      } else if (column.key === 'servicio_tipo' && item.servicios) {
        setHoveredItemDetails({ details: item.servicios, column: column });
      } else {
        setHoveredItemDetails(null); // No hay detalles específicos para mostrar
      }
    }, 300); // Retraso de 300ms
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Limpiar el timeout cuando el ratón sale, para que el popover desaparezca rápidamente
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItemDetails(null);
    setHoverPosition(null);
  }, []);

  // --- Lógica para actualizar el estado del pago ---
  const handleUpdatePaymentStatus = useCallback(async (transactionId: number) => {
    setUpdatingPaymentId(transactionId); // Muestra el spinner para esta transacción
    try {
      const { error } = await supabase
        .from('transacciones')
        .update({ modo_pago: 'Completado' })
        .eq('id', transactionId);

      if (error) {
        throw error;
      }

      toast.success(`Modo de pago de la transacción ${transactionId} actualizado a 'Completado'.`);
      await fetchTransactions(); // Vuelve a cargar los datos para reflejar el cambio
      router.refresh(); // Notifica a Next.js para invalidar la caché de la ruta y re-renderizar Server Components
    } catch (error: any) {
      console.error('Error al actualizar el estado del pago:', error.message);
      toast.error(`Error al actualizar el estado del pago: ${error.message}`);
    } finally {
      setUpdatingPaymentId(null); // Oculta el spinner
    }
  }, [fetchTransactions, router]); // Se vuelve a ejecutar si fetchTransactions o router cambian

  // --- Definición de las Columnas de la Tabla ---
  const transactionColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'fecha', label: 'Fecha', render: (item) => new Date(item.fecha).toLocaleDateString() },
    {
      key: 'cliente_nombre', // Este es un campo "virtual" de nuestro tipo extendido
      label: 'Cliente',
      isRelatedDisplay: {
        originalKey: 'id_cliente',
        label: 'Cliente',
        hoverDisplayColumns: [
          { key: 'nombre', label: 'Nombre' },
          { key: 'doc_ident', label: 'Doc. Ident.' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Teléfono' },
        ],
      },
      render: (item) => item.cliente?.nombre || 'N/A', // Muestra directamente el nombre del cliente
    },
    {
      key: 'modo_pago',
      label: 'Modo de Pago',
      render: (item) => (
        <span className={`font-medium ${item.modo_pago === 'Pendiente' ? 'text-orange-500' : 'text-green-600'}`}>
          {item.modo_pago}
        </span>
      )
    },
    { key: 'ref', label: 'Referencia', render: (item) => item.ref || 'N/A' },
    { key: 'conc', label: 'Concepto', render: (item) => item.conc || 'N/A', hideOnMobile: true },
    {
      key: 'servicio_tipo', // Campo virtual de nuestro tipo extendido
      label: 'Servicio',
      isRelatedDisplay: {
        originalKey: 'id_servicio',
        label: 'Tipo de Servicio',
        hoverDisplayColumns: [
          { key: 'tipo', label: 'Tipo' },
          { key: 'precio', label: 'Precio', format: (val) => `$${parseFloat(val).toLocaleString('es-VE', { minimumFractionDigits: 2 })}` },
          { key: 'perdidas', label: 'Pérdidas', format: (val) => `$${parseFloat(val).toLocaleString('es-VE', { minimumFractionDigits: 2 })}` },
        ],
      },
      render: (item) => item.servicios?.tipo || 'Sin Servicio',
    },
    {
      key: 'monto_total',
      label: 'Monto Total',
      render: (item) => (
        <span className="font-bold text-green-600 dark:text-green-400">
          ${parseFloat(item.monto_total).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'servicio_perdidas', // Campo virtual para mostrar las pérdidas del servicio
      label: 'Pérdidas',
      render: (item) => (
        <span className="font-bold text-red-600 dark:text-red-400">
          ${item.servicios?.perdidas !== undefined && item.servicios?.perdidas !== null
            ? parseFloat(item.servicios.perdidas.toString()).toLocaleString('es-VE', { minimumFractionDigits: 2 })
            : '0.00'}
        </span>
      ),
      hideOnMobile: true
    },
    { key: 'varadero', label: 'Varadero', render: (item) => item.varadero || 'N/A', hideOnMobile: true },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item) => (
        item.modo_pago === 'Pendiente' ? (
          <button
            onClick={() => handleUpdatePaymentStatus(item.id)}
            disabled={updatingPaymentId === item.id}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center
              ${updatingPaymentId === item.id
                ? 'bg-blue-300 dark:bg-blue-600 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
              }`}
            title="Marcar como Completado"
          >
            {updatingPaymentId === item.id ? (
              <FaSpinner className="animate-spin mr-1" />
            ) : (
              <FaCheckCircle className="mr-1" />
            )}
            Completar Pago
          </button>
        ) : (
          <span className="text-gray-500 dark:text-gray-400 font-medium">Completado</span>
        )
      ),
    },
  ];

  // --- Manejador de Cambio de Página ---
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner flex flex-col"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center border-b pb-3 border-emerald-300 dark:border-emerald-700">
        <FaMoneyBillWave className="mr-3 text-emerald-600 text-3xl" /> Visor de Transacciones
      </h2>

      {/* --- Campo de Búsqueda --- */}
      <div className="mb-6 flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        <FaInfoCircle className="text-blue-500 text-lg" />
        <input
          type="text"
          placeholder="Buscar por ID, Cliente, Servicio, Concepto, Modo de Pago, Referencia..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- Mensajes de Estado: Cargando, Error, Vacío --- */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-emerald-500 text-4xl" />
          <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Cargando transacciones...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center my-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          <p className="text-xl font-semibold mb-2">
            {searchTerm ? 'No se encontraron transacciones que coincidan con la búsqueda.' : 'No hay transacciones registradas.'}
          </p>
          <p className="text-sm">Intenta ajustar tu búsqueda o añade nuevas transacciones.</p>
        </div>
      ) : (
        <>
          {/* --- Estructura de la Tabla --- */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-6 border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {transactionColumns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${column.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredTransactions.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {transactionColumns.map((column) => (
                        <td
                          key={`${item.id}-${column.key}`}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${column.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                        >
                          {column.isRelatedDisplay ? (
                            // Renderiza un enlace para datos relacionados con popover al pasar el ratón
                            <span
                              className="relative cursor-pointer text-blue-600 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              onMouseEnter={(e) => handleMouseEnter(e, item, column)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {column.render ? column.render(item) : 'N/A'}
                            </span>
                          ) : column.render ? (
                            // Si hay una función de renderizado personalizada para la columna
                            column.render(item)
                          ) : (
                            // Por defecto, muestra el valor de la propiedad directamente
                            (item[column.key as keyof TransaccionWithDetails] as string) || 'N/A'
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* --- Paginación --- */}
          <div className="flex justify-between items-center mt-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Anterior
            </button>
            <span className="font-semibold text-base">
              Página {currentPage} de {totalPages} ({totalItems} registros)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* --- Popover de Detalles al Pasar el Ratón (Hover Popover) --- */}
      <AnimatePresence>
        {hoveredItemDetails && hoverPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: hoverPosition.y,
              left: hoverPosition.x,
              zIndex: 100,
              pointerEvents: 'none',
            }}
            className="bg-gray-900 text-white p-3 rounded-md shadow-lg max-w-xs text-xs border border-gray-700"
          >
            <p className="font-bold mb-1 text-base text-blue-300">
              Detalles de {hoveredItemDetails.column.isRelatedDisplay.label}:
            </p>
            {hoveredItemDetails.details ? (
              <>
                {hoveredItemDetails.column.isRelatedDisplay.hoverDisplayColumns.map(
                  (col: { key: string; label: string; format?: (value: any) => string }) => {
                    const value = hoveredItemDetails.details[col.key];
                    const displayValue = col.format ? col.format(value) : (value || 'N/A');
                    return (
                      <p key={col.key} className="text-gray-200">
                        <span className="font-semibold text-gray-100">{col.label}:</span>{' '}
                        {displayValue}
                      </p>
                    );
                  }
                )}
              </>
            ) : (
              <p>No se encontraron detalles.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContabTransactionsViewer;