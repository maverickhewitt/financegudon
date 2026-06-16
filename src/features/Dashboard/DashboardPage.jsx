import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useTabung } from "../../hooks/useTabung";
import { useLaporan } from "../../hooks/useLaporan";
import { SummaryCards } from "./components/SummaryCards";
import { Card } from "../../components/ui/Card";
import { formatRM } from "../../utils/formatters";

// Ikon Komponen UI
const DownloadIcon = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const InsightIcon = () => (
  <svg
    className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const DashboardPage = () => {
  const {
    bakiTabung,
    loading: loadingTabung,
    error: errorTabung,
    refreshTabung,
  } = useTabung();

  const tarikhSemasa = new Date();
  const [tahunCarta, setTahunCarta] = useState(
    tarikhSemasa.getFullYear().toString(),
  );
  const [bulanCarta, setBulanCarta] = useState("semua"); // Default kepada 'semua' (Tahunan)
  const { dataLaporan, loading: loadingLaporan, janaLaporan } = useLaporan();

  const mainPosterRef = useRef(null);
  const cartaPosterRef = useRef(null);
  const [generatingMain, setGeneratingMain] = useState(false);
  const [generatingCarta, setGeneratingCarta] = useState(false);

  useEffect(() => {
    janaLaporan(tahunCarta, bulanCarta);
  }, [tahunCarta, bulanCarta]);

  // -- PENGIRAAN KAD RINGKASAN UTAMA --
  const totalMasuk = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_masuk || 0),
    0,
  );
  const totalKeluar = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_keluar || 0),
    0,
  );
  const bakiSemasa = totalMasuk - totalKeluar;

  // -- LOGIK PENGGABUNGAN (AGGREGATION) UNTUK CARTA GRAF --
  // Menyelesaikan isu nama tabung yang berulang (duplicate) jika paparan tahunan dipilih.
  const cantumanDataCartaMap = dataLaporan.reduce((acc, curr) => {
    const key = curr.tabung_id || "umum"; // Gunakan ID atau 'umum' jika tiada ID
    if (!acc[key]) {
      acc[key] = {
        tabung_id: curr.tabung_id,
        nama_tabung: curr.nama_tabung || "Am / Umum",
        total_keluar: 0,
      };
    }
    acc[key].total_keluar += Number(curr.total_keluar || 0);
    return acc;
  }, {});

  // Tukar format objek cantuman kembali menjadi susunan (array)
  const senaraiCarta = Object.values(cantumanDataCartaMap);

  const totalKeluarCarta = senaraiCarta.reduce(
    (sum, item) => sum + item.total_keluar,
    0,
  );
  const maxPerbelanjaanCarta = Math.max(
    ...senaraiCarta.map((item) => item.total_keluar),
    1,
  );

  const tabungTertinggi = senaraiCarta.reduce(
    (max, item) => {
      return item.total_keluar > max.total_keluar ? item : max;
    },
    { total_keluar: 0, nama_tabung: "-" },
  );

  const peratusTertinggi =
    totalKeluarCarta > 0
      ? Math.round((tabungTertinggi.total_keluar / totalKeluarCarta) * 100)
      : 0;

  const senaraiBulan = [
    { id: "1", nama: "Jan" },
    { id: "2", nama: "Feb" },
    { id: "3", nama: "Mac" },
    { id: "4", nama: "Apr" },
    { id: "5", nama: "Mei" },
    { id: "6", nama: "Jun" },
    { id: "7", nama: "Jul" },
    { id: "8", nama: "Ogo" },
    { id: "9", nama: "Sep" },
    { id: "10", nama: "Okt" },
    { id: "11", nama: "Nov" },
    { id: "12", nama: "Dis" },
  ];

  // Muat Turun Poster Keseluruhan menggunakan inline style
  const muatTurunPosterUtama = async () => {
    if (!mainPosterRef.current) return;
    setGeneratingMain(true);
    try {
      const canvas = await html2canvas(mainPosterRef.current, {
        scale: 2,
        backgroundColor: "#FAFAF9",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `Ringkasan_Kewangan_${tarikhSemasa.toISOString().split("T")[0]}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (err) {
      alert(
        "Gagal membina poster utama. Sila pastikan pelayar anda dikemaskini.",
      );
    } finally {
      setGeneratingMain(false);
    }
  };

  // Muat Turun Poster Carta Graf Khusus
  const muatTurunPosterCarta = async () => {
    if (!cartaPosterRef.current) return;
    setGeneratingCarta(true);
    try {
      // Tunggu font/gambar selesai dirender sepenuhnya
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(cartaPosterRef.current, {
        scale: 2,
        backgroundColor: "#FFFFFF",
        logging: false,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Laporan_Carta_Perbelanjaan_${bulanCarta === "semua" ? "Tahunan" : "Bulanan"}_${tahunCarta}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (err) {
      alert("Gagal membina gambar carta.");
    } finally {
      setGeneratingCarta(false);
    }
  };

  if (loadingTabung) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold text-lg animate-pulse">
          Memuatkan data kewangan Kampung Gudon...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER UI */}
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
            onClick={muatTurunPosterUtama}
            disabled={generatingMain}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3.5 rounded-xl font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
            <DownloadIcon />
            <span>
              {generatingMain ? "Menjana..." : "Muat Turun Ringkasan Umum"}
            </span>
          </button>
          <button
            onClick={refreshTabung}
            className="bg-white hover:bg-gray-50 text-green-700 px-5 py-3.5 rounded-xl font-bold border border-gray-200 shadow-sm transition-colors cursor-pointer text-center text-sm">
            Semak Duit Terbaru
          </button>
        </div>
      </div>

      {errorTabung && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 font-semibold p-4 rounded-xl">
          Ralat sistem: {errorTabung}
        </div>
      )}

      {/* METRIK KAD ATAS */}
      <SummaryCards bakiTabung={bakiTabung} />

      {/* CARTA GRAF ANALISIS PERBELANJAAN UI (Paparan Web) */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <ChartIcon />
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Prestasi & Analisis Perbelanjaan Keluar
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Semak penggunaan dana mengikut bulan atau tahunan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={bulanCarta}
              onChange={(e) => setBulanCarta(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-xs text-gray-800 outline-none focus:border-blue-500 cursor-pointer">
              <option value="semua">Setahun (Penuh)</option>
              {senaraiBulan.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
            <select
              value={tahunCarta}
              onChange={(e) => setTahunCarta(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-xs text-gray-800 outline-none focus:border-blue-500 cursor-pointer">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
            <button
              onClick={muatTurunPosterCarta}
              disabled={generatingCarta}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs ml-auto md:ml-0">
              <DownloadIcon />
              <span>
                {generatingCarta ? "Sila Tunggu..." : "Eksport Graf Poster"}
              </span>
            </button>
          </div>
        </div>

        {/* Insight Box / Analisis Pintar Web */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3 mb-6">
          <InsightIcon />
          <div>
            <span className="text-sm font-bold text-indigo-900 block">
              Analisis Penggunaan Dana Sebenar:
            </span>
            {totalKeluarCarta > 0 ? (
              <span className="text-xs font-medium text-indigo-800 leading-relaxed mt-1 block">
                Bagi tempoh ini, perbelanjaan keseluruhan dicatatkan sebanyak{" "}
                <strong>{formatRM(totalKeluarCarta)}</strong>. Sektor yang
                menelan perbelanjaan terbesar adalah{" "}
                <strong className="text-rose-600 uppercase tracking-wide">
                  {tabungTertinggi.nama_tabung}
                </strong>{" "}
                sebanyak{" "}
                <strong>{formatRM(tabungTertinggi.total_keluar)}</strong>. Ini
                merangkumi <strong>{peratusTertinggi}%</strong> daripada aliran
                keluar.
              </span>
            ) : (
              <span className="text-xs font-medium text-indigo-800 leading-relaxed mt-1 block">
                Tiada sebarang perbelanjaan atau duit keluar dicatatkan untuk
                tempoh ini.
              </span>
            )}
          </div>
        </div>

        {/* UI Paparan Graf Web (Modern Tailwind) */}
        <div className="relative w-full h-72 pt-4 px-2 sm:px-6">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 px-2 sm:px-6 text-[10px] text-gray-400 font-mono">
            <div className="border-b border-gray-200 border-dashed w-full h-0 flex items-center justify-end">
              <span className="-mt-3 ml-2 absolute right-0">Tinggi</span>
            </div>
            <div className="border-b border-gray-200 border-dashed w-full h-0"></div>
            <div className="border-b border-gray-200 border-dashed w-full h-0"></div>
            <div className="border-b border-gray-800 w-full h-0 flex items-center justify-end">
              <span className="-mb-3 ml-2 absolute right-0">RM 0</span>
            </div>
          </div>

          <div className="relative h-full pb-8 flex items-end justify-around gap-2 z-10 w-[95%]">
            {loadingLaporan ? (
              <div className="w-full text-center text-xs text-gray-400 mt-20">
                Mengira graf...
              </div>
            ) : senaraiCarta.length === 0 ? (
              <div className="w-full text-center text-xs text-gray-400 mt-20">
                Tiada data untuk dipaparkan.
              </div>
            ) : (
              senaraiCarta.map((item) => {
                const keluarAmt = item.total_keluar;
                const isTertinggi =
                  keluarAmt > 0 && item.tabung_id === tabungTertinggi.tabung_id;
                const tinggiPeratus = Math.min(
                  Math.round((keluarAmt / maxPerbelanjaanCarta) * 100),
                  100,
                );
                const peratusSumbangan =
                  totalKeluarCarta > 0
                    ? Math.round((keluarAmt / totalKeluarCarta) * 100)
                    : 0;

                return (
                  <div
                    key={item.tabung_id}
                    className="flex flex-col items-center justify-end h-full flex-1 group relative max-w-[80px]">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg absolute top-0 z-20 whitespace-nowrap pointer-events-none -translate-y-6 shadow-md text-center">
                      <div className="uppercase">{item.nama_tabung}</div>
                      <div className="text-emerald-300">
                        {formatRM(keluarAmt)}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold mb-1 whitespace-nowrap ${isTertinggi ? "text-rose-600" : "text-gray-600"}`}>
                      {keluarAmt > 0
                        ? formatRM(keluarAmt).replace("RM", "").trim()
                        : ""}
                    </span>

                    <div
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-1000 border-x border-t ${
                        isTertinggi
                          ? "bg-rose-500 border-rose-600"
                          : "bg-blue-400 border-blue-500 opacity-80"
                      }`}
                      style={{
                        height: `${Math.max(tinggiPeratus, keluarAmt > 0 ? 2 : 0)}%`,
                      }}>
                      {tinggiPeratus > 15 && (
                        <div className="w-full text-center mt-1 text-[9px] font-bold text-white/90">
                          {peratusSumbangan}%
                        </div>
                      )}
                    </div>
                    {/* Mengelakkan absolute label terpotong pada web UI */}
                    <div className="h-6 mt-2 w-full text-[9px] font-bold text-gray-700 text-center leading-tight break-words px-1">
                      {item.nama_tabung}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>

      {/* DETAILED CARDS BAWAH */}
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
                  <h4 className="text-base font-bold text-gray-900">
                    {tabung.nama_tabung}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider border ${baki >= 0 ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
                    {baki >= 0 ? "SELAMAT" : "KURANGAN"}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-baseline border-t border-gray-100 pt-3">
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

      {/* ========================================================================= */}
      {/* 1. HIDDEN KANVAS POSTER UTAMA - GAYA SEBARIS (INLINE STYLES) TULEN       */}
      {/* ========================================================================= */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div
          ref={mainPosterRef}
          style={{
            width: "540px",
            padding: "40px",
            backgroundColor: "#FAFAF9",
            fontFamily: "sans-serif",
            boxSizing: "border-box",
          }}>
          <div
            style={{
              borderBottom: "1px solid #E7E5E4",
              paddingBottom: "20px",
              marginBottom: "24px",
              textAlign: "center",
            }}>
            <h1
              style={{
                color: "#1C1917",
                fontSize: "24px",
                fontWeight: "bold",
                margin: "0",
              }}>
              RINGKASAN KEWANGAN SEMASA
            </h1>
            <p
              style={{
                color: "#059669",
                fontSize: "18px",
                fontWeight: "bold",
                margin: "4px 0",
              }}>
              MASJID AL-MUJAHIDIN
            </p>
            <p style={{ color: "#78716C", fontSize: "14px", margin: "0" }}>
              Kampung Gudon, Kota Kinabalu, Sabah
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E7E5E4",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              marginBottom: "20px",
            }}>
            <div
              style={{
                color: "#57534E",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
              Jumlah Baki Dana Semasa
            </div>
            <div
              style={{
                color: "#1C1917",
                fontSize: "36px",
                fontWeight: "bold",
              }}>
              {formatRM(bakiSemasa)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}>
            <div
              style={{
                width: "48%",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E7E5E4",
                borderRadius: "12px",
                padding: "16px",
                boxSizing: "border-box",
              }}>
              <div
                style={{
                  color: "#78716C",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}>
                Total Kutipan Masuk
              </div>
              <div
                style={{
                  color: "#16A34A",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}>
                {formatRM(totalMasuk)}
              </div>
            </div>
            <div
              style={{
                width: "48%",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E7E5E4",
                borderRadius: "12px",
                padding: "16px",
                boxSizing: "border-box",
              }}>
              <div
                style={{
                  color: "#78716C",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}>
                Total Perbelanjaan Keluar
              </div>
              <div
                style={{
                  color: "#DC2626",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}>
                {formatRM(totalKeluar)}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                color: "#1C1917",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>
              Pecahan Baki Ikut Dana Khas
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}>
              {bakiTabung.map((tabung) => {
                const baki = Number(tabung.baki_semasa || 0);
                return (
                  <div
                    key={tabung.tabung_id}
                    style={{
                      width: "48%",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E7E5E4",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                      boxSizing: "border-box",
                    }}>
                    <div
                      style={{
                        color: "#57534E",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}>
                      {tabung.nama_tabung}
                    </div>
                    <div
                      style={{
                        color: baki >= 0 ? "#1C1917" : "#DC2626",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}>
                      {formatRM(baki)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HIDDEN KANVAS POSTER CARTA - DATA TELAH DIGABUNGKAN                    */}
      {/* ========================================================================= */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div
          ref={cartaPosterRef}
          style={{
            width: "650px",
            backgroundColor: "#FFFFFF",
            padding: "40px",
            fontFamily: "sans-serif",
            boxSizing: "border-box",
          }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                color: "#1E3A8A",
                fontSize: "24px",
                fontWeight: "bold",
                margin: "0",
              }}>
              ANALISIS GRAF PERBELANJAAN
            </h1>
            <p
              style={{
                color: "#4B5563",
                fontSize: "14px",
                fontWeight: "bold",
                margin: "4px 0",
              }}>
              MASJID AL-MUJAHIDIN, GUDON
            </p>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#EFF6FF",
                color: "#1E40AF",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop: "12px",
                border: "1px solid #DBEAFE",
              }}>
              TEMPOH:{" "}
              {bulanCarta === "semua"
                ? `KESELURUHAN TAHUN ${tahunCarta}`
                : `BULAN ${senaraiBulan.find((b) => b.id === bulanCarta)?.nama.toUpperCase()} ${tahunCarta}`}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "32px",
            }}>
            <div
              style={{
                color: "#312E81",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
              Analisis Eksekutif Pengerusi:
            </div>
            <div
              style={{ color: "#3730A3", fontSize: "14px", lineHeight: "1.5" }}>
              Jumlah perbelanjaan keluar adalah{" "}
              <strong style={{ color: "#1E3A8A" }}>
                {formatRM(totalKeluarCarta)}
              </strong>
              . Sektor perbelanjaan terbesar bagi tempoh ini ialah{" "}
              <strong style={{ color: "#E11D48" }}>
                {tabungTertinggi.nama_tabung}
              </strong>{" "}
              dengan nilai{" "}
              <strong>{formatRM(tabungTertinggi.total_keluar)}</strong> (
              {peratusTertinggi}% daripada keseluruhan aliran keluar).
            </div>
          </div>

          <div
            style={{
              width: "100%",
              border: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              padding: "24px 20px 16px 20px",
              boxSizing: "border-box",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                height: "260px",
                borderBottom: "1px solid #9CA3AF",
              }}>
              {senaraiCarta.map((item) => {
                const keluarAmt = item.total_keluar;
                const isTertinggi =
                  keluarAmt > 0 && item.tabung_id === tabungTertinggi.tabung_id;
                const tinggiPeratus = Math.min(
                  Math.round((keluarAmt / maxPerbelanjaanCarta) * 100),
                  100,
                );
                const peratusSumbangan =
                  totalKeluarCarta > 0
                    ? Math.round((keluarAmt / totalKeluarCarta) * 100)
                    : 0;

                return (
                  <div
                    key={item.tabung_id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "100%",
                      flex: 1,
                      padding: "0 4px",
                    }}>
                    <span
                      style={{
                        color: isTertinggi ? "#E11D48" : "#4B5563",
                        fontSize: "10px",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}>
                      {keluarAmt > 0
                        ? formatRM(keluarAmt).replace("RM", "").trim()
                        : ""}
                    </span>
                    <div
                      style={{
                        height: `${Math.max(tinggiPeratus, keluarAmt > 0 ? 2 : 0)}%`,
                        backgroundColor: isTertinggi ? "#F43F5E" : "#60A5FA",
                        width: "100%",
                        maxWidth: "45px",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        textAlign: "center",
                      }}>
                      {tinggiPeratus > 15 && (
                        <div
                          style={{
                            color: "#FFFFFF",
                            fontSize: "10px",
                            fontWeight: "bold",
                            paddingTop: "4px",
                          }}>
                          {peratusSumbangan}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "8px",
              }}>
              {senaraiCarta.map((item) => (
                <div
                  key={`label-${item.tabung_id}`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "#374151",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "0 4px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}>
                  {item.nama_tabung}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "40px",
              borderTop: "1px solid #E5E7EB",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              color: "#6B7280",
              fontSize: "10px",
            }}>
            <span>Laporan Eksekutif Jana Automatik Sistem</span>
            <span>Dicetak Pada: {new Date().toLocaleString("ms-MY")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
