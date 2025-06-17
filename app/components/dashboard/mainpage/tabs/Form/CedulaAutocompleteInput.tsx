import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  required?: boolean;
  maxLength?: number;
  tables?: Array<'cliente' | 'personal'>;
}

const CedulaAutocompleteInput: React.FC<Props> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled,
  error,
  required,
  maxLength,
  tables = ['cliente', 'personal'],
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const cedulasSet = new Set<string>();

      for (const table of tables) {
        let field = table === 'personal' ? 'cedula' : 'doc_ident';
        const { data, error } = await supabase
          .from(table)
          .select(field)
          .ilike(field, `${value}%`)
          .limit(5);

        if (!error && data) {
          data.forEach((row: any) => row[field] && cedulasSet.add(row[field]));
        }
      }

      const arr = Array.from(cedulasSet);
      setSuggestions(arr);

      // Si el valor coincide exactamente con una sugerencia, no mostrar la lista
      if (arr.includes(value)) {
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
      }
    };

    fetchSuggestions();
  }, [value, tables]);

  const handleSelect = (cedula: string) => {
    onChange(cedula);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    // Solo muestra sugerencias si hay al menos 2 caracteres y el valor no coincide exactamente con una sugerencia
    if (value.length >= 2 && !suggestions.includes(value)) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        className={`mt-1 block w-full pl-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500' : ''
        }`}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full mt-1 rounded shadow"
          style={{ maxHeight: 160, overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0 }}
        >
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-3 py-2 hover:bg-cyan-100 dark:hover:bg-cyan-900 cursor-pointer"
              onMouseDown={e => {
                e.preventDefault();
                handleSelect(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CedulaAutocompleteInput;