/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GenericTable.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- New Interfaces for Related Data ---
interface RelatedTableColumn<T> {
  key: keyof T; // The foreign key column in the current table (e.g., 'dueno_id')
  label: string; // Label for the column header
  relatedTableName: string; // The table it relates to (e.g., 'cliente')
  relatedIdColumn: string; // The ID column in the related table (e.g., 'id')
  displayColumn: string; // The column from the related table to display initially (e.g., 'nombre')
  // Columns to display in the hover popover for the related item
  hoverDisplayColumns: { key: string; label: string }[];
}

// TableColumn now includes the possibility of being a RelatedTableColumn
interface TableColumn<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  isRelated?: RelatedTableColumn<T>; // New prop to define related data
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  deleteConfirmMessage?: string;
  // --- New prop: function to fetch related item details ---
  fetchRelatedItemDetails: (tableName: string, id: number) => Promise<any | null>;
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
  fetchRelatedItemDetails, // Destructure the new prop
}: GenericTableProps<T>) => {
  // --- State for Hover Popover ---
  const [hoveredItemDetails, setHoveredItemDetails] = useState<any | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoverLoading, setHoverLoading] = useState(false);

  // --- State for Search ---
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleMouseEnter = async (
    e: React.MouseEvent,
    relatedTable: string,
    id: number,
    column: TableColumn<T>
  ) => {
    setHoverLoading(true);
    setHoverPosition({ x: e.clientX + 10, y: e.clientY + 10 }); // Position near cursor
    try {
      const details = await fetchRelatedItemDetails(relatedTable, id);
      setHoveredItemDetails({ details, column }); // Store details and the column definition
    } catch (err) {
      console.error('Error fetching related item details:', err);
      setHoveredItemDetails(null);
    } finally {
      setHoverLoading(false);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItemDetails(null);
    setHoverPosition(null);
  };

  // --- Filter data based on search term ---
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true; // If no search term, return all data

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Iterate over columns and check if any string value matches the search term
    return columns.some((column) => {
      if (column.key === 'actions') return false; // Don't search in action buttons

      const value = item[column.key as keyof T];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseSearchTerm);
      }
      // For related columns, search in their displayColumn if it's a string
      if (column.isRelated && typeof item[column.isRelated.displayColumn as keyof T] === 'string') {
          return (item[column.isRelated.displayColumn as keyof T] as string).toLowerCase().includes(lowerCaseSearchTerm);
      }
      // You can add more complex logic for number, boolean, or other types if needed
      if (typeof value === 'number' || typeof value === 'boolean') {
          return String(value).toLowerCase().includes(lowerCaseSearchTerm);
      }
      return false;
    });
  });

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && !data.length ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Cargando elementos...</p>
      ) : error && data.length === 0 && !loading ? (
        <p className="text-center text-red-600 dark:text-red-400 text-lg">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          {searchTerm ? 'No se encontraron elementos que coincidan con la búsqueda.' : emptyMessage}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
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
                  {filteredData.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {columns.map((column) => (
                        <td
                          key={`${item.id}-${String(column.key)}`}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {column.key === 'actions' ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => onEdit(item)}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-500"
                                aria-label={`Edit ${item.nombre || item.name || item.id}`}
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
                          ) : column.isRelated ? (
                            <span
                              className="relative cursor-pointer text-blue-500 hover:underline"
                              onMouseEnter={(e) =>
                                handleMouseEnter(
                                  e,
                                  column.isRelated!.relatedTableName,
                                  item[column.isRelated!.key] as number,
                                  column
                                )
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              {(item[column.isRelated.displayColumn as keyof T] as string) ||
                                (item[column.isRelated.key as keyof T] as string) ||
                                'N/A'}
                            </span>
                          ) : column.render ? (
                            column.render(item)
                          ) : (
                            (item[column.key as keyof T] as string) || 'N/A'
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
            <span className="font-semibold">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* --- Hover Popover --- */}
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
            className="bg-gray-900 text-white p-3 rounded-md shadow-lg max-w-xs text-xs"
          >
            {hoverLoading ? (
              <p>Cargando detalles...</p>
            ) : hoveredItemDetails.details ? (
              <div>
                <p className="font-bold mb-1">
                  Detalles de {hoveredItemDetails.column.label}:
                </p>
                {hoveredItemDetails.column.isRelated.hoverDisplayColumns.map(
                  (col: { key: string; label: string }) => (
                    <p key={col.key}>
                      <span className="font-semibold">{col.label}:</span>{' '}
                      {hoveredItemDetails.details[col.key] || 'N/A'}
                    </p>
                  )
                )}
              </div>
            ) : (
              <p>No se encontraron detalles.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Table;