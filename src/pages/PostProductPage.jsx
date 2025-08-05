import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function PostProductPage({ onPosted, currentUser }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [tradeMethod, setTradeMethod] = useState("delivery");
  const [categories, setCategories] = useState([]);

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-red-500">
        You must <strong>login</strong> to post a product.
      </div>
    );
  }

  //获取分类列表
  useEffect(() => {
    api
      .getCategories()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories(["Electronics", "Books", "Other"]); 
      });
  }, []);

  const handleSubmit = async () => {
    if (!name || !price || !description || !category) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imageRes = await api.uploadProductImage(formData);
        imageUrl = imageRes.image;
      }

      const newProduct = {
        name,
        price: parseFloat(price),
        image: imageUrl || "🆕", 
        description,
        category,
        trade_method: tradeMethod,
      };

      await api.postProduct(newProduct);
      alert("Product posted!");
      onPosted();
    } catch (err) {
      alert(err.message || "Failed to post product");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Post New Product</h2>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Product Name</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Price (£)</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Category</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">
          Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-1">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Delivery Method
        </label>
        <select
          className="border p-2 rounded w-full"
          value={tradeMethod}
          onChange={(e) => setTradeMethod(e.target.value)}
        >
          <option value="delivery">Delivery</option>
          <option value="meetup">Meet Up</option>
        </select>
      </div>

      <button
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        onClick={handleSubmit}
      >
        Post Product
      </button>
    </div>
  );
}

export default PostProductPage;
