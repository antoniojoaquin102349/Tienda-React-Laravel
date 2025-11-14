import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../components/button/Button";
import {Api} from "../services/api";
import InputLabel from "../components/input/InputLabel";


const Register = () => {
    const initialValues = {
        name: 'Juan Perez',
        email: 'example@example.com',
        password: '',
        password_confirmation: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().min(3, "El nombre debe tener al menos 3 caracteres").required("El nombre es obligatorio"),
        email: Yup.string().email("Correo electrónico no es válido").required("El correo electrónico es obligatorio"),
        password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres")
            .max(50, "La contraseña no debe exceder los 50 caracteres").required("La contraseña es obligatoria"),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
            .required("La confirmación de la contraseña es obligatoria"),
    });
 
    const onsubmit = (values: typeof initialValues) => {  
        console.log(values);
        Api.post('/Auth/register', values).then(response => { 
            console.log(response); 
        });
    };
    return (    
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-center text-x1 font-bold leading-tight text-gray-900">Registarse</h1>
                        <Formik initialValues={initialValues} onSubmit={onsubmit} validationSchema={validationSchema}>
                            {({ errors, handleSubmit, handleChange, values}) => (
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <InputLabel label="nombre" id="name" type="text" name="name" placeholder="Nombre" 
                                        error={errors.name} onChange={handleChange} value={values.name}/>
                                    <InputLabel label="correo electrónico" id="email" type="email" name="email" placeholder="name@company.com" 
                                        error={errors.email} onChange={handleChange} value={values.email} />
                                    <InputLabel label="contraseña" id="password" type="password" name="password" placeholder="*********" 
                                    error={errors.password} onChange={handleChange} value={values.password} /> 
                                    <InputLabel label="confirmar contraseña" id="confirmPassword" type="password" name="confirmPassword" placeholder="*********" 
                                        error={errors.password_confirmation} onChange={handleChange} value={values.password_confirmation} /> 
                                    <Button value="Registrarse" type="submit" />
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        ¿Ya tienes una cuenta? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Iniciar sesión</a>
                                    </p>     
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>                     
            </div>           
        </section>
    )
}
export default Register;