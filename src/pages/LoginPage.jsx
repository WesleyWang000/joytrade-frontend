import { useState } from "react";
//import { api } from "../api/mockApi";
import { api } from "../api/realApi";

function LoginPage({ onLoginSuccess, onGoRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.login({ username, password });
      localStorage.setItem("token", res.access); //存储 access token

      const user = await api.getCurrentUser(); //使用 token 获取用户信息
      onLoginSuccess(user);
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
      )}

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Username</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Password</label>
        <input
          className="w-full border px-3 py-2 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Don’t have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={onGoRegister}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
