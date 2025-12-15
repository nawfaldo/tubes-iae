import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem("token");

  async function refreshCart() {
    try {
      const res = await fetch("http://localhost:3000/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  async function addToCart(menu_id, menu_name) {
    setAddingToCart(prev => ({ ...prev, [menu_id]: true }));
    try {
      await fetch("http://localhost:3000/cart/add-item", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id }),
      });
      refreshCart();
      setNotification({ type: "success", message: `${menu_name} ditambahkan ke keranjang!` });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({ type: "error", message: "Gagal menambahkan ke keranjang" });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [menu_id]: false }));
    }
  }

  async function removeFromCart(menu_id, menu_name) {
    try {
      await fetch("http://localhost:3000/cart/remove-item", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id }),
      });
      refreshCart();
      setNotification({ type: "success", message: `Jumlah ${menu_name} dikurangi` });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error removing from cart:", error);
      setNotification({ type: "error", message: "Gagal mengurangi jumlah" });
      setTimeout(() => setNotification(null), 3000);
    }
  }

  async function deleteItem(menu_id, menu_name) {
    try {
      await fetch("http://localhost:3000/cart/delete-item", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id }),
      });
      refreshCart();
      setNotification({ type: "success", message: `${menu_name} dihapus dari keranjang` });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({ type: "error", message: "Gagal menghapus item" });
      setTimeout(() => setNotification(null), 3000);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const resRest = await fetch(`http://localhost:3000/restaurants/${id}`);
        const dataRest = await resRest.json();
        setRestaurant(dataRest);

        const resMenu = await fetch(`http://localhost:3000/restaurants/${id}/menus`);
        const dataMenu = await resMenu.json();
        setMenus(dataMenu);

        refreshCart();
      } catch (error) {
        console.error("Error loading restaurant:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Restoran tidak ditemukan.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalInCart = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === "success" 
              ? "bg-green-500" 
              : "bg-red-500"
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
            <span>{notification.type === "success" ? "✓" : "✕"}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <button
              onClick={() => navigate("/")}
              className="mb-4 text-orange-100 hover:text-white transition flex items-center space-x-2 group"
            >
              <span className="group-hover:-translate-x-1 transition">←</span>
              <span>Kembali ke Dashboard</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-orange-100 text-lg">Pilih menu favorit Anda</p>
              </div>
              {totalInCart > 0 && (
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition flex items-center space-x-2"
                >
                  <span className="text-2xl">🛒</span>
                  <div className="text-left">
                    <div className="text-xs text-orange-100">Keranjang</div>
                    <div className="font-bold">{totalInCart} item</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Menu Restoran
            </h2>
            {menus.length > 0 && (
              <span className="text-gray-600 bg-gray-200 px-4 py-2 rounded-full text-sm font-medium">
                {menus.length} menu tersedia
              </span>
            )}
          </div>
          
          {menus.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Menu</h3>
              <p className="text-gray-600 mb-6">Restoran ini belum menambahkan menu.</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((m) => {
                const found = cartItems.find(ci => ci.menu_id === m.id);
                const qty = found?.qty || 0;
                const isAdding = addingToCart[m.id];

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100"
                  >
                    {/* Menu Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-orange-200 via-orange-100 to-red-200 flex items-center justify-center relative overflow-hidden">
                      <span className="text-6xl z-10">🍴</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                      {qty > 0 && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {qty}x
                        </div>
                      )}
                    </div>
                    
                    {/* Menu Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {m.name}
                      </h3>
                      {m.price ? (
                        <p className="text-orange-600 font-semibold text-lg mb-4">
                          Rp {m.price.toLocaleString('id-ID')}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm mb-4">Harga tidak tersedia</p>
                      )}
                      
                      {/* Cart Controls */}
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(m.id, m.name)}
                          disabled={isAdding}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isAdding ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Menambahkan...</span>
                            </>
                          ) : (
                            <>
                              <span>+</span>
                              <span>Tambah ke Keranjang</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200">
                            <button
                              onClick={() => removeFromCart(m.id, m.name)}
                              className="w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold flex items-center justify-center shadow-md hover:scale-110 active:scale-95"
                              title="Kurangi jumlah"
                            >
                              −
                            </button>
                            <div className="text-center">
                              <div className="font-bold text-gray-800 text-lg">{qty}</div>
                              <div className="text-xs text-gray-500">dalam keranjang</div>
                            </div>
                            <button
                              onClick={() => addToCart(m.id, m.name)}
                              disabled={isAdding}
                              className="w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold flex items-center justify-center shadow-md hover:scale-110 active:scale-95 disabled:opacity-50"
                              title="Tambah jumlah"
                            >
                              {isAdding ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "+"
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => deleteItem(m.id, m.name)}
                            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
                          >
                            <span>🗑️</span>
                            <span>Hapus dari Keranjang</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        {totalInCart > 0 && (
          <button
            onClick={() => navigate("/cart")}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition hover:scale-110 flex items-center space-x-3 z-40"
          >
            <span className="text-2xl">🛒</span>
            <div className="text-left">
              <div className="text-xs opacity-90">Lihat Keranjang</div>
              <div className="font-bold">{totalInCart} item</div>
            </div>
            <span className="text-xl">→</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
