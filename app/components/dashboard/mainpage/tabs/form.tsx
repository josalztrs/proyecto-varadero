// components/GenericForm.tsx
import React, { useState, FormEvent } from 'react';

interface FormField {
  name: string;
  label: string;
  type: string; // e.g., 'text', 'email', 'number', 'select'
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
}

interface GenericFormProps<T> {
  fields: FormField[];
  initialData?: Partial<T> | null; // Data for editing
  onSubmit: (formData: Partial<T>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  submitButtonText?: string;
  cancelButtonText?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Form = <T extends Record<string, any>>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  submitButtonText = 'Enviar',
  cancelButtonText = 'Cancelar',
}: GenericFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  // Update formData when initialData changes (e.g., when starting to edit a new item)
  React.useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value, // Treat empty string as null for DB
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        {initialData ? 'Editar' : 'Crear'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' && field.options ? (
              <select
                id={field.name}
                name={field.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData[field.name as keyof T] ?? ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">Seleccione...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                className="mt-1 pl-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={(formData[field.name as keyof T] as string) || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-amber-400 text-gray-800 dark:text-white font-medium rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-100 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Processing...' : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors duration-100 ease-in-out"
            disabled={loading}
          >
            {cancelButtonText}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
    </form>
  );
};

export default Form;