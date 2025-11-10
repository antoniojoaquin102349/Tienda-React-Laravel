const API_URL = "http://localhost:3000";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function fetchPurchases(token) {
  const res = await fetch(`${API_URL}/purchases`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
