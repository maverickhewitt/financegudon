import React, { useState } from "react";
import { useTabung } from "../../hooks/useTabung";
import { TabungCard } from "./components/TabungCard";
import { AddTabungForm } from "./components/AddTabungForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const TabungPage = () => {
  const {
    bakiTabung,
    loading,
    error,
    addTabung,
    updateTabung,
    deleteTabung,
    refreshTabung,
  } = useTabung();

  // States Pengurusan Modal & Borang
  const [modalTambahBuka, setModalTambahBuka] = useState(false);
  const [modalEditBuka, setModalEditBuka] = useState(false);
  const [modalPadamBuka, setModalPadamBuka] = useState(false);

  const [tabungTerpilih, setTabungTerpilih] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editPenerangan, setEditPenerangan] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorAksi, setErrorAksi] = useState("");

  // 1. Simpan Pendaftaran Baru
  const kendaliSimpanTabung = async (nama, penerangan) => {
    const hasil = await addTabung(nama, penerangan);
    if (hasil.success) setModalTambahBuka(false);
    return hasil;
  };

  // 2. Lancar Aliran Kemaskini
  const cetusEdit = (tabung) => {
    setErrorAksi("");
    setTabungTerpilih(tabung);
    setEditNama(tabung.nama_tabung);
    // Cari data asal penerangan jika tersimpan di bakiTabung array
    setEditPenerangan("");
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

  // 3. Lancar Aliran Pemadaman
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">
            Pungutan Tabung Berbeza (Subsidiary)
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Pemantauan dana khas perkampungan Gudon.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalTambahBuka(true)}
          className="!w-full sm:!w-auto">
          ➕ Bina Tabung / Dana Baru
        </Button>
      </div>

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

      {/* MODAL 1: TAMBAH TABUNG BARU */}
      <Modal
        isOpen={modalTambahBuka}
        onClose={() => setModalTambahBuka(false)}
        title="🏢 Daftarkan Tabung Kampung Baru">
        <AddTabungForm
          onSave={kendaliSimpanTabung}
          onCancel={() => setModalTambahBuka(false)}
        />
      </Modal>

      {/* MODAL 2: KEMASKINI NAMA/INFO TABUNG */}
      <Modal
        isOpen={modalEditBuka}
        onClose={() => setModalEditBuka(false)}
        title="✏️ Kemaskini Maklumat Dana">
        <form onSubmit={kendaliKemaskini} className="flex flex-col gap-2">
          <Input
            label="Nama Tabung"
            id="edit_nama"
            value={editNama}
            onChange={(e) => setEditNama(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-gray-750 font-bold text-sm">
              Penerangan Baru
            </label>
            <textarea
              rows="3"
              value={editPenerangan}
              onChange={(e) => setEditPenerangan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
            />
          </div>
          {errorAksi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-3 rounded-lg mb-2">
              ⚠️ {errorAksi}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setModalEditBuka(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: PENGESAHAN PADAM (SAFETY RAIL) */}
      <Modal
        isOpen={modalPadamBuka}
        onClose={() => setModalPadamBuka(false)}
        title="⚠️ Sahkan Padam Tabung">
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 font-medium text-base">
            Adakah anda benar-benar pasti mahu memadam tabung bernama{" "}
            <strong className="text-gray-900 font-black">
              "{tabungTerpilih?.nama_tabung}"
            </strong>
            ? Tindakan ini tidak boleh diundurkan semula.
          </p>

          {errorAksi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-xl leading-relaxed">
              {errorAksi}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setModalPadamBuka(false)}
              disabled={submitting}>
              Batal, Jangan Padam
            </Button>
            <button
              type="button"
              onClick={kendaliPadam}
              disabled={submitting}
              className="px-5 py-3 rounded-lg font-black bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer text-center disabled:opacity-50">
              {submitting ? "Memadam..." : "Ya, Padam Tetap Padam"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
