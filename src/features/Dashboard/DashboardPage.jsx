import React from "react";
import { useTabung } from "../../hooks/useTabung";
import { SummaryCards } from "./components/SummaryCards";
import { Card } from "../../components/ui/Card";
import { formatRM } from "../../utils/formatters";

export const DashboardPage = () => {
  const { bakiTabung, loading, error, refreshTabung } = useTabung();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold text-lg animate-pulse">
          Memuatkan data kewangan Kampung Gudon...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 font-semibold">
        ⚠️ Ralat sistem: {error}. Sila segarkan semula halaman.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Bahagian Tajuk Atas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">
            📊 Paparan Pungutan & Baki Semasa
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Ringkasan kedudukan kewangan semasa seluruh kampung.
          </p>
        </div>
        <button
          onClick={refreshTabung}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 transition-colors cursor-pointer">
          🔄 Semak Duit Terbaru
        </button>
      </div>

      {/* 3 Kad Ringkasan Besar (Dari Batch 5) */}
      <SummaryCards bakiTabung={bakiTabung} />

      {/* Pecahan Dana Mengikut Tabung Berbeza */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-wide">
          💰 Pecahan Duit Ikut Tabung / Dana
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bakiTabung.map((tabung) => {
            const baki = Number(tabung.baki_semasa || 0);
            return (
              <Card
                key={tabung.tabung_id}
                className="flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {tabung.nama_tabung}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ID: {tabung.tabung_id.substring(0, 8)}...
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                    ${baki >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}
                  `}>
                    {baki >= 0 ? "Selamat" : "Kurangan"}
                  </span>
                </div>

                <div className="mt-6 flex justify-between items-baseline border-t border-gray-50 pt-3">
                  <span className="text-xs text-gray-400 font-bold">
                    BAKI DANA:
                  </span>
                  <span className="text-xl font-extrabold text-gray-900">
                    {formatRM(baki)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
