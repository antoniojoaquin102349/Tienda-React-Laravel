import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchPurchases } from '../api/api';

const PurchaseHistory = () => {
  const { user } = useAppContext();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (user) fetchPurchases(user.token).then(setPurchases);
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Mis Compras</h2>
      {purchases.length === 0 ? (
        <p>No tienes compras.</p>
      ) : (
        purchases.map(p => (
          <div key={p.id} className="border p-2 rounded mb-2">
            <p>{p.date}</p>
            <p>Total: ${p.total}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchaseHistory;
