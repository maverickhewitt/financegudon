import React from "react";

export const Layout = ({ children, currentTab, setCurrentTab }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Utama",
      icon: (
        <svg
          className="w-6 h-6 md:w-5 md:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      id: "bukutunai",
      label: "Buku Tunai",
      icon: (
        <svg
          className="w-6 h-6 md:w-5 md:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "tabung",
      label: "Tabung",
      icon: (
        <svg
          className="w-6 h-6 md:w-5 md:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "laporan",
      label: "Laporan",
      icon: (
        <svg
          className="w-6 h-6 md:w-5 md:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-emerald-900 text-white shadow-md md:sticky md:top-0 z-45 print:hidden shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-lg md:text-xl font-bold tracking-wide text-green-400">
              SISTEM KEWANGAN MASJID
            </h1>
            <p className="text-xs text-emerald-200 font-semibold md:mt-0.5">
              MASJID AL-MUJAHIDIN, Kampung Gudon, Sabah
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`py-2.5 px-4 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border border-transparent ${
                  currentTab === item.id
                    ? "bg-green-600 text-white shadow"
                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                }`}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-8 overflow-y-auto">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-emerald-950 border-t border-emerald-800 shadow-2xl z-45 px-2 py-2 flex items-center justify-around print:hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === item.id
                ? "bg-green-600 text-white shadow font-bold"
                : "text-emerald-200 hover:text-white font-medium"
            }`}>
            {item.icon}
            <span className="text-xs tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
