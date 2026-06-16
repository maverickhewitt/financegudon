import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const useBukuTunai = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          url_resit, 
          no_dokumen,
          kaedah,
          rujukan_bank,
          pemohon,
          disemak_bendahari,
          disahkan_pengerusi,
          tabung ( nama )
        `,
        )
        .order("tarikh", { ascending: false })
        .order("dibuat_pada", { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      console.error("Ralat ambil Buku Tunai:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const { error: insertError } = await supabase
        .from("buku_tunai")
        .insert([transactionData]);

      if (insertError) throw insertError;

      await fetchTransactions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const { error: updateError } = await supabase
        .from("buku_tunai")
        .update(updatedData)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error("Ralat mengemaskini transaksi:", err.message);
      return { success: false, error: err.message };
    }
  };

  // 🔥 FUNGSI BARU: Padam Transaksi
  const deleteTransaction = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from("buku_tunai")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error("Ralat memadam transaksi:", err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyTransactionBendahari = async (id, status = true) => {
    try {
      const { error: verifyError } = await supabase
        .from("buku_tunai")
        .update({ disemak_bendahari: status })
        .eq("id", id);

      if (verifyError) throw verifyError;

      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error("Ralat pengesahan Bendahari:", err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyTransactionPengerusi = async (id, status = true) => {
    try {
      const { error: approvalError } = await supabase
        .from("buku_tunai")
        .update({ disahkan_pengerusi: status })
        .eq("id", id);

      if (approvalError) throw approvalError;

      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error("Ralat kelulusan Pengerusi:", err.message);
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
    updateTransaction,
    deleteTransaction, // Ekspot fungsi baru
    verifyTransactionBendahari,
    verifyTransactionPengerusi,
    refreshTransactions: fetchTransactions,
  };
};
