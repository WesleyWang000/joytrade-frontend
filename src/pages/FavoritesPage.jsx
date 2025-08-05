import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function FavoritesPage({ onSelectProduct }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    api
      .getFavorites()
      .then(setFavorites)
      .catch((err) => {
        console.error("Failed to load favorites:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  }

  if (favorites.length === 0) {
    return (
      <p className="p-6 text-center text-gray-500">
        You have no favorite items.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelectProduct(product.id)}
          >
            <div className="flex justify-center mb-2">
              {product.image.startsWith("data:image") ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="text-5xl">{product.image}</div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-center mt-2">
              {product.name}
            </h3>
            <p className="text-center text-gray-600">￡{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
