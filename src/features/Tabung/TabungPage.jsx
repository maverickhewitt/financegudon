import React, { useState } from "react";
import { useTabung } from "../../hooks/useTabung";
import { TabungCard } from "./components/TabungCard";
import { AddTabungForm } from "./components/AddTabungForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const TabungPage = () => {
  const { bakiTabung, loading, error, addTabung, updateTabung, deleteTabung } =
    useTabung();

  const [modalTambahBuka, setModalTambahBuka] = useState(false);
  const [modalEditBuka, setModalEditBuka] = useState(false);
  const [modalPadamBuka, setModalPadamBuka] = useState(false);

  const [tabungTerpilih, setTabungTerpilih] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editPenerangan, setEditPenerangan] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorAksi, setErrorAksi] = useState("");

  const kendaliSimpanTabung = async (nama, penerangan) => {
    const hasil = await addTabung(nama, penerangan);
    if (hasil.success) setModalTambahBuka(false);
    return hasil;
  };

  const cetusEdit = (tabung) => {
    setErrorAksi("");
    setTabungTerpilih(tabung);
    setEditNama(tabung.nama_tabung);
    setEditPenerangan(tabung.penerangan || "");
    setModalEditBuka(true);
  };

  const kendaliKemaskini = async (e) => {
    e.preventDefault();
    setErrorAksi("");
    setSubmitting(true);

    const hasil = await updateTabung(
      tabungTerpilih.tabung_id,
      editNama,
      editPenerangan,
    );
    setSubmitting(false);

    if (hasil.success) {
      setModalEditBuka(false);
    } else {
      setErrorAksi(hasil.error || "Gagal mengemaskini maklumat.");
    }
  };

  const cetusPadam = (tabung) => {
    setErrorAksi("");
    setTabungTerpilih(tabung);
    setModalPadamBuka(true);
  };

  const kendaliPadam = async () => {
    setErrorAksi("");
    setSubmitting(true);

    const hasil = await deleteTabung(tabungTerpilih.tabung_id);
    setSubmitting(false);

    if (hasil.success) {
      setModalPadamBuka(false);
    } else {
      setErrorAksi(hasil.error);
    }
  };

  if (loading && bakiTabung.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold text-lg animate-pulse">
          Memuatkan tabung-tabung kampung...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Penerangan Jawatankuasa */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
            Pecahan Tabung Khusus Masjid
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Senarai akaun agihan wang asing (Tabung Jumaat, Kebajikan, Anak
            Yatim) di Kampung Gudon.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalTambahBuka(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Bina Tabung Baru</span>
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 font-semibold">
          Ralat Sistem: {error}
        </div>
      )}

      {/* Grid Kad Akaun */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {bakiTabung.map((item) => (
          <TabungCard
            key={item.tabung_id}
            tabung={item}
            onEdit={cetusEdit}
            onDelete={cetusPadam}
          />
        ))}
      </div>

      {/* Modal 1: Bina Tabung */}
      <Modal
        isOpen={modalTambahBuka}
        onClose={() => setModalTambahBuka(false)}
        title="Daftarkan Tabung Kampung Baru">
        <AddTabungForm
          onSave={kendaliSimpanTabung}
          onCancel={() => setModalTambahBuka(false)}
        />
      </Modal>

      {/* Modal 2: Edit Tabung */}
      <Modal
        isOpen={modalEditBuka}
        onClose={() => setModalEditBuka(false)}
        title="Kemaskini Maklumat Nama Dana">
        <form onSubmit={kendaliKemaskini} className="flex flex-col gap-4">
          <Input
            label="Nama Tabung / Peruntukan"
            id="edit_nama"
            value={editNama}
            onChange={(e) => setEditNama(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-bold text-base">
              Penerangan / Catatan Tambahan (Pilihan)
            </label>
            <textarea
              rows="3"
              value={editPenerangan}
              onChange={(e) => setEditPenerangan(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-50 font-semibold text-gray-800 shadow-sm"
              placeholder="Tulis perihal kegunaan dana utama tabung ini"
            />
          </div>
          {errorAksi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-3 rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5 text-rose-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errorAksi}</span>
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setModalEditBuka(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Perubahan Nama"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Padam Tabung */}
      <Modal
        isOpen={modalPadamBuka}
        onClose={() => setModalPadamBuka(false)}
        title="Sahkan Pemadaman Tabung">
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            Adakah anda benar-benar pasti mahu membuang tabung bernama{" "}
            <strong className="text-gray-900 font-extrabold">
              "{tabungTerpilih?.nama_tabung}"
            </strong>
            ? Rekod ini tidak boleh dikembalikan semula selepas dipadam.
          </p>

          {errorAksi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold p-4 rounded-xl flex items-center gap-2 leading-relaxed">
              <svg
                className="w-5 h-5 text-rose-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errorAksi}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setModalPadamBuka(false)}
              disabled={submitting}>
              Jangan Padam (Batal)
            </Button>
            <button
              type="button"
              onClick={kendaliPadam}
              disabled={submitting}
              className="px-5 py-3.5 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer text-center disabled:opacity-50 text-base w-full sm:w-auto">
              {submitting ? "Memadam..." : "Ya, Saya Pasti Mahu Padam"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
