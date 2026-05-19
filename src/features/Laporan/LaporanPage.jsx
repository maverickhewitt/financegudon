import React, { useState, useEffect } from "react";
import { useLaporan } from "../../hooks/useLaporan";
import { Card } from "../../components/ui/Card";
import { formatRM } from "../../utils/formatters";

export const LaporanPage = () => {
  const tahunSemasa = new Date().getFullYear();
  const [tahun, setTahun] = useState(tahunSemasa.toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());

  const { dataLaporan, loading, error, janaLaporan } = useLaporan();

  const senaraiBulan = [
    { id: "1", nama: "Januari" },
    { id: "2", nama: "Februari" },
    { id: "3", nama: "Mac" },
    { id: "4", nama: "April" },
    { id: "5", nama: "Mei" },
    { id: "6", nama: "Jun" },
    { id: "7", nama: "Kulai" },
    { id: "8", nama: "Ogos" },
    { id: "9", nama: "September" },
    { id: "10", nama: "Oktober" },
    { id: "11", nama: "November" },
    { id: "12", nama: "Disember" },
  ];

  useEffect(() => {
    janaLaporan(tahun, bulan);
  }, [tahun, bulan]);

  // Fungsi cetak khas fail fizikal
  const kendaliCetak = () => {
    window.print();
  };

  // Kira jumlah ringkasan bawah jadual laporan
  const totalMasuk = dataLaporan.reduce(
    (sum, item) => sum + Number(item.total_masuk || 0),
    0,
  );
  const totalKeluar = dataLaporan.reduce(
    (sum, item) => sum + Number(item.total_keluar || 0),
    0,
  );
  const totalBersih = totalMasuk - totalKeluar;

  return (
    <div className="flex flex-col gap-6">
      {/* BAHAGIAN KEPALA - DISEMBUNYIKAN SEWAKTU PRINT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">
            FAIL: ReportFilter.jsx / Penyata Berkala
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Penyata rasas bulanan dan tahunan kampung yang dikemaskini secara
            langsung.
          </p>
        </div>
        <button
          onClick={kendaliCetak}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow transition-all cursor-pointer w-full sm:w-auto">
          🖨️ Cetak Laporan Ke Kertas
        </button>
      </div>

      {/* KOTAK TAPISAN (FILTER INPUT) - DISEMBUNYIKAN SEWAKTU PRINT */}
      <Card className="print:hidden bg-white border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-750 font-bold mb-2 text-sm">
              Pilih Bulan
            </label>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white font-medium text-gray-800 focus:ring-2 focus:ring-blue-150 outline-none">
              <option value="semua">-- Keseluruhan Tahun (Tahunan) --</option>
              {senaraiBulan.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-750 font-bold mb-2 text-sm">
              Pilih Tahun
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white font-medium text-gray-800 focus:ring-2 focus:ring-blue-150 outline-none">
              <option value={tahunSemasa}>{tahunSemasa}</option>
              <option value={tahunSemasa - 1}>{tahunSemasa - 1}</option>
              <option value={tahunSemasa - 2}>{tahunSemasa - 2}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* FAIL: PrintView.jsx - KAWASAN UTAMA YANG AKAN DICETAK */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Kepala Surat Rasmi (Hanya Jelas Bila Cetak / PrintView) */}
        <div className="text-center border-b-2 border-gray-800 pb-5 mb-6">
          <h2 className="text-xl font-black uppercase text-gray-900 tracking-wide">
            Penyata Kewangan Rasmi Kumpulan Wang Kampung Gudon
          </h2>
          <p className="text-sm text-gray-600 font-bold mt-1">
            Laporan Bagi:{" "}
            {bulan === "semua"
              ? "Keseluruhan Tahun"
              : senaraiBulan.find((b) => b.id === bulan)?.nama}{" "}
            {tahun}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 print:block hidden">
            Dijana secara digital pada: {new Date().toLocaleDateString("ms-MY")}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 font-bold py-8 animate-pulse">
            Menghitung kira-kira penyata kewangan...
          </p>
        ) : dataLaporan.length === 0 ? (
          <p className="text-center text-gray-400 font-medium py-8">
            Tiada sebarang rekod aliran wang dicatatkan pada tempoh yang
            dipilih.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-800 text-sm font-bold border-b border-gray-300">
                  <th className="p-3 border-r border-gray-300">
                    Nama Tabung / Dana Kampung
                  </th>
                  <th className="p-3 text-right border-r border-gray-300">
                    Jumlah Masuk (RM)
                  </th>
                  <th className="p-3 text-right border-r border-gray-300">
                    Jumlah Keluar (RM)
                  </th>
                  <th className="p-3 text-right">Baki Bersih Berkala (RM)</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base text-gray-800 font-medium divide-y divide-gray-300">
                {dataLaporan.map((row) => (
                  <tr key={row.tabung_id} className="hover:bg-gray-50/40">
                    <td className="p-3 border-r border-gray-300 font-bold text-gray-900">
                      {row.nama_tabung}
                    </td>
                    <td className="p-3 text-right border-r border-gray-300 text-emerald-600 font-bold">
                      {formatRM(row.total_masuk).replace("RM", "").trim()}
                    </td>
                    <td className="p-3 text-right border-r border-gray-300 text-rose-600 font-bold">
                      {formatRM(row.total_keluar).replace("RM", "").trim()}
                    </td>
                    <td
                      className={`p-3 text-right font-black ${Number(row.baki_bersih) >= 0 ? "text-gray-900" : "text-rose-700"}`}>
                      {formatRM(row.baki_bersih).replace("RM", "").trim()}
                    </td>
                  </tr>
                ))}
                {/* BARIS JUMLAH AKHIR KESELURUHAN */}
                <tr className="bg-gray-50 font-black text-gray-950 border-t-2 border-gray-800">
                  <td className="p-3 border-r border-gray-300 uppercase tracking-wide">
                    JUMLAH KESELURUHAN (RM)
                  </td>
                  <td className="p-3 text-right border-r border-gray-300 text-emerald-700">
                    {formatRM(totalMasuk).replace("RM", "").trim()}
                  </td>
                  <td className="p-3 text-right border-r border-gray-300 text-rose-700">
                    {formatRM(totalKeluar).replace("RM", "").trim()}
                  </td>
                  <td
                    className={`p-3 text-right text-base underline decoration-double ${totalBersih >= 0 ? "text-blue-950" : "text-rose-800"}`}>
                    {formatRM(totalBersih)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Bahagian Tanda Tangan Pengesahan (Hanya Muncul Bila Cetak Fizikal) */}
        <div className="mt-16 hidden print:grid grid-cols-2 gap-12 text-sm font-bold text-center">
          <div className="flex flex-col items-center">
            <span className="mb-20">Disediakan Oleh,</span>
            <div className="w-48 border-b border-gray-800"></div>
            <span className="text-xs text-gray-500 mt-1">
              (Bendahari Kampung Gudon)
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-20">Disahkan Benar Oleh,</span>
            <div className="w-48 border-b border-gray-800"></div>
            <span className="text-xs text-gray-500 mt-1">
              (Ketua Kampung / Pengerusi JKKK)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
