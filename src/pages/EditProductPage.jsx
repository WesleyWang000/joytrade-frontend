import { useEffect, useState, useRef } from "react";
import { api } from "../api/realApi";

function EditProductPage({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    trade_method: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const fileInputRef = useRef();

  // 加载商品信息和分类列表
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prod, cats] = await Promise.all([
          api.getProductById(productId),
          api.getCategories(),
        ]);
        setProduct(prod);
        setCategories(cats);
        setForm({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          category: prod.category,
          trade_method: prod.trade_method,
          status: prod.status,
        });
      } catch (err) {
        alert("Fail to load" + err.message);
      }
    };
    loadData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("trade_method", form.trade_method);
    formData.append("status", form.status);

    if (newImageFile) {
      formData.append("image", newImageFile); 
    }

    try {
      await api.editProduct(productId, formData, true); 
      alert("update successfully!");
      onBack();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      {/* 图片预览 */}
      <div className="mb-4">
        <p className="font-medium mb-1">Current Image</p>
        {product.image?.startsWith("data:") ||
        product.image?.startsWith("http") ? (
          <img
            src={
              newImageFile ? URL.createObjectURL(newImageFile) : product.image
            }
            alt="Product"
            className="w-32 h-32 object-cover rounded border"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded text-2xl">
            {product.image}
          </div>
        )}
      </div>

      {/* 图片上传按钮 */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
      </div>

      <label className="block mb-2 font-medium">Product Name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-2 font-medium">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-2 font-medium">Price</label>
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-2 font-medium">Category</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Delivery Method</label>
      <select
        name="trade_method"
        value={form.trade_method}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="delivery">Delivery</option>
        <option value="meetup">Meet Up</option>
      </select>

      <label className="block mb-2 font-medium">Status</label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="available">available</option>
        <option value="sold">sold</option>
        <option value="inactive">inactive</option>
      </select>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditProductPage;
