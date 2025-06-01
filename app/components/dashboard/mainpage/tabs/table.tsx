// components/GenericTable.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableColumn<T> {
  key: keyof T | 'actions'; // 'actions' is a special key for action buttons
  label: string;
  render?: (item: T) => React.ReactNode; // Optional custom renderer for complex cells
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void; // Assuming 'id' is always the identifier
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  deleteConfirmMessage?: string;
}

const Table = <T extends { id: number; [key: string]: any }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage = 'No items registered yet.',
  deleteConfirmMessage = 'Are you sure you want to delete this item? This action is irreversible.',
}: GenericTableProps<T>) => {
  if (loading && !data.length) {
    return <p className="text-center text-gray-600 dark:text-gray-400">Loading items...</p>;
  }

  if (!loading && data.length === 0 && !error) {
    return <p className="text-center text-gray-600 dark:text-gray-400">{emptyMessage}</p>;
  }

  if (error && data.length === 0 && !loading) {
    return <p className="text-center text-red-600 dark:text-red-400 text-lg">{error}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)} // Ensure key is a string
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {data.map((item) => (
                <motion.tr
                  key={item.id} // Assumes all items have an 'id' property
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${String(column.key)}`} // Unique key for each cell
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {column.key === 'actions' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(item)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-500"
                            aria-label={`Edit ${item.nombre || item.name || item.id}`} // Use a relevant field for aria-label
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(deleteConfirmMessage)) {
                                onDelete(item.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500 ml-2"
                            aria-label={`Delete ${item.nombre || item.name || item.id}`}
                          >
                            Delete
                          </button>
                        </div>
                      ) : column.render ? (
                        column.render(item)
                      ) : (
                        (item[column.key as keyof T] as string) || 'N/A' // Display 'N/A' for null/undefined
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4 text-gray-800 dark:text-gray-100">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="font-semibold">{currentPage} de {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </>
  );
};

export default Table;