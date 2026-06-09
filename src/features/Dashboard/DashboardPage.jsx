import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useTabung } from "../../hooks/useTabung";
import { SummaryCards } from "./components/SummaryCards";
import { Card } from "../../components/ui/Card";
import { formatRM } from "../../utils/formatters";

export const DashboardPage = () => {
  const { bakiTabung, loading, error, refreshTabung } = useTabung();
  const posterRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [ralatPoster, setRalatPoster] = useState("");

  const totalMasuk = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_masuk || 0),
    0,
  );
  const totalKeluar = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_keluar || 0),
    0,
  );
  const bakiSemasa = totalMasuk - totalKeluar;

  const muatTurunPoster = async () => {
    if (!posterRef.current) return;
    setGenerating(true);
    setRalatPoster("");
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FAFAF9",
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `Ringkasan_Kewangan_Masjid_${new Date().toISOString().split("T")[0]}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setRalatPoster(
        `Gagal membina gambar poster. Ralat teknikal: ${err.message || err}`,
      );
    } finally {
      setGenerating(false);
    }
  };

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
        Ralat sistem: {error}. Sila segarkan semula halaman.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* UI Header & Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
            Paparan Pungutan dan Baki Semasa
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Ringkasan kedudukan kewangan semasa seluruh kampung.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={muatTurunPoster}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-base">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>
              {generating ? "Sedang Membina..." : "Muat Turun Poster"}
            </span>
          </button>

          <button
            onClick={refreshTabung}
            className="bg-white hover:bg-gray-50 text-green-700 px-5 py-3.5 rounded-xl text-sm font-bold border border-gray-200 shadow-sm transition-colors cursor-pointer text-center text-base">
            Semak Duit Terbaru
          </button>
        </div>
      </div>

      {ralatPoster && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-xl">
          {ralatPoster}
        </div>
      )}

      {/* Main Dashboard UI Cards */}
      <SummaryCards bakiTabung={bakiTabung} />

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-wide">
          Pecahan Duit Ikut Tabung Dan Dana
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bakiTabung.map((tabung) => {
            const baki = Number(tabung.baki_semasa || 0);
            return (
              <Card
                key={tabung.tabung_id}
                className="flex flex-col justify-between p-5 rounded-2xl border-gray-200 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {tabung.nama_tabung}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold tracking-wider ${
                      baki >= 0
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                    {baki >= 0 ? "Selamat" : "Kurangan"}
                  </span>
                </div>

                <div className="mt-6 flex justify-between items-baseline border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400 font-bold">
                    BAKI DANA:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatRM(baki)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* POSTER SECTION (Optimized for High-Density Data / Multiple Tabung) */}
      <div className="fixed left-0 top-0 z-[-99] opacity-100 pointer-events-none">
        <div
          ref={posterRef}
          style={{ backgroundColor: "#FAFAF9" }}
          className="w-[540px] p-9 flex flex-col gap-7 font-sans select-none">
          {/* Header */}
          <div
            style={{ borderColor: "#E7E5E4" }}
            className="text-center border-b pb-6">
            <h1
              style={{ color: "#1C1917" }}
              className="text-2xl font-extrabold tracking-tight">
              RINGKASAN KEWANGAN SEMASA
            </h1>
            <p
              style={{ color: "#059669" }}
              className="text-lg font-semibold mt-1">
              MASJID AL-MUJAHIDIN
            </p>
            <p
              style={{ color: "#78716C" }}
              className="text-sm font-medium mt-0.5">
              Kampung Gudon, Kota Kinabalu, Sabah
            </p>
          </div>

          {/* Main Total Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E7E5E4",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
            className="p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <span
              style={{ color: "#57534E" }}
              className="text-xs font-semibold tracking-widest uppercase mb-1">
              Jumlah Baki Dana Semasa
            </span>
            <span
              style={{ color: "#1C1917" }}
              className="text-4xl font-extrabold drop-shadow-sm">
              {formatRM(bakiSemasa)}
            </span>
          </div>

          {/* In/Out Grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Income */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E7E5E4",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              className="p-5 rounded-xl flex flex-col shadow-sm">
              <span
                style={{ color: "#78716C" }}
                className="text-xs font-medium tracking-wider mb-1">
                Total Kutipan Masuk
              </span>
              <span
                style={{ color: "#16A34A" }}
                className="text-2xl font-bold mt-1">
                {formatRM(totalMasuk)}
              </span>
            </div>
            {/* Expense */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E7E5E4",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              className="p-5 rounded-xl flex flex-col shadow-sm">
              <span
                style={{ color: "#78716C" }}
                className="text-xs font-medium tracking-wider mb-1">
                Total Perbelanjaan Keluar
              </span>
              <span
                style={{ color: "#DC2626" }}
                className="text-2xl font-bold mt-1">
                {formatRM(totalKeluar)}
              </span>
            </div>
          </div>

          {/* MULTI-COLUMN BREAKDOWN GRID:
              Diubah suai untuk menyusun tabung secara 2-kolom bersebelahan berserta pembungkusan teks (word-wrap) yang selamat.
          */}
          <div>
            <span
              style={{ color: "#1C1917" }}
              className="text-sm font-semibold uppercase tracking-widest block mb-3.5 ml-1">
              Pecahan Baki Ikut Dana Khas
            </span>
            <div className="grid grid-cols-2 gap-3">
              {bakiTabung.map((tabung) => {
                const baki = Number(tabung.baki_semasa || 0);
                return (
                  <div
                    key={tabung.tabung_id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E7E5E4",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    className="p-3.5 rounded-xl flex flex-col justify-between gap-2 shadow-sm">
                    <span
                      style={{ color: "#57534E" }}
                      className="text-xs font-medium leading-tight break-words">
                      {tabung.nama_tabung}
                    </span>
                    <span
                      style={{ color: baki >= 0 ? "#1C1917" : "#DC2626" }}
                      className="text-sm font-bold tracking-tight">
                      {formatRM(baki)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Poster Footer */}
          <div
            style={{ borderColor: "#E7E5E4" }}
            className="mt-5 pt-4 border-t flex justify-between items-center text-[11px] font-normal tracking-wide">
            <span style={{ color: "#78716C" }}>
              Sistem Kewangan Masjid Al-Mujahidin
            </span>
            <span style={{ color: "#78716C" }}>
              Kemaskini: {new Date().toLocaleDateString("ms-MY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
