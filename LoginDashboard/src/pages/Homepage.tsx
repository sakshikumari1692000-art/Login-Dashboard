import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">📚 BookStore</h1>
        <h2 className="text-xl text-gray-600 mt-2">
          Welcome, {user?.name}!
        </h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          You are logged in as <strong>{user?.email}</strong>
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Homepage;
