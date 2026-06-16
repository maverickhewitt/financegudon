import React, { useState } from "react";
import { formatRM, formatTarikh } from "../../../utils/formatters";

// Komponen Ikon SVG
const PencilIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const BankIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
    />
  </svg>
);

const CashIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  onSahkanBendahari,
  onSahkanPengerusi,
  userRole,
}) => {
  const tarikhSemasa = new Date();
  const [bulan, setBulan] = useState((tarikhSemasa.getMonth() + 1).toString());
  const [tahun, setTahun] = useState(tarikhSemasa.getFullYear().toString());
  // FILTER BARU: State untuk menapis mengikut jenis Tabung
  const [tabungTerpilih, setTabungTerpilih] = useState("semua");

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

  // Mendapatkan senarai unik tabung daripada data transaksi yang sedia ada
  const senaraiTabungUnik = Array.from(
    new Set(transactions.map((tx) => tx.tabung_id)),
  ).map((id) => {
    const tx = transactions.find((t) => t.tabung_id === id);
    return {
      id: id || "tiada",
      nama: tx?.tabung?.nama || "Umum (Tiada Tabung)",
    };
  });

  const sasaranTahunStr = tahun;
  const sasaranBulanStr = bulan.padStart(2, "0");

  // Penapisan 3 Lapis: Tarikh + Bulan + Tabung
  const transaksiBulanIni = transactions.filter((tx) => {
    if (!tx.tarikh) return false;
    const komponenTarikh = tx.tarikh.split("-");
    const padanTarikh =
      komponenTarikh[0] === sasaranTahunStr &&
      komponenTarikh[1] === sasaranBulanStr;

    const txTabungId = tx.tabung_id || "tiada";
    const padanTabung =
      tabungTerpilih === "semua" || txTabungId === tabungTerpilih;

    return padanTarikh && padanTabung;
  });

  // Kiraan baki bawa ke hadapan juga mesti bergantung kepada filter tabung
  const bakiBawaHadapanDinamik = transactions.reduce((bakiAkumulasi, tx) => {
    if (!tx.tarikh) return bakiAkumulasi;

    // Tapis tabung untuk baki terdahulu
    const txTabungId = tx.tabung_id || "tiada";
    if (tabungTerpilih !== "semua" && txTabungId !== tabungTerpilih) {
      return bakiAkumulasi;
    }

    const komponenTarikh = tx.tarikh.split("-");
    const txTahun = parseInt(komponenTarikh[0]);
    const txBulan = parseInt(komponenTarikh[1]);

    const pilihTahun = parseInt(sasaranTahunStr);
    const pilihBulan = parseInt(sasaranBulanStr);

    if (
      txTahun < pilihTahun ||
      (txTahun === pilihTahun && txBulan < pilihBulan)
    ) {
      if (tx.jenis === "masuk") return bakiAkumulasi + Number(tx.jumlah || 0);
      if (tx.jenis === "keluar") return bakiAkumulasi - Number(tx.jumlah || 0);
    }
    return bakiAkumulasi;
  }, 0);

  return (
    <div className="w-full space-y-4">
      {/* PENAPISAN (FILTER) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="text-sm font-bold text-gray-950 tracking-wide">
            Tapis Rekod Kitab Bulanan
          </h4>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Pilih bulan dan spesifik tabung untuk menyemak pecahan urusniaga
            terperinci.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0">
          <select
            value={tabungTerpilih}
            onChange={(e) => setTabungTerpilih(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-emerald-300 bg-emerald-50 rounded-xl font-bold text-sm text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-sm cursor-pointer">
            <option value="semua">-- Semua Tabung --</option>
            {senaraiTabungUnik.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama}
              </option>
            ))}
          </select>

          <select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-xl bg-white font-bold text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-50 shadow-sm cursor-pointer">
            {senaraiBulan.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama}
              </option>
            ))}
          </select>

          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-xl bg-white font-bold text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-50 shadow-sm cursor-pointer">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-green-800 tracking-wider uppercase">
            Baki Bawa Ke Hadapan{" "}
            {tabungTerpilih !== "semua" ? "(Tabung Pilihan)" : "(Semua Tabung)"}
          </span>
          <span className="text-sm font-medium text-gray-500 mt-0.5">
            Nilai permulaan bagi rekod permulaan 01/{sasaranBulanStr}/
            {sasaranTahunStr}
          </span>
        </div>
        <span className="text-xl font-bold text-gray-900">
          {formatRM(bakiBawaHadapanDinamik)}
        </span>
      </div>

      {transaksiBulanIni.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400 font-medium">
          Tiada sebarang rekod aliran tunai atau bank dicatatkan pada bulan{" "}
          {senaraiBulan.find((b) => b.id === bulan)?.nama} {tahun} untuk carian
          ini.
        </div>
      )}

      {/* PAPARAN SENARAI KAD RESPONSIF (UNTUK SMARTPHONE) */}
      {transaksiBulanIni.length > 0 && (
        <div className="block lg:hidden space-y-3">
          {transaksiBulanIni.map((tx) => {
            const isMasuk = tx.jenis === "masuk";
            return (
              <div
                key={tx.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center gap-2 text-xs">
                  <span className="text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-semibold">
                    {formatTarikh(tx.tarikh)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide border ${tx.kaedah === "bank" ? "bg-blue-50 text-blue-800 border-blue-100" : "bg-amber-50 text-amber-800 border-amber-100"}`}>
                    {tx.kaedah === "bank" ? (
                      <>
                        <BankIcon /> Bank
                      </>
                    ) : (
                      <>
                        <CashIcon /> Tunai
                      </>
                    )}
                  </span>
                </div>

                <div className="text-base font-bold text-gray-900 leading-snug">
                  {tx.keterangan}
                  {tx.no_dokumen && tx.no_dokumen !== "-" && (
                    <span className="block text-xs text-gray-400 font-mono mt-1">
                      No. Dokumen: {tx.no_dokumen}
                    </span>
                  )}
                  {tx.kaedah === "bank" &&
                    tx.rujukan_bank &&
                    tx.rujukan_bank !== "-" && (
                      <span className="block text-xs text-blue-700 font-medium mt-0.5">
                        Perihal Bank: {tx.rujukan_bank}
                      </span>
                    )}
                  {tx.pemohon && tx.pemohon !== "-" && (
                    <span className="block text-xs text-amber-800 font-bold mt-0.5">
                      Penerima/Pembekal: {tx.pemohon}
                    </span>
                  )}
                  <div className="text-xs text-emerald-900 font-semibold mt-1">
                    Tabung: {tx.tabung?.nama || "Umum"}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100 text-xs">
                  <span
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-md font-bold w-max ${tx.disemak_bendahari ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {tx.disemak_bendahari ? <CheckIcon /> : <ClockIcon />}
                    {tx.disemak_bendahari
                      ? "Disemak Bendahari"
                      : "Menunggu Semakan"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-md font-bold w-max ${tx.disahkan_pengerusi ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
                    {tx.disahkan_pengerusi ? <CheckIcon /> : <ClockIcon />}
                    {tx.disahkan_pengerusi
                      ? "Disahkan Pengerusi"
                      : "Menunggu Kelulusan"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {!tx.disahkan_pengerusi && (
                      <>
                        <button
                          onClick={() => onEdit(tx)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-green-700 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer font-bold inline-flex items-center">
                          <PencilIcon />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(tx)}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 rounded-xl border border-rose-200 cursor-pointer font-bold inline-flex items-center">
                          <TrashIcon />
                          <span>Padam</span>
                        </button>
                      </>
                    )}
                    {userRole === "bendahari" && !tx.disemak_bendahari && (
                      <button
                        onClick={() => onSahkanBendahari(tx.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs cursor-pointer">
                        Semak
                      </button>
                    )}
                    {userRole === "pengerusi" &&
                      tx.disemak_bendahari &&
                      !tx.disahkan_pengerusi && (
                        <button
                          onClick={() => onSahkanPengerusi(tx.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer">
                          Sahkan
                        </button>
                      )}
                  </div>
                  <div
                    className={`text-lg font-bold whitespace-nowrap ml-2 ${isMasuk ? "text-emerald-600" : "text-rose-600"}`}>
                    {isMasuk ? "+ " : "- "}RM{" "}
                    {formatRM(tx.jumlah).replace("RM", "").trim()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAPARAN MATRIKS JADUAL BESAR (UNTUK DESKTOP) */}
      {transaksiBulanIni.length > 0 && (
        <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-bold tracking-wide">
                <tr>
                  <th className="p-4">Tarikh</th>
                  <th className="p-4">No Dokumen</th>
                  <th className="p-4">Keterangan / Perihal / Penerima</th>
                  <th className="p-4">Kaedah</th>
                  <th className="p-4">Jenis</th>
                  <th className="p-4">Status Pengesahan</th>
                  <th className="p-4 text-center">Tindakan</th>
                  <th className="p-4 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800 font-medium">
                {transaksiBulanIni.map((tx) => {
                  const isMasuk = tx.jenis === "masuk";
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {formatTarikh(tx.tarikh)}
                      </td>
                      <td className="p-4 text-gray-900 font-mono text-xs font-bold">
                        {tx.no_dokumen || "-"}
                      </td>
                      <td className="p-4 max-w-sm break-words">
                        <div className="font-bold text-gray-955">
                          {tx.keterangan}
                        </div>
                        {tx.kaedah === "bank" &&
                          tx.rujukan_bank &&
                          tx.rujukan_bank !== "-" && (
                            <div className="text-xs text-blue-700 font-semibold mt-0.5">
                              Bank Ref: {tx.rujukan_bank}
                            </div>
                          )}
                        {tx.pemohon && tx.pemohon !== "-" && (
                          <div className="text-xs text-amber-800 font-bold mt-0.5">
                            Penerima: {tx.pemohon}
                          </div>
                        )}
                        <div className="text-xs text-emerald-900 font-bold mt-0.5">
                          Tabung: {tx.tabung?.nama || "Umum"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold ${tx.kaedah === "bank" ? "bg-blue-50 text-blue-800 border border-blue-100" : "bg-amber-50 text-amber-800 border border-amber-100"}`}>
                          {tx.kaedah === "bank" ? (
                            <>
                              <BankIcon /> BANK
                            </>
                          ) : (
                            <>
                              <CashIcon /> TUNAI
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-xs font-bold tracking-wide ${isMasuk ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {isMasuk ? "TERIMAAN" : "BAYARAN"}
                        </span>
                      </td>
                      <td className="p-4 space-y-1.5">
                        <div
                          className={`text-xs flex items-center ${tx.disemak_bendahari ? "text-green-800 font-bold" : "text-gray-400 font-medium"}`}>
                          {tx.disemak_bendahari ? <CheckIcon /> : <ClockIcon />}
                          <span>Disemak Bendahari</span>
                        </div>
                        <div
                          className={`text-xs flex items-center ${tx.disahkan_pengerusi ? "text-emerald-800 font-bold" : "text-gray-400 font-medium"}`}>
                          {tx.disahkan_pengerusi ? (
                            <CheckIcon />
                          ) : (
                            <ClockIcon />
                          )}
                          <span>Disahkan Pengerusi</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {!tx.disahkan_pengerusi && (
                            <>
                              <button
                                onClick={() => onEdit(tx)}
                                className="px-2.5 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-bold cursor-pointer inline-flex items-center">
                                <PencilIcon />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => onDelete(tx)}
                                className="px-2.5 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold cursor-pointer inline-flex items-center">
                                <TrashIcon />
                                <span>Padam</span>
                              </button>
                            </>
                          )}
                          {userRole === "bendahari" &&
                            !tx.disemak_bendahari && (
                              <button
                                onClick={() => onSahkanBendahari(tx.id)}
                                className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg font-bold cursor-pointer hover:bg-green-700">
                                Semak
                              </button>
                            )}
                          {userRole === "pengerusi" &&
                            tx.disemak_bendahari &&
                            !tx.disahkan_pengerusi && (
                              <button
                                onClick={() => onSahkanPengerusi(tx.id)}
                                className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-bold cursor-pointer hover:bg-emerald-700">
                                Sahkan
                              </button>
                            )}
                        </div>
                      </td>
                      <td
                        className={`p-4 text-right font-bold text-base whitespace-nowrap ${isMasuk ? "text-emerald-600" : "text-rose-600"}`}>
                        {isMasuk ? "+ " : "- "}RM{" "}
                        {formatRM(tx.jumlah).replace("RM", "").trim()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
