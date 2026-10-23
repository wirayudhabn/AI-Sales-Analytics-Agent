import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  OrderHistorySection,
  type Order,
} from "../../components/orders/OrderHistorySection";

const initialOrders: Order[] = [
  {
    orderNumber: "ORD742",
    date: "03/01/2026",
    product: "Indomie Goreng",
    category: "Makanan",
    quantity: 3,
    price: 3500,
  },
  {
    orderNumber: "ORD318",
    date: "17/01/2026",
    product: "Aqua 600 ml",
    category: "Minuman",
    quantity: 6,
    price: 4000,
  },
  {
    orderNumber: "ORD905",
    date: "29/01/2026",
    product: "Kopiko",
    category: "Makanan",
    quantity: 12,
    price: 1500,
  },
  {
    orderNumber: "ORD467",
    date: "08/02/2026",
    product: "Tolak Angin",
    category: "Kesehatan",
    quantity: 5,
    price: 4500,
  },
  {
    orderNumber: "ORD821",
    date: "21/02/2026",
    product: "SilverQueen",
    category: "Makanan",
    quantity: 2,
    price: 18000,
  },
  {
    orderNumber: "ORD256",
    date: "05/03/2026",
    product: "Sari Roti",
    category: "Makanan",
    quantity: 4,
    price: 16000,
  },
  {
    orderNumber: "ORD693",
    date: "14/03/2026",
    product: "Kapal Api",
    category: "Minuman",
    quantity: 3,
    price: 13000,
  },
  {
    orderNumber: "ORD184",
    date: "27/03/2026",
    product: "Wardah Lip Cream",
    category: "Kecantikan",
    quantity: 2,
    price: 69000,
  },
  {
    orderNumber: "ORD530",
    date: "09/04/2026",
    product: "Eiger Waist Bag",
    category: "Aksesori",
    quantity: 1,
    price: 179000,
  },
  {
    orderNumber: "ORD377",
    date: "22/04/2026",
    product: "Beng-Beng",
    category: "Makanan",
    quantity: 10,
    price: 2500,
  },
];

export const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  return (
    <OrderHistorySection
      orders={orders}
      searchQuery={searchQuery}
      onAddOrder={(order) => setOrders((currentOrders) => [order, ...currentOrders])}
    />
  );
};
