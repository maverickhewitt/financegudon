import React, { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export const AddTabungForm = ({ onSave, onCancel }) => {
  const [nama, setNama] = useState("");
  const [penerangan, setPenerangan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorBorang, setErrorBorang] = useState("");

  const kendaliHantar = async (e) => {
    e.preventDefault();
    setErrorBorang("");

    if (!nama.trim()) {
      setErrorBorang("Sila masukkan nama tabung.");
      return;
    }

    setSubmitting(true);
    const hasil = await onSave(nama, penerangan);
    setSubmitting(false);

    if (hasil.success) {
      setNama("");
      setPenerangan("");
    } else {
      setErrorBorang(
        hasil.error?.includes("duplicate")
          ? "Nama tabung ini sudah wujud! Sila gunakan nama lain."
          : hasil.error || "Gagal menyimpan tabung baru.",
      );
    }
  };

  return (
    <form onSubmit={kendaliHantar} className="flex flex-col gap-4">
      <Input
        label="Nama Tabung / Dana Baru"
        id="nama_tabung"
        placeholder="Contoh: Tabung Anak Yatim, Tabung Kebajikan"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
        disabled={submitting}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="penerangan_tabung"
          className="text-gray-700 font-bold text-base">
          Penerangan / Tujuan Tabung
        </label>
        <textarea
          id="penerangan_tabung"
          rows="3"
          placeholder="Tulis tujuan dana ini diwujudkan secara ringkas"
          value={penerangan}
          onChange={(e) => setPenerangan(e.target.value)}
          disabled={submitting}
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-50 font-semibold text-gray-800 shadow-sm"
        />
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
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Sedang Menyimpan..." : "Sahkan Tabung Baru"}
        </Button>
      </div>
    </form>
  );
};
