import { useEffect, useState, useRef } from "react";
import { api } from "../api/realApi";

function ProfilePage({ currentUser, onBack, onSelectProduct, onLoginSuccess }) {
  const [myProducts, setMyProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vacation, setVacation] = useState(false);
  const fileInputRef = useRef();

  // 上传头像处理
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const user = await api.uploadAvatar(formData);
      onLoginSuccess(user); 
    } catch (err) {
      alert(err.message);
    }
  };

  // 切换度假模式
  const toggleVacation = async () => {
    try {
      const result = await api.toggleVacation();
      setVacation(result.vacation);
      alert(result.vacation ? "Vacation mode ON" : "Vacation mode OFF");
      const updated = await api.getCurrentUser();
      onLoginSuccess(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.deleteProduct(id);
      setMyProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted.");
    } catch (err) {
      alert("Fail to delete: " + err.message);
    }
  };

  // 加载我的数据
  useEffect(() => {
    if (!currentUser) return;
    api.getMyProducts().then(setMyProducts).catch(console.error);
    api.getFavorites().then(setFavorites).catch(console.error);
    api.getOrders().then(setOrders).catch(console.error);
    api.getCurrentUser().then((user) => setVacation(user?.vacation ?? false));
  }, [currentUser]);

  return (
    <div className="p-6">
      {/* 用户信息卡 */}
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {currentUser.avatar?.startsWith("data:image") ||
          currentUser.avatar?.startsWith("http") ? (
            <img
              src={currentUser.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-semibold shadow">
              {currentUser.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentUser.username}
            </h2>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>
        </div>

        {/* 度假模式切换 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">Vacation Mode</span>
          <button
            onClick={toggleVacation}
            className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
              vacation ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-0 top-0 h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                vacation ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 上传头像 */}
        <div className="mt-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            Upload Avatar
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 我的商品 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">My Posted Products</h3>
        {myProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No products posted yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {myProducts.map((p) => (
              <li key={p.id} className="p-3 border rounded hover:bg-gray-50">
                <div
                  onClick={() => onSelectProduct(p.id)}
                  className="cursor-pointer"
                >
                  <img
                    src={
                      p.image?.startsWith("http") ||
                      p.image?.startsWith("data:")
                        ? p.image
                        : `http://localhost:8000${p.image}`
                    }
                    alt="product"
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">￡{p.price}</div>
                </div>

                {/* 删除按钮区域 */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 我的收藏 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">My Favorites</h3>
        {favorites.length === 0 ? (
          <p className="text-sm text-gray-500">No favorite items yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {favorites.map((p) => (
              <li
                key={p.id}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectProduct(p.id)}
              >
                {p.image?.startsWith("data:") || p.image?.startsWith("http") ? (
                  <img
                    src={p.image}
                    alt="product"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="text-2xl">{p.image}</div>
                )}
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">￡{p.price}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 我的订单 */}
      <section>
        <h3 className="text-lg font-semibold mb-2">My Orders</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders placed.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li
                key={o.id}
                className="border rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectProduct(o.product.id)}
              >
                <div>{o.product.name}</div>
                <div className="text-sm text-gray-500">￡{o.product.price}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        className="mt-6 text-sm text-blue-600 hover:underline"
        onClick={onBack}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default ProfilePage;
