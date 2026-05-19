import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./features/Dashboard/DashboardPage";
import { BukuTunaiPage } from "./features/BukuTunai/BukuTunaiPage";
import { TabungPage } from "./features/Tabung/TabungPage";
import { LaporanPage } from "./features/Laporan/LaporanPage";

function App() {
  // Tetapkan tab permulaan di skrin utama (Dashboard)
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Fungsi penukar halaman berasaskan state tab aktif
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

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {paparHalaman()}
    </Layout>
  );
}

export default App;
