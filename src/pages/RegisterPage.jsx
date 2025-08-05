import { useState } from "react";
//import { api } from "../api/mockApi";
import { api } from "../api/realApi";

function RegisterPage({ onRegisterSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.register({
        username,
        password,
        email,
        is_seller: false,
      });
      localStorage.setItem("token", res.token); 
      onRegisterSuccess(res.user); 
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-4 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
        onClick={handleRegister}
      >
        Register
      </button>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <button className="text-blue-600 hover:underline" onClick={onBack}>
          Login
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;
