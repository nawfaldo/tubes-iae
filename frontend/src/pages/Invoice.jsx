import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function loadInvoices() {
    try {
      const res = await fetch("http://localhost:3000/invoice", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Riwayat Invoice</h1>
          <p className="text-gray-600">Lihat semua pesanan Anda</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Memuat invoice...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Invoice</h2>
            <p className="text-gray-600 mb-6">Mulai pesan makanan untuk melihat invoice di sini</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg"
            >
              Jelajahi Restoran
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map(inv => (
              <div
                key={inv.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Invoice #{inv.id}</h2>
                      <p className="text-orange-100 mt-1">{formatDate(inv.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-orange-100">Status</div>
                      <div className="font-semibold">Selesai</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Pesanan:</h3>
                  <div className="space-y-3 mb-4">
                    {inv.items.map(i => {
                      const itemTotal = (i.price || 0) * i.qty;
                      return (
                        <div
                          key={i.menu_id}
                          className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <span className="text-xl">🍴</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{i.menu_name}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-gray-600">Jumlah: {i.qty}</p>
                                {i.price && (
                                  <p className="text-sm text-gray-600">
                                    @ Rp {i.price.toLocaleString('id-ID')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          {i.price ? (
                            <div className="text-right ml-4">
                              <p className="font-semibold text-gray-800 text-lg">
                                Rp {itemTotal.toLocaleString('id-ID')}
                              </p>
                            </div>
                          ) : (
                            <div className="text-right ml-4">
                              <p className="text-gray-400 text-sm">Harga tidak tersedia</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-gray-300 space-y-2">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Item:</span>
                      <span className="font-semibold text-gray-800">
                        {inv.items.reduce((sum, item) => sum + item.qty, 0)} item
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-800">Total Harga:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        Rp {inv.items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
