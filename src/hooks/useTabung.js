import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const useTabung = () => {
  const [tabungList, setTabungList] = useState([]);
  const [bakiTabung, setBakiTabung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTabungData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: list, error: listError } = await supabase
        .from("tabung")
        .select("*")
        .order("nama", { ascending: true });

      if (listError) throw listError;
      setTabungList(list);

      const { data: baki, error: bakiError } = await supabase
        .from("v_baki_tabung")
        .select("*");

      if (bakiError) throw bakiError;
      setBakiTabung(baki);
    } catch (err) {
      console.error("Ralat ambil data tabung:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTabung = async (namaTabung, keteranganTabung) => {
    try {
      const { error: insertError } = await supabase
        .from("tabung")
        .insert([
          { nama: namaTabung.trim(), penerangan: keteranganTabung.trim() },
        ]);

      if (insertError) throw insertError;
      await fetchTabungData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 🔥 FUNGSI BARU: Kemaskini Maklumat Tabung
  const updateTabung = async (id, namaTabung, keteranganTabung) => {
    try {
      const { error: updateError } = await supabase
        .from("tabung")
        .update({
          nama: namaTabung.trim(),
          penerangan: keteranganTabung.trim(),
        })
        .eq("id", id);

      if (updateError) throw updateError;
      await fetchTabungData();
      return { success: true };
    } catch (err) {
      console.error("Ralat kemaskini tabung:", err.message);
      return { success: false, error: err.message };
    }
  };

  // 🔥 FUNGSI BARU: Padam Tabung (Bersama Safety Rail)
  const deleteTabung = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from("tabung")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      await fetchTabungData();
      return { success: true };
    } catch (err) {
      console.error("Ralat memadam tabung:", err.message);

      // Mengesan sekiranya database menyekat pemadaman kerana ada rekod transaksi
      if (err.message?.includes("foreign key") || err.code === "23503") {
        return {
          success: false,
          error:
            "Tabung ini TIDAK BOLEH dipadam kerana sudah ada rekod duit masuk/keluar di dalamnya! Sila tukar atau padam transaksi berkaitan di Buku Tunai terlebih dahulu.",
        };
      }
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchTabungData();
  }, []);

  return {
    tabungList,
    bakiTabung,
    loading,
    error,
    addTabung,
    updateTabung, // Ekspot update fungsi
    deleteTabung, // Ekspot delete fungsi
    refreshTabung: fetchTabungData,
  };
};
