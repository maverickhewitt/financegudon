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

      // 🔥 KEMASKINI DI SINI: Masukkan 'url_resit' dalam senarai select
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
