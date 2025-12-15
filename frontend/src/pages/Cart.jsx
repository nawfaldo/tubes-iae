import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function loadCart() {
    try {
      const res = await fetch("http://localhost:3000/cart/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(menu_id) {
    try {
      await fetch("http://localhost:3000/cart/add-item", {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id })
      });
      loadCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  async function removeFromCart(menu_id) {
    try {
      await fetch("http://localhost:3000/cart/remove-item", {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id })
      });
      loadCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  }

  async function deleteItem(menu_id) {
    try {
      await fetch("http://localhost:3000/cart/delete-item", {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ menu_id })
      });
      loadCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  async function checkout() {
    setCheckingOut(true);
    try {
      const res = await fetch("http://localhost:3000/cart/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        alert(`Checkout berhasil! Invoice ID: ${data.invoice_id}`);
        loadCart();
        navigate("/invoice");
      } else {
        alert(data.error ?? "Checkout gagal");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat checkout");
    } finally {
      setCheckingOut(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Keranjang Saya</h1>
          <p className="text-gray-600">Kelola pesanan Anda</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Memuat keranjang...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-6">Tambahkan item ke keranjang Anda untuk memulai</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg"
            >
              Jelajahi Restoran
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(i => {
                const itemTotal = (i.price || 0) * i.qty;
                return (
                  <div
                    key={i.menu_id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {i.menu_name}
                        </h3>
                        <div className="space-y-1">
                          {i.price ? (
                            <>
                              <p className="text-sm text-gray-600">
                                Harga: <span className="font-medium">Rp {i.price.toLocaleString('id-ID')}</span>
                              </p>
                              <p className="text-orange-600 font-semibold text-lg">
                                Subtotal: Rp {itemTotal.toLocaleString('id-ID')}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-500 text-sm">Harga tidak tersedia</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center space-x-3 bg-orange-50 rounded-lg px-4 py-2 border border-orange-200">
                          <button
                            onClick={() => removeFromCart(i.menu_id)}
                            className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold flex items-center justify-center shadow-md hover:scale-110"
                            title="Kurangi"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-800 min-w-[2rem] text-center">
                            {i.qty}
                          </span>
                          <button
                            onClick={() => addToCart(i.menu_id)}
                            className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold flex items-center justify-center shadow-md hover:scale-110"
                            title="Tambah"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => deleteItem(i.menu_id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-600 pb-3 border-b">
                    <span>Total Item</span>
                    <span className="font-semibold text-gray-800">{totalItems} item</span>
                  </div>
                  
                  {items.map(i => {
                    const itemTotal = (i.price || 0) * i.qty;
                    return (
                      <div key={i.menu_id} className="flex justify-between text-sm text-gray-600">
                        <span className="truncate mr-2">{i.menu_name} x{i.qty}</span>
                        <span className="font-medium text-gray-800 whitespace-nowrap">
                          Rp {itemTotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t-2 border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Harga</span>
                      <span className="text-2xl font-bold text-orange-600">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={checkout}
                  disabled={checkingOut || items.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {checkingOut ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Memproses...
                    </span>
                  ) : (
                    `Checkout - Rp ${totalPrice.toLocaleString('id-ID')}`
                  )}
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Lanjutkan Belanja
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
