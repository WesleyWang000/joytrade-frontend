import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function HomePage({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productData, categoryData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        if (isMounted) {
          setProducts(productData);
          setCategories(["All", ...categoryData.filter((c) => c !== "All")]);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load. Please try again: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  let filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchKeyword =
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });

  if (sortOrder === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          className="w-full border px-4 py-2 rounded shadow-sm"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="default">Default</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full border ${
              selectedCategory === cat
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600">No matching products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => onSelectProduct(product.id)}
            >
              <div className="flex justify-center mb-2">
                {product.image?.startsWith("data:image") ? (
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
      )}
    </div>
  );
}

export default HomePage;
