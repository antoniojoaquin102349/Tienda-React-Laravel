import React from 'react';
type Props = {
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date';
    name: string;
    placeholder: string;
    id?: string;
    error?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | number;
}
const InputLabel = ({label, type, name, placeholder, id, error, onChange, value}: Props) => {
    return (
        <div>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <input type={type ?? 'text'} id={id} name={name} placeholder={placeholder} onChange={onChange} value={value}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
            {error && <small className="text-red-500">{error}</small>}    
        </div>
    )
}

export default InputLabel