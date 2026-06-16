import React, { useState, useEffect } from "react";
import { useBukuTunai } from "../../hooks/useBukuTunai";
import { useLaporan } from "../../hooks/useLaporan";
import { Card } from "../../components/ui/Card";
import { formatRM, formatTarikh } from "../../utils/formatters";

export const LaporanPage = () => {
  const tahunSemasa = new Date().getFullYear();
  const [tahun, setTahun] = useState(tahunSemasa.toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());

  // Memanggil useBukuTunai untuk mendapatkan item perincian satu-per-satu
  const { transactions, loading: loadingUrusniaga } = useBukuTunai();
  const { dataLaporan, loading: loadingRumusan, janaLaporan } = useLaporan();

  // Negeri (state) bagi pemegang jawatan tandatangan laporan
  const [penyediaNama, setPenyediaNama] = useState("SAHARA BINTI JAIS");
  const [penyediaJawatan, setPenyediaJawatan] = useState("SETIAUSAHA");
  const [penyediaTarikh, setPenyediaTarikh] = useState("");

  const [pemeriksaNama, setPemeriksaNama] = useState("SHAHIRUL BIN IDRIS");
  const [pemeriksaJawatan, setPemeriksaJawatan] = useState("BENDAHARI");
  const [pemeriksaTarikh, setPemeriksaTarikh] = useState("");

  const [pengesahNama, setPengesahNama] = useState("SUKOR BIN HUSSIN");
  const [pengesahJawatan, setPengesahJawatan] = useState("PENGERUSI");
  const [pengesahTarikh, setPengesahTarikh] = useState("");

  const senaraiBulan = [
    { id: "1", nama: "Januari" },
    { id: "2", nama: "Februari" },
    { id: "3", nama: "Mac" },
    { id: "4", nama: "April" },
    { id: "5", nama: "Mei" },
    { id: "6", nama: "Jun" },
    { id: "7", nama: "Julai" },
    { id: "8", nama: "Ogos" },
    { id: "9", nama: "September" },
    { id: "10", nama: "Oktober" },
    { id: "11", nama: "November" },
    { id: "12", nama: "Disember" },
  ];

  useEffect(() => {
    janaLaporan(tahun, bulan);

    // Set tarikh lalai secara automatik mengikut hari bulan akhir pilihan
    const tarikhHariIni = new Date().toLocaleDateString("ms-MY");
    if (!penyediaTarikh) setPenyediaTarikh(tarikhHariIni);
    if (!pemeriksaTarikh) setPemeriksaTarikh(tarikhHariIni);
    if (!pengesahTarikh) setPengesahTarikh(tarikhHariIni);
  }, [tahun, bulan]);

  const kendaliCetak = () => {
    window.print();
  };

  const sasaranTahunStr = tahun;
  const sasaranBulanStr = bulan.padStart(2, "0");

  // Menapis data urusniaga buku tunai terperinci bagi bulan pilihan
  const urusniagaBulanPilihan = transactions.filter((tx) => {
    if (!tx.tarikh || bulan === "semua") return false;
    const komponen = tx.tarikh.split("-");
    return komponen[0] === sasaranTahunStr && komponen[1] === sasaranBulanStr;
  });

  const senaraiTerimaan = urusniagaBulanPilihan.filter(
    (tx) => tx.jenis === "masuk",
  );
  const senaraiBayaran = urusniagaBulanPilihan.filter(
    (tx) => tx.jenis === "keluar",
  );

  const totalMasuk = dataLaporan.reduce(
    (sum, item) => sum + Number(item.total_masuk || 0),
    0,
  );
  const totalKeluar = dataLaporan.reduce(
    (sum, item) => sum + Number(item.total_keluar || 0),
    0,
  );
  const totalBersih = totalMasuk - totalKeluar;

  const loading = loadingUrusniaga || loadingRumusan;

  return (
    <div className="flex flex-col gap-6">
      {/* Penggayaan Media Cetak A4 Rasmi Yang Ditambah Baik */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          /* Paksa browser kekalkan warna dan grafik latar belakang */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Sembunyikan elemen UI Aplikasi */
          aside, nav, header, button, .print\\:hidden,
          .no-print-input-style {
            display: none !important;
          }
          
          /* Susun atur saiz penuh untuk kertas A4 */
          body, main {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .main-report-box {
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Margin kertas fizikal */
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          
          /* Elak jadual terpotong di tengah muka surat */
          table {
            page-break-inside: auto;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          
          /* Penggayaan Input supaya menjadi teks cetakan dokumen */
          .printable-input-text {
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
            text-align: center !important;
            font-weight: bold !important;
            color: black !important;
            box-shadow: none !important;
            outline: none !important;
            -webkit-appearance: none !important;
          }
          
          /* Tajuk dan Border Jadual yang lebih jelas dalam cetakan */
          .print-border-black {
            border-color: #000 !important;
          }
          .print-text-black {
            color: #000 !important;
          }
        }
      `,
        }}
      />

      {/* Tajuk Atas & Pemicu Cetak */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
            Penyata Berkala & Perincian Kitab
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Penyata rasmi bulanan dan tahunan berserta laporan item transaksi
            secara digital.
          </p>
        </div>
        <button
          onClick={kendaliCetak}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer w-full sm:w-auto text-center text-base flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Cetak Dokumen Rasmi
        </button>
      </div>

      {/* Penapis Carian (Sembunyi Semasa Cetak) */}
      <Card className="print:hidden bg-white border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-base">
              Pilih Bulan Laporan
            </label>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-white font-semibold text-gray-800 focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none shadow-sm cursor-pointer">
              <option value="semua">-- Keseluruhan Tahun (Tahunan) --</option>
              {senaraiBulan.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-base">
              Pilih Tahun Laporan
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-white font-semibold text-gray-800 focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none shadow-sm cursor-pointer">
              <option value={tahunSemasa}>{tahunSemasa}</option>
              <option value={tahunSemasa - 1}>{tahunSemasa - 1}</option>
              <option value={tahunSemasa - 2}>{tahunSemasa - 2}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* INPUT EDITOR TANDATANGAN (Sembunyi Semasa Cetak) */}
      <Card
        className="print:hidden bg-amber-50/60 border border-amber-200"
        title="Tetapan Nama Jawatankuasa Bagi Tandatangan">
        <p className="text-xs text-amber-900 font-medium mb-4">
          Isi borang di bawah untuk menukar nama dan tarikh pegawai masjid. Data
          ini akan dicetak terus ke bahagian kaki dokumen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
            <span className="font-bold text-gray-900 block border-b pb-1">
              1. Penyedia (Setiausaha)
            </span>
            <input
              type="text"
              value={penyediaNama}
              onChange={(e) => setPenyediaNama(e.target.value.toUpperCase())}
              placeholder="Nama Penyedia"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={penyediaJawatan}
              onChange={(e) => setPenyediaJawatan(e.target.value.toUpperCase())}
              placeholder="Jawatan"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={penyediaTarikh}
              onChange={(e) => setPenyediaTarikh(e.target.value)}
              placeholder="Tarikh Cetak"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
          </div>

          <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
            <span className="font-bold text-gray-900 block border-b pb-1">
              2. Pemeriksa (Bendahari)
            </span>
            <input
              type="text"
              value={pemeriksaNama}
              onChange={(e) => setPemeriksaNama(e.target.value.toUpperCase())}
              placeholder="Nama Pemeriksa"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={pemeriksaJawatan}
              onChange={(e) =>
                setPemeriksaJawatan(e.target.value.toUpperCase())
              }
              placeholder="Jawatan"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={pemeriksaTarikh}
              onChange={(e) => setPemeriksaTarikh(e.target.value)}
              placeholder="Tarikh Semak"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
          </div>

          <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
            <span className="font-bold text-gray-900 block border-b pb-1">
              3. Pengesah (Pengerusi)
            </span>
            <input
              type="text"
              value={pengesahNama}
              onChange={(e) => setPengesahNama(e.target.value.toUpperCase())}
              placeholder="Nama Pengesah"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={pengesahJawatan}
              onChange={(e) => setPengesahJawatan(e.target.value.toUpperCase())}
              placeholder="Jawatan"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
            <input
              type="text"
              value={pengesahTarikh}
              onChange={(e) => setPengesahTarikh(e.target.value)}
              placeholder="Tarikh Sah"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-600"
            />
          </div>
        </div>
      </Card>

      {/* KOTAK DOKUMEN UTAMA (Sedia Untuk Dicetak Ke Kertas) */}
      <div className="main-report-box bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Kepala Surat (Letterhead) */}
        <div className="text-center border-b-2 border-gray-800 pb-5 mb-6 print-border-black">
          <h2 className="text-lg sm:text-xl font-extrabold uppercase text-gray-900 tracking-wide print-text-black">
            BUKU TUNAI DANA WANG MASJID AL-MUJAHIDIN
          </h2>
          <p className="text-sm text-gray-600 font-bold mt-0.5 print-text-black">
            Kampung Gudon, Kota Kinabalu, Sabah
          </p>
          <p className="text-base font-extrabold text-green-800 bg-green-50 inline-block px-4 py-1 border border-green-200 rounded-lg mt-2.5">
            LAPORAN BAGI:{" "}
            {bulan === "semua"
              ? "KESELURUHAN TAHUNAN"
              : senaraiBulan
                  .find((b) => b.id === bulan)
                  ?.nama.toUpperCase()}{" "}
            {tahun}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 font-bold py-8 animate-pulse print:hidden">
            Menghitung kira-kira penyata kewangan masjid...
          </p>
        ) : dataLaporan.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-8 print-text-black">
            Tiada sebarang rekod aliran wang ditemui pada tempoh yang dipilih.
          </p>
        ) : (
          <div className="space-y-8">
            {/* BAHAGIAN 1: RUMUSAN PECAHAN IKUT TABUNG */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-l-4 border-gray-800 pl-2 print-text-black print-border-black">
                1. Ringkasan Imbangan Dana Tabung
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300 text-sm print-border-black">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300 print-border-black">
                      <th className="p-2.5 border-r border-gray-300 print-border-black">
                        Nama Tabung / Peruntukan
                      </th>
                      <th className="p-2.5 text-right border-r border-gray-300 print-border-black">
                        Jumlah Masuk (RM)
                      </th>
                      <th className="p-2.5 text-right border-r border-gray-300 print-border-black">
                        Jumlah Keluar (RM)
                      </th>
                      <th className="p-2.5 text-right">
                        Baki Bersih Berkala (RM)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-medium divide-y divide-gray-300 print-border-black">
                    {dataLaporan.map((row) => (
                      <tr key={row.tabung_id}>
                        <td className="p-2.5 border-r border-gray-300 print-border-black font-bold text-gray-900 print-text-black">
                          {row.nama_tabung}
                        </td>
                        <td className="p-2.5 text-right border-r border-gray-300 print-border-black text-gray-800 print-text-black">
                          {formatRM(row.total_masuk).replace("RM", "").trim()}
                        </td>
                        <td className="p-2.5 text-right border-r border-gray-300 print-border-black text-gray-800 print-text-black">
                          {formatRM(row.total_keluar).replace("RM", "").trim()}
                        </td>
                        <td className="p-2.5 text-right font-bold text-gray-900 print-text-black">
                          {formatRM(row.baki_bersih).replace("RM", "").trim()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-extrabold text-gray-950 border-t-2 border-gray-800 print-border-black">
                      <td className="p-2.5 border-r border-gray-300 print-border-black uppercase print-text-black">
                        JUMLAH BESAR KESELURUHAN
                      </td>
                      <td className="p-2.5 text-right border-r border-gray-300 print-border-black print-text-black">
                        {formatRM(totalMasuk).replace("RM", "").trim()}
                      </td>
                      <td className="p-2.5 text-right border-r border-gray-300 print-border-black print-text-black">
                        {formatRM(totalKeluar).replace("RM", "").trim()}
                      </td>
                      <td className="p-2.5 text-right underline decoration-double print-text-black">
                        {formatRM(totalBersih)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BAHAGIAN 2: PERINCIAN BUTIRAN TERIMAAN (DUIT MASUK SATU PER SATU) */}
            {bulan !== "semua" && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-l-4 border-gray-800 pl-2 print-text-black print-border-black">
                  2. Perincian Urusniaga Terimaan Tunai / Bank
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-300 text-xs print-border-black">
                    <thead>
                      <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300 print-border-black">
                        <th className="p-2 border-r border-gray-300 print-border-black w-20">
                          Tarikh
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black w-28">
                          No. Resit
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black">
                          Perihal / Keterangan Sumber Duit
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black">
                          Dana Peruntukan
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black w-20 text-center">
                          Kaedah
                        </th>
                        <th className="p-2 text-right w-28">Jumlah (RM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 print-border-black font-medium text-gray-800 print-text-black">
                      {senaraiTerimaan.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-4 text-center text-gray-500 italic">
                            Tiada rekod terimaan bagi bulan ini.
                          </td>
                        </tr>
                      ) : (
                        senaraiTerimaan.map((tx) => (
                          <tr key={tx.id}>
                            <td className="p-2 border-r border-gray-300 print-border-black whitespace-nowrap">
                              {formatTarikh(tx.tarikh)}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black font-mono font-bold text-gray-900 print-text-black">
                              {tx.no_dokumen || "-"}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black text-gray-900 print-text-black">
                              <div>{tx.keterangan}</div>
                              {tx.kaedah === "bank" &&
                                tx.rujukan_bank &&
                                tx.rujukan_bank !== "-" && (
                                  <span className="text-[10px] text-gray-600 block font-normal print-text-black">
                                    Ruj Bank: {tx.rujukan_bank}
                                  </span>
                                )}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black font-semibold text-gray-900 print-text-black">
                              {tx.tabung?.nama || "Umum"}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black text-center uppercase text-[10px] font-bold text-gray-900 print-text-black">
                              {tx.kaedah === "bank" ? "BANK" : "TUNAI"}
                            </td>
                            <td className="p-2 text-right font-bold text-gray-900 print-text-black">
                              {formatRM(tx.jumlah).replace("RM", "").trim()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BAHAGIAN 3: PERINCIAN BUTIRAN BAYARAN (DUIT KELUAR SATU PER SATU) */}
            {bulan !== "semua" && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-l-4 border-gray-800 pl-2 print-text-black print-border-black">
                  3. Perincian Urusniaga Bayaran / Pembekal
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-300 text-xs print-border-black">
                    <thead>
                      <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300 print-border-black">
                        <th className="p-2 border-r border-gray-300 print-border-black w-20">
                          Tarikh
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black w-28">
                          No. Baucer
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black">
                          Pembekal / Penerima / Tujuan Perbelanjaan
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black">
                          Dana Terlibat
                        </th>
                        <th className="p-2 border-r border-gray-300 print-border-black w-20 text-center">
                          Kaedah
                        </th>
                        <th className="p-2 text-right w-28">Jumlah (RM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 print-border-black font-medium text-gray-800 print-text-black">
                      {senaraiBayaran.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-4 text-center text-gray-500 italic">
                            Tiada rekod bayaran keluar bagi bulan ini.
                          </td>
                        </tr>
                      ) : (
                        senaraiBayaran.map((tx) => (
                          <tr key={tx.id}>
                            <td className="p-2 border-r border-gray-300 print-border-black whitespace-nowrap">
                              {formatTarikh(tx.tarikh)}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black font-mono font-bold text-gray-900 print-text-black">
                              {tx.no_dokumen || "-"}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black">
                              <div className="font-bold text-gray-900 print-text-black">
                                {tx.pemohon && tx.pemohon !== "-"
                                  ? tx.pemohon
                                  : "Penerima Am"}
                              </div>
                              <div className="text-gray-700 text-[11px] print-text-black">
                                {tx.keterangan}
                              </div>
                              {tx.kaedah === "bank" &&
                                tx.rujukan_bank &&
                                tx.rujukan_bank !== "-" && (
                                  <span className="text-[10px] text-gray-600 block font-normal print-text-black">
                                    Ruj Bank: {tx.rujukan_bank}
                                  </span>
                                )}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black font-semibold text-gray-900 print-text-black">
                              {tx.tabung?.nama || "Umum"}
                            </td>
                            <td className="p-2 border-r border-gray-300 print-border-black text-center uppercase text-[10px] font-bold text-gray-900 print-text-black">
                              {tx.kaedah === "bank" ? "BANK" : "TUNAI"}
                            </td>
                            <td className="p-2 text-right font-bold text-gray-900 print-text-black">
                              {formatRM(tx.jumlah).replace("RM", "").trim()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KAKI DOKUMEN: TRADITIONAL SIGNATURE BLOCK */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-6 text-xs font-bold text-center border-t border-gray-300 print-border-black pt-8 print-text-black">
          {/* Ruangan Setiausaha */}
          <div className="flex flex-col items-center justify-between h-36">
            <span className="uppercase text-gray-900 print-text-black">
              DISEDIAKAN OLEH,
            </span>
            <div className="w-full max-w-[180px] border-b border-gray-800 print-border-black mt-auto mb-1 relative">
              <input
                type="text"
                value={penyediaNama}
                onChange={(e) => setPenyediaNama(e.target.value)}
                className="printable-input-text w-full text-center"
              />
            </div>
            <div className="space-y-0.5 w-full">
              <div className="text-[10px] text-gray-700 font-bold print-text-black">
                Jawatan: {penyediaJawatan}
              </div>
              <div className="text-[10px] text-gray-600 print-text-black">
                Tarikh: {penyediaTarikh || "-"}
              </div>
            </div>
          </div>

          {/* Ruangan Bendahari */}
          <div className="flex flex-col items-center justify-between h-36">
            <span className="uppercase text-gray-900 print-text-black">
              DISEMAK OLEH,
            </span>
            <div className="w-full max-w-[180px] border-b border-gray-800 print-border-black mt-auto mb-1 relative">
              <input
                type="text"
                value={pemeriksaNama}
                onChange={(e) => setPemeriksaNama(e.target.value)}
                className="printable-input-text w-full text-center"
              />
            </div>
            <div className="space-y-0.5 w-full">
              <div className="text-[10px] text-gray-700 font-bold print-text-black">
                Jawatan: {pemeriksaJawatan}
              </div>
              <div className="text-[10px] text-gray-600 print-text-black">
                Tarikh: {pemeriksaTarikh || "-"}
              </div>
            </div>
          </div>

          {/* Ruangan Pengerusi */}
          <div className="flex flex-col items-center justify-between h-36">
            <span className="uppercase text-gray-900 print-text-black">
              DISAHKAN BENAR OLEH,
            </span>
            <div className="w-full max-w-[180px] border-b border-gray-800 print-border-black mt-auto mb-1 relative">
              <input
                type="text"
                value={pengesahNama}
                onChange={(e) => setPengesahNama(e.target.value)}
                className="printable-input-text w-full text-center"
              />
            </div>
            <div className="space-y-0.5 w-full">
              <div className="text-[10px] text-gray-700 font-bold print-text-black">
                Jawatan: {pengesahJawatan}
              </div>
              <div className="text-[10px] text-gray-600 print-text-black">
                Tarikh: {pengesahTarikh || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
