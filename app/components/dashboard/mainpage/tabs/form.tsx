// components/Form.tsx (or GenericForm.tsx)
import React, { useState, FormEvent } from 'react';

// Define the structure for each field in your form
interface FormField {
  name: string;
  label: string;
  type: string; // e.g., 'text', 'email', 'number', 'date', 'select'
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { value: string | number; label: string }[]; // For select fields: value can be string or number
  uppercase?: boolean; // Indicates if the text input should be converted to uppercase on submit
}

// Define the props for the GenericForm component
interface GenericFormProps<T> {
  fields: FormField[]; // Array of field definitions
  initialData?: Partial<T> | null; // Optional initial data for editing
  onSubmit: (formData: Partial<T>) => Promise<void>; // Function to call on form submission
  onCancel?: () => void; // Optional function to call on cancel
  loading?: boolean; // Loading state for submit button
  error?: string | null; // Error message to display
  submitButtonText?: string; // Custom text for submit button
  cancelButtonText?: string; // Custom text for cancel button
}

// Generic Form component that accepts an array of field definitions and handles submission
// T extends Record<string, any> allows T to be any object type (e.g., Cliente, Embarcacion)
const Form = <T extends Record<string, unknown>>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  submitButtonText = 'Enviar',
  cancelButtonText = 'Cancelar',
}: GenericFormProps<T>) => {
  // State to hold the form data, initialized with initialData or an empty object
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  // Effect to update form data when initialData changes (e.g., when editing a different item)
  React.useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  // Handler for input and select changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert string value to number if the field type is 'number'
    const fieldType = fields.find(field => field.name === name)?.type;
    let processedValue: string | number | null = value;

    if (fieldType === 'number') {
      processedValue = value === '' ? null : Number(value);
    } else if (value === '') {
      processedValue = null; // Treat empty strings for text fields as null for DB consistency
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue as T[keyof T], // Type assertion for correct assignment
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission

    const formattedData: Partial<T> = { ...formData };

    // Apply uppercase transformation to specified text/email fields
    fields.forEach((field) => {
      const value = formattedData[field.name as keyof T];
      if (
        typeof value === 'string' && // Only process string values
        field.uppercase && // If the field is marked for uppercase
        (field.type === 'text' || field.type === 'email') // And it's a text or email type
      ) {
        formattedData[field.name as keyof T] = value.toUpperCase() as T[keyof T];
      }
    });

    await onSubmit(formattedData); // Call the onSubmit prop with the formatted data
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
              // Render a select element if type is 'select' and options are provided
              <select
                id={field.name}
                name={field.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={(formData[field.name as keyof T] ?? '') as string | number} // Handle null/undefined, cast to string|number
                onChange={handleChange}
                required={field.required}
              >
                <option value="">Seleccione...</option> {/* Default empty option */}
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              // Render an input element for other types (text, number, email, date, etc.)
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                className="mt-1 pl-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                // For number inputs, ensure the value is treated as a string to avoid React warnings
                value={
                  field.type === 'number'
                    ? (formData[field.name as keyof T] as number | null)?.toString() ?? ''
                    : (formData[field.name as keyof T] as string) || ''
                }
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
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