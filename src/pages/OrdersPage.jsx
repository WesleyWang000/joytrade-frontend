import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function OrdersPage({ onSelectProduct }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading orders...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="p-6 text-center text-gray-500">No orders yet.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelectProduct(order.product.id)}
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl">
                {order.product.image?.startsWith("data:image") ? (
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  order.product.image
                )}
              </div>
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{order.product.name}</h3>
                <p className="text-gray-600">￡{order.product.price}</p>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
