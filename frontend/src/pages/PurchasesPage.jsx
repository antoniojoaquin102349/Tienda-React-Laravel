import { useApp } from "../context/AppContext";

export default function PurchasesPage() {
  const { purchases, user, loading } = useApp();

  if (loading) return <p className="text-center py-16">Cargando...</p>;
  if (!user) return <p className="text-center py-16">Debes iniciar sesión</p>;
  if (purchases.length === 0)
    return <p className="text-center py-16">No tienes compras aún</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis compras</h1>
      {purchases.map((p) => (
        <div key={p.id} className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">
              Compra del {new Date(p.date).toLocaleDateString("es-ES")}
            </span>
            <span className="text-xl font-bold">${p.total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {p.items.map((item) => (
              <div key={item.id} className="text-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-20 h-20 object-contain mx-auto"
                />
                <p className="text-sm mt-2">
                  {item.quantity}× {item.title.substring(0, 20)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}