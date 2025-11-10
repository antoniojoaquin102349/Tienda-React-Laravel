export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Purchase {
  id: string | number;
  date: string;
  items: CartItem[];
  total: number;
}