import React, { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export const TransactionForm = ({ tabungList = [], onSave, onCancel }) => {
  const [tarikh, setTarikh] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState("masuk"); // Default kepada Duit Masuk
  const [tabungId, setTabungId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorBorang, setErrorBorang] = useState("");

  const hantarBorang = async (e) => {
    e.preventDefault();
    setErrorBorang("");

    if (!tabungId) {
      setErrorBorang("Sila pilih jenis tabung terlebih dahulu.");
      return;
    }
    if (!jumlah || Number(jumlah) <= 0) {
      setErrorBorang("Sila masukkan jumlah wang yang sah (lebih dari RM 0).");
      return;
    }
    if (!keterangan.trim()) {
      setErrorBorang("Sila tulis keterangan atau tujuan transaksi.");
      return;
    }

    setSubmitting(true);

    const hasil = await onSave({
      tabung_id: tabungId,
      tarikh,
      jenis,
      jumlah: parseFloat(jumlah),
      keterangan: keterangan.trim(),
    });

    setSubmitting(false);

    if (!hasil.success) {
      setErrorBorang(hasil.error || "Gagal menyimpan rekod.");
    }
  };

  return (
    <form onSubmit={hantarBorang} className="flex flex-col gap-2">
      {/* 1. PILIHAN JENIS DUIT (MASUK / KELUAR) */}
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-gray-750 font-bold text-sm sm:text-base">
          Kategori Transaksi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setJenis("masuk")}
            className={`py-3 rounded-xl font-black text-center text-sm sm:text-base border-2 transition-all cursor-pointer
              ${
                jenis === "masuk"
                  ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }
            `}>
            📥 DUIT MASUK
          </button>
          <button
            type="button"
            onClick={() => setJenis("keluar")}
            className={`py-3 rounded-xl font-black text-center text-sm sm:text-base border-2 transition-all cursor-pointer
              ${
                jenis === "keluar"
                  ? "bg-rose-50 border-rose-600 text-rose-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }
            `}>
            📤 DUIT KELUAR
          </button>
        </div>
      </div>

      {/* 2. PILIHAN TABUNG DANA */}
      <div className="flex flex-col gap-2 mb-4">
        <label
          htmlFor="tabung-select"
          className="text-gray-750 font-bold text-sm sm:text-base">
          Simpan / Tolak Dari Tabung <span className="text-rose-500">*</span>
        </label>
        <select
          id="tabung-select"
          value={tabungId}
          onChange={(e) => setTabungId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-gray-800">
          <option value="">-- Sila Pilih Tabung Kampung --</option>
          {tabungList.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nama}
            </option>
          ))}
        </select>
      </div>

      {/* 3. TARIKH & JUMLAH WANG */}
      <Input
        label="Tarikh Transaksi"
        id="tarikh"
        type="date"
        value={tarikh}
        onChange={(e) => setTarikh(e.target.value)}
        required
      />

      <Input
        label="Jumlah Wang (RM)"
        id="jumlah"
        type="number"
        step="0.01"
        placeholder="Contoh: 350.00"
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
        required
      />

      {/* 4. KETERANGAN / REKOD NOTA */}
      <div className="flex flex-col gap-2 mb-4">
        <label
          htmlFor="keterangan"
          className="text-gray-750 font-bold text-sm sm:text-base">
          Keterangan / Tujuan <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="keterangan"
          rows="3"
          placeholder="Tulis tujuan (Contoh: Kutipan sumbangan jumaat / Bayaran bil elektrik surau)"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
        />
      </div>

      {/* PAPARAN RALAT BORANG */}
      {errorBorang && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-3 rounded-lg mb-2">
          ⚠️ {errorBorang}
        </div>
      )}

      {/* BUTANG AKSI HANTAR */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-2 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </Button>
        <Button
          type="submit"
          variant={jenis === "masuk" ? "masuk" : "keluar"}
          disabled={submitting}>
          {submitting
            ? "Sedang Disimpan..."
            : `Sahkan Rekod ${jenis === "masuk" ? "Masuk" : "Keluar"}`}
        </Button>
      </div>
    </form>
  );
};
