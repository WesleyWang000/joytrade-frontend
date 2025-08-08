import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function CartPage({ onSelectProduct }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      setError("Failed to load cart: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    try {
      await api.removeFromCart(productId);
      setCart(cart.filter((item) => item.product.id !== productId));
    } catch (err) {
      alert("Failed to remove: " + err.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!window.confirm("Place order for all items in cart?")) return;
    setPlacingOrder(true);
    try {
      const res = await api.placeCartOrder();
      alert(`Order placed for: ${res.ordered.join(", ")}`);
      fetchCart();
    } catch (err) {
      alert("Failed to place order: " + err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading cart...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  if (cart.length === 0) {
    return <p className="p-6 text-center text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => onSelectProduct(item.product.id)}
              >
                <div className="text-4xl">
                  {item.product.image?.startsWith("data:image") ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    item.product.image
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">￡{item.product.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="text-sm text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
        >
          {placingOrder ? "Placing Order..." : "Place Order for All"}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
