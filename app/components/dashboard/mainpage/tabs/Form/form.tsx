/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  uppercase?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  options?: { value: string | number; label: string }[];
  customValidate?: (value: string, formData?: Record<string, unknown>) => string | null;
}

interface GenericFormProps<T> {
  fields: FormField[];
  initialData?: Partial<T> | null;
  onSubmit: (formData: Partial<T>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  submitButtonText?: string;
  cancelButtonText?: string;
  renderField?: (
    field: FormField,
    value: any,
    error: string | null,
    handleCustomChange: (value: string, name?: string) => void,
    disabled: boolean,
    index?: number
  ) => React.ReactNode;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { when: 'afterChildren', duration: 0.3, ease: 'easeIn' },
  },
};

const Form = <T extends Record<string, unknown>>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error = null,
  submitButtonText = 'Enviar',
  cancelButtonText = 'Cancelar',
  renderField,
}: GenericFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showGeneralError, setShowGeneralError] = useState(false);

  React.useEffect(() => {
    setFormData(initialData || {});
    setErrors({});
    setShowGeneralError(false);
  }, [initialData]);

  React.useEffect(() => {
    if (showGeneralError) {
      const timeout = setTimeout(() => setShowGeneralError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showGeneralError]);

  const validateField = (
    field: FormField,
    value: any,
    customFormData?: Partial<T>
  ): string | null => {
    const currentFormData = customFormData || formData;

    if (field.required && (value === null || value === undefined || value === '')) {
      return `${field.label} es obligatorio.`;
    }

    if (typeof value === 'string' && field.maxLength && value.length > field.maxLength) {
      return `${field.label} debe tener máximo ${field.maxLength} caracteres.`;
    }

    if (typeof value === 'string' && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return `${field.label} tiene un formato inválido.`;
      }
    }

    if (typeof value === 'string' && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return `${field.label} no es un correo válido.`;
      }
    }

    if (field.type === 'number') {
      const strValue = String(value);
      if (strValue && !/^\d+$/.test(strValue)) {
        return `${field.label} debe ser un número entero positivo.`;
      }
      const numValue = Number(value);
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} debe ser mayor o igual a ${field.min}.`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} debe ser menor o igual a ${field.max}.`;
      }
      if (field.maxLength && strValue.length > field.maxLength) {
        return `${field.label} debe tener máximo ${field.maxLength} dígitos.`;
      }
    }

    if (field.customValidate) {
      const customError = field.customValidate(String(value ?? ''), currentFormData);
      if (customError) return customError;
    }

    return null;
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | {
        target: { name: string; value: any };
      }
    ) => {
      const { name, value } = e.target;
      const field = fields.find((f) => f.name === name);
      if (!field) return;

      let processedValue: any = value;

      if (field.type === 'number') {
        const num = Number(value);
        processedValue = value === '' || isNaN(num) ? null : num;
      } else if (value === '') {
        processedValue = null;
      }

      if (typeof processedValue === 'string' && field.uppercase) {
        processedValue = processedValue.toUpperCase();
      }

      setFormData((prev) => {
        const newData = { ...prev, [name]: processedValue };

        if (name === 'tipo') {
          const dependientes = ['matricula', 'amarres_asign', 'cuadr_asign'];
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            dependientes.forEach((dep) => {
              const depField = fields.find((f) => f.name === dep);
              if (depField) {
                const depValue = newData[dep];
                newErrors[dep] = validateField(depField, depValue, newData);
              }
            });
            newErrors[name] = validateField(field, processedValue, newData);
            return newErrors;
          });
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(field, processedValue, newData),
          }));
        }

        return newData;
      });
    },
    [fields, validateField]
  );

  const handleCustomChange = (value: string, name?: string) => {
    if (!name) return;
    const field = fields.find((f) => f.name === name);
    if (!field) return;

    let processedValue: any = value;

    if (field.type === 'number') {
      const num = Number(value);
      processedValue = value === '' || isNaN(num) ? null : num;
    } else if (value === '') {
      processedValue = null;
    }

    if (typeof processedValue === 'string' && field.uppercase) {
      processedValue = processedValue.toUpperCase();
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: processedValue };
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(field, processedValue, newData),
      }));
      return newData;
    });
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>,
    field: FormField
  ) => {
    if (
      field.type === 'text' &&
      field.inputMode === 'numeric' &&
      field.maxLength
    ) {
      const target = e.target as HTMLInputElement;
      if (target.value.length > field.maxLength) {
        target.value = target.value.slice(0, field.maxLength);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | null> = {};
    let hasError = false;

    fields.forEach((field) => {
      const value = formData[field.name as keyof T];
      const errorMsg = validateField(field, value);
      newErrors[field.name] = errorMsg;
      if (errorMsg) hasError = true;
    });

    setErrors(newErrors);
    setShowGeneralError(hasError);

    if (!hasError) {
      const formattedData: Partial<T> = { ...formData };
      fields.forEach((field) => {
        const val = formattedData[field.name as keyof T];
        if (
          typeof val === 'string' &&
          field.uppercase &&
          (field.type === 'text' || field.type === 'email')
        ) {
          formattedData[field.name as keyof T] = val.toUpperCase() as T[keyof T];
        }
      });
      await onSubmit(formattedData);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      noValidate
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white tracking-wide">
        {initialData ? 'Editar Registro' : 'Nuevo Registro'}
      </h2>

      <AnimatePresence>
        {showGeneralError && (
          <motion.div
            key="form-error"
            className="mb-4 p-4 rounded-md bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:text-red-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            Por favor corrige los campos marcados antes de continuar.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
        {fields.map((field, index) => {
          const value = formData[field.name as keyof T];
          const errorMsg = errors[field.name];

          if (typeof renderField === 'function') {
            const custom = renderField(field, value, errorMsg, handleCustomChange, loading, index);
            if (custom) return <React.Fragment key={field.name}>{custom}</React.Fragment>;
          }

          return (
            <motion.div key={field.name} custom={index} variants={fieldVariants}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' && field.options ? (
                <select
                  id={field.name}
                  name={field.name}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errorMsg ? 'border-red-500' : ''
                  }`}
                  value={(formData[field.name as keyof T] ?? '') as string | number}
                  onChange={handleChange}
                  required={field.required}
                  disabled={loading}
                >
                  <option value="">Seleccione...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errorMsg ? 'border-red-500' : ''
                  }`}
                  value={(formData[field.name as keyof T] as string) || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  disabled={loading}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  className={`mt-1 block w-full pl-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errorMsg ? 'border-red-500' : ''
                  }`}
                  value={
                    field.type === 'number'
                      ? formData[field.name as keyof T] !== null &&
                        formData[field.name as keyof T] !== undefined
                        ? String(formData[field.name as keyof T])
                        : ''
                      : (formData[field.name as keyof T] as string) || ''
                  }
                  onChange={handleChange}
                  onInput={(e) => handleInput(e, field)}
                  required={field.required}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  min={field.min}
                  max={field.max}
                  inputMode={field.type === 'number' ? 'numeric' : field.inputMode}
                  disabled={loading}
                />
              )}

              {errorMsg && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errorMsg}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors duration-150"
          disabled={loading}
        >
          {loading ? 'Procesando...' : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            {cancelButtonText}
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default Form;
