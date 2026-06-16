import React, { useState } from "react";
import { useBukuTunai } from "../../hooks/useBukuTunai";
import { useTabung } from "../../hooks/useTabung";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionForm } from "./components/TransactionForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export const BukuTunaiPage = () => {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction, // Ambil fungsi padam
    verifyTransactionBendahari,
    verifyTransactionPengerusi,
  } = useBukuTunai();

  const { tabungList } = useTabung();
  const [modalBuka, setModalBuka] = useState(false);
  const [editData, setEditData] = useState(null);

  // State khas untuk fungsi padam
  const [modalPadamBuka, setModalPadamBuka] = useState(false);
  const [transaksiUntukDipadam, setTransaksiUntukDipadam] = useState(null);
  const [submittingPadam, setSubmittingPadam] = useState(false);

  // Interactive role switcher for live stakeholder presentations
  const [userRole, setUserRole] = useState("bendahari");

  const kendaliBukaTambah = () => {
    setEditData(null);
    setModalBuka(true);
  };

  const kendaliBukaEdit = (tx) => {
    if (tx.disahkan_pengerusi) {
      alert(
        "Rekod ini telah disahkan oleh Pengerusi dan dikunci daripada sebarang perubahan.",
      );
      return;
    }
    setEditData(tx);
    setModalBuka(true);
  };

  const kendaliBukaPadam = (tx) => {
    if (tx.disahkan_pengerusi) {
      alert("Rekod yang telah disahkan tidak boleh dipadam.");
      return;
    }
    setTransaksiUntukDipadam(tx);
    setModalPadamBuka(true);
  };

  const simpanTransaksiBaru = async (dataForm) => {
    let hasil;
    if (editData?.id) {
      hasil = await updateTransaction(editData.id, dataForm);
    } else {
      hasil = await addTransaction(dataForm);
    }

    if (hasil.success) {
      setModalBuka(false);
      setEditData(null);
    }
    return hasil;
  };

  const laksanakanPadamTransaksi = async () => {
    setSubmittingPadam(true);
    const hasil = await deleteTransaction(transaksiUntukDipadam.id);
    setSubmittingPadam(false);

    if (hasil.success) {
      setModalPadamBuka(false);
      setTransaksiUntukDipadam(null);
    } else {
      alert("Gagal memadam rekod: " + (hasil.error || "Ralat tidak diketahui"));
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold text-lg animate-pulse">
          Memuatkan buku tunai kampung...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic Simulation Bar for Demos */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm print:hidden">
        <div className="text-xs sm:text-sm font-semibold text-amber-900">
          <strong className="font-bold">Mod Demo Jawatankuasa:</strong> Tukar
          peranan di sebelah untuk melihat fungsi butang semakan.
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setUserRole("bendahari")}
            className={`flex-1 sm:flex-none text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${userRole === "bendahari" ? "bg-green-700 text-white border-green-700 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            Sebagai Bendahari
          </button>
          <button
            onClick={() => setUserRole("pengerusi")}
            className={`flex-1 sm:flex-none text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${userRole === "pengerusi" ? "bg-emerald-700 text-white border-emerald-700 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            Sebagai Pengerusi (Ketua)
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
            Buku Tunai Utama
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Senarai rekod aliran duit masuk dan keluar kampung secara
            terperinci.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={kendaliBukaTambah}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-bold">
          Rekod Masuk / Keluar Baru
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 font-semibold">
          Ralat memuatkan transaksi: {error}
        </div>
      )}

      {/* Wire up interactive handlers directly to the spreadsheet interface */}
      <div className="mt-2">
        <TransactionTable
          transactions={transactions}
          userRole={userRole}
          onEdit={kendaliBukaEdit}
          onDelete={kendaliBukaPadam} // Salurkan fungsi trigger padam
          onSahkanBendahari={(id) => verifyTransactionBendahari(id, true)}
          onSahkanPengerusi={(id) => verifyTransactionPengerusi(id, true)}
        />
      </div>

      {/* MODAL 1: Tambah / Kemaskini Transaksi */}
      <Modal
        isOpen={modalBuka}
        onClose={() => {
          setModalBuka(false);
          setEditData(null);
        }}
        title={
          editData
            ? "Kemaskini Pembetulan Rekod Kewangan"
            : "Tambah Rekod Kewangan Kampung"
        }>
        <TransactionForm
          tabungList={tabungList}
          onSave={simpanTransaksiBaru}
          onCancel={() => {
            setModalBuka(false);
            setEditData(null);
          }}
          editData={editData}
        />
      </Modal>

      {/* MODAL 2: Pengesahan Padam Transaksi */}
      <Modal
        isOpen={modalPadamBuka}
        onClose={() => setModalPadamBuka(false)}
        title="Sahkan Pemadaman Rekod">
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            Adakah anda pasti mahu memadam rekod transaksi{" "}
            <strong className="text-gray-900 font-extrabold">
              "{transaksiUntukDipadam?.keterangan || "Tanpa Tajuk"}"
            </strong>{" "}
            bernilai{" "}
            <strong className="text-rose-600 font-bold">
              RM {transaksiUntukDipadam?.jumlah}
            </strong>
            ? Tindakan ini tidak boleh diundurkan semula.
          </p>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setModalPadamBuka(false)}
              disabled={submittingPadam}>
              Batal
            </Button>
            <button
              type="button"
              onClick={laksanakanPadamTransaksi}
              disabled={submittingPadam}
              className="px-5 py-3.5 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer text-center disabled:opacity-50 text-base w-full sm:w-auto">
              {submittingPadam ? "Sedang Memadam..." : "Ya, Padam Rekod"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
