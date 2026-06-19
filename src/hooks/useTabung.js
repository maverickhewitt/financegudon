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

      const { data: txs, error: txsError } = await supabase
        .from("buku_tunai")
        .select("tabung_id, jenis, kaedah, jumlah");

      if (txsError) throw txsError;

      const bakiDikira = baki.map((item) => {
        let tunaiMasuk = 0;
        let tunaiKeluar = 0;
        let bankMasuk = 0;
        let bankKeluar = 0;

        txs.forEach((tx) => {
          if (tx.tabung_id === item.tabung_id) {
            if (tx.kaedah === "cash") {
              if (tx.jenis === "masuk") tunaiMasuk += Number(tx.jumlah || 0);
              if (tx.jenis === "keluar") tunaiKeluar += Number(tx.jumlah || 0);
            } else if (tx.kaedah === "bank") {
              if (tx.jenis === "masuk") bankMasuk += Number(tx.jumlah || 0);
              if (tx.jenis === "keluar") bankKeluar += Number(tx.jumlah || 0);
            }
          }
        });

        return {
          ...item,
          baki_tunai: tunaiMasuk - tunaiKeluar,
          baki_bank: bankMasuk - bankKeluar,
          total_tunai_masuk: tunaiMasuk,
          total_tunai_keluar: tunaiKeluar,
          total_bank_masuk: bankMasuk,
          total_bank_keluar: bankKeluar,
        };
      });

      setBakiTabung(bakiDikira);
    } catch (err) {
      console.error(err.message);
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
      console.error(err.message);
      return { success: false, error: err.message };
    }
  };

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
      console.error(err.message);
      if (err.message?.includes("foreign key") || err.code === "23503") {
        return {
          success: false,
          error:
            "Tabung ini tidak boleh dipadam kerana mempunyai rekod transaksi aliran tunai atau bank di dalamnya.",
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
    updateTabung,
    deleteTabung,
    refreshTabung: fetchTabungData,
  };
};
