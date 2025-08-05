import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
//import { api } from "../api/mockApi";
import { api } from "./api/realApi";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import PostProductPage from "./pages/PostProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import EditProductPage from "./pages/EditProductPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatProductId, setChatProductId] = useState(null);
  const [chatReceiver, setChatReceiver] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
        } catch {
          localStorage.removeItem("token");
        }
      }
    };
    init();
  }, []);

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setCurrentPage("product");
  };

  const renderPage = () => {
    if (currentPage === "home") {
      return <HomePage onSelectProduct={handleSelectProduct} />;
    }
    if (currentPage === "product") {
      return (
        <ProductDetailPage
          productId={selectedProductId}
          onBack={() => setCurrentPage("home")}
          onStartChat={(productId, seller) => {
            setChatProductId(productId);
            setChatReceiver(seller);
            setCurrentPage("chatDirect");
          }}
          currentUser={currentUser}
        />
      );
    }
    if (currentPage === "favorites") {
      return <FavoritesPage onSelectProduct={handleSelectProduct} />;
    }
    if (currentPage === "orders") {
      return <OrdersPage onSelectProduct={handleSelectProduct} />;
    }
    if (currentPage === "login") {
      return (
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentPage("home");
          }}
          onGoRegister={() => setCurrentPage("register")}
        />
      );
    }

    if (currentPage === "chat") {
      return (
        <ChatPage
          currentUser={currentUser}
          onBack={() => setCurrentPage("home")}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage("product");
          }}
        />
      );
    }

    if (currentPage === "post") {
      return (
        <PostProductPage
          onPosted={() => setCurrentPage("home")}
          currentUser={currentUser}
        />
      );
    }

    if (currentPage === "chatDirect") {
      return (
        <ChatPage
          currentUser={currentUser}
          productId={chatProductId}
          receiver={chatReceiver}
          onBack={() => setCurrentPage("home")}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage("product");
          }}
        />
      );
    }
    if (currentPage === "profile") {
      return (
        <ProfilePage
          currentUser={currentUser}
          onLoginSuccess={(user) => setCurrentUser(user)}
          onBack={() => setCurrentPage("home")}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage("product");
          }}
        />
      );
    }

    if (currentPage === "register") {
      return (
        <RegisterPage
          onRegisterSuccess={(user) => {
            setCurrentUser(user);
            setCurrentPage("home");
          }}
          onBack={() => setCurrentPage("login")}
        />
      );
    }

    if (currentPage === "edit") {
      return (
        <EditProductPage
          productId={editingProductId}
          onBack={() => setCurrentPage("profile")}
        />
      );
    }

    return <div className="p-6">Page not found.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer text-indigo-600"
          onClick={() => setCurrentPage("home")}
        >
          JoyTrade
        </h1>
        <nav>
          {currentUser && (
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 text-sm mx-2 py-2 px-4 rounded"
              onClick={() => setCurrentPage("post")}
            >
              Post Product
            </button>
          )}

          <button
            className="text-sm text-gray-700 hover:text-indigo-600 mx-2"
            onClick={() => setCurrentPage("home")}
          >
            Home
          </button>
          <button
            className="text-sm text-gray-700 hover:text-indigo-600 mx-2"
            onClick={() => setCurrentPage("favorites")}
          >
            My Favorites
          </button>
          {currentUser && (
            <button
              className="text-sm text-gray-700 hover:text-indigo-600 mx-2"
              onClick={() => setCurrentPage("chat")}
            >
              Chat
            </button>
          )}
          <button
            className="text-sm text-gray-700 hover:text-indigo-600 mx-2"
            onClick={() => setCurrentPage("orders")}
          >
            Orders
          </button>

          {currentUser && (
            <button
              className="text-sm text-gray-700 hover:text-indigo-600 mx-2"
              onClick={() => setCurrentPage("profile")}
            >
              profile
            </button>
          )}

          {currentUser ? (
            <>
              <button
                className="text-sm text-red-500 hover:text-red-600 mx-2"
                onClick={() => {
                  api.logout();
                  setCurrentUser(null);
                  setCurrentPage("login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="text-sm text-blue-600 hover:text-blue-800 mx-2"
              onClick={() => setCurrentPage("login")}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main className="p-4">{renderPage()}</main>

      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 JoyTrade Campus Marketplace. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
