import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { Layout } from "./components/Layout";
import { LoginPage } from "./features/Auth/LoginPage";
import { DashboardPage } from "./features/Dashboard/DashboardPage";
import { BukuTunaiPage } from "./features/BukuTunai/BukuTunaiPage";
import { TabungPage } from "./features/Tabung/TabungPage";
import { LaporanPage } from "./features/Laporan/LaporanPage";

function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const kendaliLogKeluar = async () => {
    await supabase.auth.signOut();
    setCurrentTab("dashboard");
  };

  const paparHalaman = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardPage />;
      case "bukutunai":
        return <BukuTunaiPage />;
      case "tabung":
        return <TabungPage />;
      case "laporan":
        return <LaporanPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500 font-semibold text-base tracking-wide animate-pulse text-center">
          Menyemak kelayakan akses sistem...
        </p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={kendaliLogKeluar}
          className="text-sm font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl border border-rose-200 transition-colors cursor-pointer w-full sm:w-auto text-center">
          Log Keluar Sistem
        </button>
      </div>

      {paparHalaman()}
    </Layout>
  );
}

export default App;
