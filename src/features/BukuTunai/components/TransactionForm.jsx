import React, { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { compressReceipt } from "../../../utils/compressor";
import { supabase } from "../../../lib/supabaseClient";

export const TransactionForm = ({ tabungList = [], onSave, onCancel }) => {
  const [tarikh, setTarikh] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState("masuk");
  const [tabungId, setTabungId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorBorang, setErrorBorang] = useState("");

  const kendaliFailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setErrorBorang("");
      const compressed = await compressReceipt(file);
      setSelectedFile(compressed);
      setFilePreview(URL.createObjectURL(compressed));
    } catch (err) {
      setErrorBorang("Gagal memproses imej. Sila cuba fail lain.");
    }
  };

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
    let urlResit = null;

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const pathFail = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resit")
          .upload(pathFail, selectedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("resit").getPublicUrl(pathFail);
        urlResit = data.publicUrl;
      }

      const hasil = await onSave({
        tabung_id: tabungId,
        tarikh,
        jenis,
        jumlah: parseFloat(jumlah),
        keterangan: keterangan.trim(),
        url_resit: urlResit,
      });

      if (!hasil.success) {
        setErrorBorang(hasil.error || "Gagal menyimpan rekod.");
      }
    } catch (err) {
      setErrorBorang(`Masalah muat naik fail resit: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={hantarBorang} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-bold text-base">
          Kategori Transaksi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setJenis("masuk")}
            className={`py-3.5 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer ${
              jenis === "masuk"
                ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            Duit Masuk
          </button>
          <button
            type="button"
            onClick={() => setJenis("keluar")}
            className={`py-3.5 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer ${
              jenis === "keluar"
                ? "bg-rose-50 border-rose-600 text-rose-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            Duit Keluar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="tabung-select"
          className="text-gray-700 font-bold text-base">
          Simpan / Tolak Dari Tabung <span className="text-rose-600">*</span>
        </label>
        <select
          id="tabung-select"
          value={tabungId}
          onChange={(e) => setTabungId(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none font-semibold text-gray-800 shadow-sm">
          <option value="">-- Sila Pilih Tabung Kampung --</option>
          {tabungList.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nama}
            </option>
          ))}
        </select>
      </div>

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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="keterangan"
          className="text-gray-700 font-bold text-base">
          Keterangan / Tujuan <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="keterangan"
          rows="3"
          placeholder="Tulis tujuan transaksi secara jelas"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-50 font-semibold text-gray-800 shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2 border-2 border-dashed border-gray-200 p-4 rounded-xl bg-gray-50/50">
        <label className="text-gray-700 font-bold text-base">
          Muat Naik Resit / Bukti Fail (Pilihan)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={kendaliFailChange}
          className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer text-gray-500"
        />
        {filePreview && (
          <div className="mt-3 relative w-24 h-24 border rounded-xl overflow-hidden bg-white">
            <img
              src={filePreview}
              alt="Preview Resit"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {errorBorang && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-3 rounded-xl">
          {errorBorang}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </Button>
        <Button
          type="submit"
          variant={jenis === "masuk" ? "masuk" : "keluar"}
          disabled={submitting}>
          {submitting ? "Sedang Disimpan..." : "Sahkan Rekod"}
        </Button>
      </div>
    </form>
  );
};
