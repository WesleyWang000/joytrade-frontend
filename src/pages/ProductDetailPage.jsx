import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function ProductDetailPage({ productId, onBack, onStartChat, currentUser }) {
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await api.getProductById(productId);
        setProduct(result);

        if (currentUser) {
          const favs = await api.getFavorites();
          setIsFavorite(favs.some((p) => p.id === productId));
        }
      } catch (err) {
        setError("Fail to load: " + err.message);
      }
    };

    fetchProduct();
  }, [productId, currentUser]);

  const toggleFavorite = async () => {
    try {
      const res = await api.toggleFavorite(productId);
      setIsFavorite(res.favorited);
    } catch (err) {
      alert("Operation failed: " + err.message);
    }
  };

  const placeOrder = async () => {
    try {
      await api.placeOrder(productId);
      alert("Order placed!");
    } catch (err) {
      alert("Order placement failed: " + err.message);
    }
  };

  const addToCart = async () => {
    try {
      await api.addToCart(productId);
      alert("Added to cart");
    } catch (err) {
      alert("Add to cart failed: " + err.message);
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-center mb-4">
        {product.image?.startsWith("data:image") ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-32 object-cover rounded"
          />
        ) : (
          <div className="text-6xl">{product.image}</div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-center">{product.name}</h2>
      <p className="text-gray-600 text-center mb-4">{product.description}</p>
      <p className="text-center text-lg font-semibold mb-6">
        ￡{product.price}
      </p>
      <p className="text-center text-gray-500 mb-2">
        Delivery Method: {product.trade_method}
      </p>
      <p className="text-center text-sm text-gray-500">
        Seller: {product.seller.username}
      </p>
      <p className="text-center text-sm text-gray-500">
        Published on: {new Date(product.created_at).toLocaleString()}
      </p>
      <p className="text-center text-sm text-gray-600 mb-2">
        Status: {product.status}
      </p>
      <p className="text-center text-sm text-gray-500 mb-1">
        Category: {product.category}
      </p>

      <div className="flex justify-center flex-col items-center gap-2 mt-4">
        {currentUser ? (
          currentUser.id === product.seller.id ? (
            <>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => setShowStatusSelect(!showStatusSelect)}
              >
                Update Product Status
              </button>

              {showStatusSelect && (
                <select
                  className="border rounded p-2 mt-2"
                  value={product.status}
                  onChange={async (e) => {
                    const updated = await api.updateProductStatus(product.id, {
                      status: e.target.value,
                    });
                    setProduct({ ...product, status: updated.status });
                    setShowStatusSelect(false);
                  }}
                >
                  <option value="available">available</option>
                  <option value="sold">sold</option>
                  <option value="inactive">inactive</option>
                </select>
              )}
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                onClick={toggleFavorite}
              >
                {isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={placeOrder}
              >
                Buy Now
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => onStartChat(product.id, product.seller)}
              >
                Chat
              </button>

              <button
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={addToCart}
              >
                Add to Cart
              </button>

            </>
          )
        ) : (
          <p className="text-center text-sm text-red-500">
            Please <strong>login</strong> to favorite, chat or buy.
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
