import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { compressReceipt } from "../../../utils/compressor";
import { supabase } from "../../../lib/supabaseClient";

export const TransactionForm = ({
  tabungList = [],
  onSave,
  onCancel,
  editData = null,
}) => {
  const [tarikh, setTarikh] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState("masuk");
  const [kaedah, setKaedah] = useState("cash");
  const [tabungId, setTabungId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [noDokumen, setNoDokumen] = useState("");
  const [pemohon, setPemohon] = useState("");
  const [rujukanBank, setRujukanBank] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorBorang, setErrorBorang] = useState("");

  useEffect(() => {
    if (editData) {
      setTarikh(editData.tarikh || "");
      setJenis(editData.jenis || "masuk");
      setKaedah(editData.kaedah || "cash");
      setTabungId(editData.tabung_id || "");
      setJumlah(editData.jumlah || "");
      setKeterangan(editData.keterangan || "");
      setNoDokumen(editData.no_dokumen || "");
      setPemohon(editData.pemohon || "");
      setRujukanBank(editData.rujukan_bank || "");
      if (editData.url_resit) {
        setFilePreview(editData.url_resit);
      }
    }
  }, [editData]);

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

    // Minimum critical requirements to maintain database integrity
    if (!tabungId) {
      setErrorBorang("Sila pilih dana tabung.");
      return;
    }
    if (!jumlah || Number(jumlah) <= 0) {
      setErrorBorang("Sila masukkan jumlah wang yang sah.");
      return;
    }

    setSubmitting(true);
    let urlResit = editData?.url_resit || null;

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

      // Dynamic default text fallback if non-technical users leave description blank
      const finalKeterangan = keterangan.trim()
        ? keterangan.trim()
        : jenis === "masuk"
          ? "Terimaan Am"
          : "Bayaran Am";

      const payload = {
        tabung_id: tabungId,
        tarikh,
        jenis,
        kaedah,
        jumlah: parseFloat(jumlah),
        keterangan: finalKeterangan,
        no_dokumen: noDokumen.trim() || "-",
        pemohon: jenis === "keluar" ? pemohon.trim() || "-" : "",
        rujukan_bank: kaedah === "bank" ? rujukanBank.trim() || "-" : "",
        url_resit: urlResit,
      };

      const hasil = await onSave(payload);
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
      {/* Aliran Wang Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-bold text-base">Aliran Wang</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setJenis("masuk")}
            className={`py-3 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              jenis === "masuk"
                ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 13l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span>Terimaan Duit</span>
          </button>
          <button
            type="button"
            onClick={() => setJenis("keluar")}
            className={`py-3 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              jenis === "keluar"
                ? "bg-rose-50 border-rose-600 text-rose-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 11l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span>Bayaran Keluar</span>
          </button>
        </div>
      </div>

      {/* Kaedah Transaksi Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-bold text-base">
          Kaedah Transaksi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setKaedah("cash")}
            className={`py-3 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              kaedah === "cash"
                ? "bg-green-50 border-green-600 text-green-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <span>Tunai / Cash</span>
          </button>
          <button
            type="button"
            onClick={() => setKaedah("bank")}
            className={`py-3 px-4 rounded-xl font-bold text-center text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              kaedah === "bank"
                ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <span>Bank-In / Transfer</span>
          </button>
        </div>
      </div>

      {/* Core Numbers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tarikh Rekod"
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
          placeholder="0.00"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          required
        />
      </div>

      {/* Dropdown & Dynamic Document Label Matching */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="tabung-select"
            className="text-gray-700 font-bold text-base">
            Pilihan Tabung Peruntukan
          </label>
          <div className="relative">
            <select
              id="tabung-select"
              value={tabungId}
              onChange={(e) => setTabungId(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none font-semibold text-gray-800 shadow-sm appearance-none">
              <option value="">-- Pilih Tabung --</option>
              {tabungList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <Input
          label={
            jenis === "masuk" ? "No. Resit (Pilihan)" : "No. Baucer (Pilihan)"
          }
          id="noDokumen"
          type="text"
          placeholder={
            jenis === "masuk"
              ? "Contoh: MAM0001/2026"
              : "Contoh: KEW.MAM/0001/2026"
          }
          value={noDokumen}
          onChange={(e) => setNoDokumen(e.target.value)}
        />
      </div>

      {/* Dynamic Recipient Name Layout based on Document Type */}
      {jenis === "keluar" && (
        <Input
          label="Pembekal / Penerima (Pilihan)"
          id="pemohon"
          type="text"
          placeholder="Nama individu, syarikat atau biro khidmat berkaitan"
          value={pemohon}
          onChange={(e) => setPemohon(e.target.value)}
        />
      )}

      {/* Highlighted Bank Contextual Interface Segment */}
      {kaedah === "bank" && (
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col gap-1">
          <Input
            label="Maklumat / Perihal Transaksi Bank (Pilihan)"
            id="rujukanBank"
            type="text"
            placeholder="Contoh: Kedudukan Bank Islam / Instant Transfer Ref"
            value={rujukanBank}
            onChange={(e) => setRujukanBank(e.target.value)}
            className="bg-white"
          />
        </div>
      )}

      {/* Description Context Label */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="keterangan"
          className="text-gray-700 font-bold text-base">
          Perihal / Tujuan (Pilihan)
        </label>
        <textarea
          id="keterangan"
          rows="2"
          placeholder="Tulis butiran keterangan ringkas jika ada"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-50 font-semibold text-gray-800 shadow-sm"
        />
      </div>

      {/* Receipt Image File Handling */}
      <div className="flex flex-col gap-2 border-2 border-dashed border-gray-200 p-4 rounded-xl bg-gray-50/50">
        <label className="text-gray-700 font-bold text-base flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 011.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Lampiran Dokumen Bukti / Resit (Pilihan)</span>
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={kendaliFailChange}
          className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer text-gray-500"
        />
        {filePreview && (
          <div className="mt-3 relative w-20 h-20 border rounded-xl overflow-hidden bg-white shadow-sm">
            <img
              src={filePreview}
              alt="Preview"
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

      {/* Submission Triggers */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? "Menyimpan..."
            : editData
              ? "Kemaskini Rekod"
              : "Sahkan Rekod"}
        </Button>
      </div>
    </form>
  );
};
