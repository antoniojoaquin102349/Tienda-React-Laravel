type Props = {
    value: string;
    type?: 'button' | 'submit' | 'reset';
};    

const Button = ({value, type}: Props) => {
    return (
        <button type= {type ?? 'button'} 
        className="w-full text-black bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">    
            {value}
        </button>
    )
}

export default Button;