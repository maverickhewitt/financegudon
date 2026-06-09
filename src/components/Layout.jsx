import React from "react";

export const Layout = ({ children, currentTab, setCurrentTab }) => {
  // Senarai menu utama sistem
  const menuItems = [
    { id: "dashboard", label: "📊 Paparan Pungutan" },
    { id: "bukutunai", label: "📖 Buku Tunai" },
    { id: "tabung", label: "💰 Pungutan Tabung" },
    { id: "laporan", label: "📄 Laporan Bulanan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* 1. KEPALA MENU (NAVBAR) UNTUK TELEFON / TABLET */}
      <div className="bg-blue-900 text-white p-4 flex flex-col gap-2 md:hidden shadow-md">
        <div className="text-center font-black text-lg tracking-wider">
          Sistem Kewangan
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`py-2 px-3 rounded-md text-xs font-bold text-center transition-colors cursor-pointer
                ${currentTab === item.id ? "bg-amber-500 text-blue-950 shadow" : "bg-blue-800 text-blue-100 hover:bg-blue-700"}
              `}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SIDEBAR UTAMA UNTUK PAPARAN SKRIN BESAR (KOMPUTER/LAPTOP) */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-950 text-white min-h-screen p-5 shadow-xl shrink-0">
        <div className="mb-8 mt-2 text-center border-b border-blue-800 pb-5">
          <h1 className="text-xl font-black tracking-wide text-amber-400">
            SISTEM KEWANGAN
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-semibold">
            MASJID AL-MUJAHIDIN, Kampung Gudon, Sabah
          </p>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full text-left py-3.5 px-4 rounded-xl text-base font-bold transition-all duration-150 cursor-pointer flex items-center
                ${
                  currentTab === item.id
                    ? "bg-amber-500 text-blue-950 shadow-lg translate-x-1 font-extrabold"
                    : "text-blue-100 hover:bg-blue-900 hover:text-white"
                }
              `}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 3. RUANG UTAMA (KANDUNGAN HALAMAN) */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
