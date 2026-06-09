import React, { useState } from "react";
import { useBukuTunai } from "../../hooks/useBukuTunai";
import { useTabung } from "../../hooks/useTabung";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionForm } from "./components/TransactionForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export const BukuTunaiPage = () => {
  const { transactions, loading, error, addTransaction } = useBukuTunai();
  const { tabungList } = useTabung(); // Ambil senarai nama tabung harian untuk disuap ke borang
  const [modalBuka, setModalBuka] = useState(false);

  const simpanTransaksiBaru = async (dataForm) => {
    const hasil = await addTransaction(dataForm);
    if (hasil.success) {
      setModalBuka(false); // Tutup modal jika berjaya simpan
    }
    return hasil;
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
      {/* Bahagian Atas: Tajuk & Butang Tambah Data */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">
            Buku Tunai Utama
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Senarai rekod aliran duit masuk dan keluar kampung secara
            terperinci.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalBuka(true)}
          className="!w-full sm:!w-auto">
          ➕ Rekod Masuk / Keluar Baru
        </Button>
      </div>

      {/* Paparan Ralat Jika Sistem Terganggu */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 font-semibold">
          ⚠️ Ralat memuatkan transaksi: {error}
        </div>
      )}

      {/* Jadual Utama Buku Tunai (Dari Batch 6) */}
      <div className="mt-2">
        <TransactionTable transactions={transactions} />
      </div>

      {/* Kotak Tetingkap Borang Timbul (Modal) */}
      <Modal
        isOpen={modalBuka}
        onClose={() => setModalBuka(false)}
        title="📝 Tambah Rekod Kewangan Kampung">
        <TransactionForm
          tabungList={tabungList}
          onSave={simpanTransaksiBaru}
          onCancel={() => setModalBuka(false)}
        />
      </Modal>
    </div>
  );
};
