import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const useBukuTunai = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil senarai semua duit masuk & keluar
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("buku_tunai")
        .select(
          `
          id,
          tarikh,
          jenis,
          jumlah,
          keterangan,
          tabung_id,
          tabung ( nama )
        `,
        )
        .order("tarikh", { ascending: false })
        .order("dibuat_pada", { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data);
    } catch (err) {
      console.error("Ralat ambil Buku Tunai:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk simpan transaksi baru (Duit Masuk / Duit Keluar)
  const addTransaction = async (transactionData) => {
    try {
      // transactionData mesti mengandungi: tabung_id, tarikh, jenis, jumlah, keterangan
      const { error: insertError } = await supabase
        .from("buku_tunai")
        .insert([transactionData]);

      if (insertError) throw insertError;

      // Segarkan data serta-merta selepas berjaya simpan
      await fetchTransactions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    refreshTransactions: fetchTransactions,
  };
};
