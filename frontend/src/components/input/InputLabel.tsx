import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // <-- íconos bonitos y ligeros

type Props = {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  name: string;
  placeholder: string;
  id?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
};

const InputLabel = ({
  label,
  type = 'text',
  name,
  placeholder,
  id,
  error,
  onChange,
  value,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  // Si es password y queremos mostrarlo → cambiamos a "text"
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const isPasswordField = type === 'password';

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={id || name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value ?? ''}
          className={`bg-gray-50 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`} // ← pr-10 para dejar espacio al ojo
        />

        {/* Icono del ojo solo en campos password */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1} // evita que robe el foco al tabulador
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && <small className="text-red-500">{error}</small>}
    </div>
  );
};

export default InputLabel;