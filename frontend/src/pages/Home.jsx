import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function Home() {
  const name = localStorage.getItem("name");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/restaurants");
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error loading restaurants:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Selamat Datang, {name}! 👋
          </h1>
          <p className="text-orange-100 text-lg">
            Temukan restoran favorit Anda dan pesan makanan lezat sekarang
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-orange-50"
          >
            <div className="text-3xl">🛒</div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Keranjang</div>
              <div className="text-sm text-gray-600">Lihat pesanan Anda</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/invoice")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-green-50"
          >
            <div className="text-3xl">📄</div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Invoice</div>
              <div className="text-sm text-gray-600">Riwayat pesanan</div>
            </div>
          </button>
        </div>

        {/* Restaurants Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Restoran Tersedia
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Memuat restoran...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">Belum ada restoran tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition">
                      🍽️
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                      {r.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Klik untuk melihat menu
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold">
                      Lihat Menu
                      <span className="ml-2 group-hover:translate-x-1 transition">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
