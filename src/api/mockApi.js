
export const CATEGORIES = ["All", "Electronics", "Clothing", "Sports", "Books"];

// 模拟数据库
const MOCK_DB = {
  products: [
    { id: 1, name: "Bike", price: 120, image: "🚲", description: "A cool bike", category: "Sports", seller: "user" },
    { id: 2, name: "Laptop", price: 999, image: "💻", description: "Powerful laptop", category: "Electronics", seller: "user" },
    { id: 3, name: "Backpack", price: 30, image: "🎒", description: "Useful backpack", category: "Clothing", seller: "user" },
  ],
  favoritesByUser: {
    // username: [productId, ...]
  },
  orders: {
    // username: [{ id, productId }]
  },
  messages: [],
  users: [
    { username: "user", password: "123", id: 1, email: "user@outlook.com", avatar: "", vacation: false}
  ],
  currentUser: null,
};

// 模拟延时
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟 API 方法
export const api = {
  

getProducts: async () => {
  await delay(300);
  const vacationUsers = MOCK_DB.users
    .filter((u) => u.vacation)
    .map((u) => u.username);

  return MOCK_DB.products.filter(
    (p) => !vacationUsers.includes(p.seller) && p.status === "available"
  );
},


  getProductById: async (id) => {
    await delay(300);
    return MOCK_DB.products.find((p) => p.id === Number(id));
  },


  login: async (username, password) => {
    await delay(300);
    const user = MOCK_DB.users.find(u => u.username === username && u.password === password);
    if (user) {
      MOCK_DB.currentUser = user;
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  },

  getCurrentUser: () => MOCK_DB.currentUser,

  logout: () => {
    MOCK_DB.currentUser = null;
  },

  toggleFavorite: async (productId) => {
  await delay(300);
  const username = MOCK_DB.currentUser?.username;
  if (!username) return [];

  if (!MOCK_DB.favoritesByUser[username]) {
    MOCK_DB.favoritesByUser[username] = [];
  }

  const favorites = MOCK_DB.favoritesByUser[username];
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }

  return favorites;
},


  getFavorites: async () => {
  await delay(300);
  const username = MOCK_DB.currentUser?.username;
  if (!username) return [];

  const ids = MOCK_DB.favoritesByUser[username] || [];
  return ids.map(id => MOCK_DB.products.find(p => p.id === id));
},


  placeOrder: async (productId) => {
    await delay(300);
    const username = MOCK_DB.currentUser?.username;
    if (!username) return;

    if (!MOCK_DB.orders[username]) {
      MOCK_DB.orders[username] = [];
    }

    MOCK_DB.orders[username].push({
      id: Date.now(),
      productId,
    });

    return MOCK_DB.orders[username];
  },

  getOrders: async (username) => {
    await delay(300);
    return (MOCK_DB.orders[username] || []).map((o) => {
      const p = MOCK_DB.products.find((x) => x.id === o.productId);
      return {
        productId: p.id,
        productName: p.name,
        price: p.price,
      };
    });
  },

postProduct: async (product) => {
  await delay(300);
  const newProduct = {
    id: Date.now(),
    ...product,
    seller: MOCK_DB.currentUser?.username || "unknown",
    deliveryMethod: product.deliveryMethod || "面交",
    createdAt: new Date().toLocaleString(),  // ✅ 添加发布时间
    status: "available",                    // ✅ 默认状态
  };
  MOCK_DB.products.push(newProduct);
  return newProduct;
},

updateProductStatus: async (productId, newStatus) => {
  await delay(200);
  const product = MOCK_DB.products.find(p => p.id === productId);
  if (product) {
    product.status = newStatus;
  }
  return product;
},


  getMyProducts: async (username) => {
    await delay(200);
    return MOCK_DB.products.filter((p) => p.seller === username);
  },

  sendMessage: async (productId, message, sender, receiver) => {
    await delay(200);
    MOCK_DB.messages.push({
      id: Date.now(),
      productId,
      message,
      sender,
      receiver,
      time: new Date().toLocaleTimeString(),
    });
  },

  getMessages: async (productId) => {
    await delay(200);
    return MOCK_DB.messages.filter(m => m.productId === productId);
  },

  getMessagesGroupedByProduct: async (username) => {
    await delay(200);
    const userMsgs = MOCK_DB.messages.filter(
      (m) => m.sender === username || m.receiver === username
    );
    const productMap = {};

    userMsgs.forEach((msg) => {
      const product = MOCK_DB.products.find((p) => p.id === msg.productId);
      if (!productMap[msg.productId]) {
        const otherUser =
          msg.sender === username ? msg.receiver : msg.sender;

        productMap[msg.productId] = {
          productId: product.id,
          productName: product.name,
          otherUser,
        };
      }
    });

    return Object.values(productMap);
  },

  register: async (username, password, email) => {
    await delay(300);
    const exists = MOCK_DB.users.some((u) => u.username === username);
    if (exists) {
        throw new Error("Username already exists");
    }
    const newUser = {
        id: Date.now(),
        username,
        password,
        email,
    };
    MOCK_DB.users.push(newUser);
    MOCK_DB.currentUser = newUser; // 自动登录
    return newUser;
  },

  toggleVacationMode: async (username) => {
    await delay(200);
    const user = MOCK_DB.users.find((u) => u.username === username);
    if (user) {
      user.vacation = !user.vacation;
      return user.vacation;
    }
  },

  getUserByUsername: async (username) => {
    await delay(200);
    return MOCK_DB.users.find((u) => u.username === username);
  },

  updateUserAvatar: async (username, avatarDataUrl) => {
    await delay(200);
    const user = MOCK_DB.users.find(u => u.username === username);
    if (user) {
      user.avatar = avatarDataUrl;
      return true;
    }
    return false;
  },


};
