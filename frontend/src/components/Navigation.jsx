import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  }

  if (!token) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold hover:text-orange-200 transition">
              🍽️ FoodApp
            </Link>
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/cart" 
                className="px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium"
              >
                Keranjang
              </Link>
              <Link 
                to="/invoice" 
                className="px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium"
              >
                Invoice
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-orange-100">Selamat datang, <span className="font-semibold">{name}</span></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition font-medium shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

