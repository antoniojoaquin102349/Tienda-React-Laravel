import MensajeModal from "../components/MensajeModal";
import type { DatosUsuario } from "../types";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import type { RootState } from "../store";


const Datos = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = localStorage.getItem("token");

    const userId = user?.id;

    const [datos, setDatos] = useState<DatosUsuario | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitulo, setModalTitulo] = useState("");
    const [modalMensaje, setModalMensaje] = useState("");


    useEffect(() => {
        if (!userId || !token) return;

        fetch(`http://127.0.0.1:8000/api/usuarios/datos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) setDatos(data.datos);
                else console.error(data.message);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!datos) return;
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    };

    const handleSave = async () => {
        if (!datos || !userId) return;
        setSaving(true);


        try {  
            const res = await fetch(`http://127.0.0.1:8000/api/usuarios/datos`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
        });  

        if (!res.ok) throw new Error("Error al guardar los datos");  

        setEditMode(false);  
        // Mostrar modal de éxito
            setModalTitulo("¡Éxito!");
            setModalMensaje("Datos guardados correctamente."); 
            setModalOpen(true);
        } catch (err: unknown) {
            let mensajeError = "Error al guardar los datos";

            if (err instanceof Error) {
                mensajeError = err.message;
            }

            setModalTitulo("Error");
            setModalMensaje(mensajeError);
            setModalOpen(true);
        } finally {  
            setSaving(false);  
        }  

    };

    if (loading) return <div>Cargando...</div>;
    if (!datos) return <div>No se encontraron datos</div>;

    return ( 
        <div>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"> 
                
                {/* HEADER fijo */}
                <div className="fixed top-0 left-0 w-full z-50">
                    <Header />
                </div>

                <h1 className="text-2xl font-bold mt-1
                0 mb-6">Mis Datos</h1>


                <div className="grid grid-cols-1 gap-4">  
                    <label className="flex flex-col">  
                    Teléfono  
                    <input  
                        type="text"  
                        name="telefono"  
                        value={datos.telefono || ""}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Dirección  
                    <textarea  
                        name="direccion"  
                        value={datos.direccion}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Ciudad  
                    <input  
                        type="text"  
                        name="ciudad"  
                        value={datos.ciudad}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Código Postal  
                    <input  
                        type="text"  
                        name="codigo_postal"  
                        value={datos.codigo_postal}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <h2 className="font-semibold mt-4">Método de Pago</h2>  
                    <label className="flex flex-col">  
                    Número de Tarjeta  
                    <input  
                        type="text"  
                        name="numero_tarjeta"  
                        value={datos.numero_tarjeta || ""}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Nombre en la Tarjeta  
                    <input  
                        type="text"  
                        name="nombre_tarjeta"  
                        value={datos.nombre_tarjeta || ""}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Código de Seguridad  
                    <input  
                        type="text"  
                        name="numero_seguridad"  
                        value={datos.numero_seguridad || ""}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  

                    <label className="flex flex-col">  
                    Fecha de Vencimiento  
                    <input  
                        type="text"  
                        name="fecha_vencimiento"  
                        value={datos.fecha_vencimiento || ""}  
                        onChange={handleChange}  
                        disabled={!editMode}  
                        placeholder="MM/AA"  
                        className="border px-3 py-2 rounded mt-1"  
                    />  
                    </label>  
                </div>  

                <div className="mt-6 flex gap-4">  
                    {!editMode && (  
                    <button  
                        onClick={() => setEditMode(true)}  
                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-600 transition"  
                    >  
                        Editar  
                    </button>  
                    )}  

                    {editMode && (  
                    <>  
                        <button  
                        onClick={handleSave}  
                        disabled={saving}  
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"  
                        >  
                        {saving ? "Guardando..." : "Guardar"}  
                        </button>  
                        <button  
                        onClick={() => setEditMode(false)}  
                        className="px-4 py-2 bg-gray-300 text-black font-bold rounded hover:bg-gray-400 transition"  
                        >  
                        Cancelar  
                        </button>  
                    </>  
                    )}  
                </div>      
            </div>  
            {/* FOOTER */}
            <Footer/>  

            <MensajeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                titulo={modalTitulo}
                mensaje={modalMensaje}
                mostrarBotones={false}
                autoCerrarMs={2500}
            />
        </div>    
    );
};

export default Datos;
