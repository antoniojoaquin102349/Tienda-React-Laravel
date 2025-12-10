type Props = {
    value: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean; // ✅ AÑADIR ESTA PROP
};    

const Button = ({ value, type, disabled = false }: Props) => {
    return (
        <button
            type={type ?? 'button'}
            disabled={disabled} // ✅ PASARLO AL BUTTON
            className="w-full text-black bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                       disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed
                       dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >    
            {value}
        </button>
    );
};

export default Button;
