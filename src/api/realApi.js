const API_BASE = "http://localhost:8000/api";

// 获取 JWT token
function getToken() {
  return localStorage.getItem("token");
}

// 获取鉴权头
function getAuthHeaders(isForm = false) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// 通用请求函数
async function request(path, method = "GET", data = null, isForm = false) {
  const headers = getAuthHeaders(isForm);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: data ? (isForm ? data : JSON.stringify(data)) : null,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const errData = await res.json();
      if (errData.detail) {
        message = errData.detail;
      } else {
        const firstKey = Object.keys(errData)[0];
        if (Array.isArray(errData[firstKey])) {
          message = errData[firstKey][0];
        } else {
          message = JSON.stringify(errData);
        }
      }
    } catch (e) {
      message = await res.text(); 
    }
    throw new Error(message);
  }

  return res.status !== 204 ? res.json() : null;
}


export const api = {
  // 用户注册和登录
  register: (data) => request("/auth/register/", "POST", data),
  login: (data) => request("/auth/login/", "POST", data),
  getCurrentUser: () => request("/auth/me/"),
  logout: () => {localStorage.removeItem("token");},


  // 头像与度假模式
  uploadAvatar: (formData) => request("/auth/upload-avatar/", "POST", formData, true),
  toggleVacation: () => request("/auth/toggle-vacation/", "POST"),

  // 商品相关
  getProducts: () => request("/products/"),
  getProductById: (id) => request(`/products/${id}/`),
  postProduct: (data) => request("/products/create/", "POST", data),
  updateProductStatus: (id, data) => request(`/products/${id}/status/`, "POST", data),
  getMyProducts: () => request("/products/mine/"),
  getCategories: () => request("/categories/"),
  uploadProductImage: (formData) => request("/products/upload-image/", "POST", formData, true),
  deleteProduct: (id) => request(`/products/${id}/delete/`, "DELETE"),


  // 收藏相关
  toggleFavorite: (productId) => request(`/favorites/toggle/`, "POST", { product_id: productId }),
  getFavorites: () => request("/favorites/"),

  // 订单相关
  placeOrder: (productId) => request("/orders/place/", "POST", { product_id: productId }),
  getOrders: () => request("/orders/"),

  // 聊天系统
  sendMessage: (data) => request("/chat/send/", "POST", data),
  getMessages: (productId) => request(`/chat/messages/${productId}/`),
  getChatList: () => request("/chat/conversations/"),
};
