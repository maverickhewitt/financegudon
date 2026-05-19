import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const useLaporan = (tahunAwal, bulanAwal) => {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLaporan = async (tahun, bulan) => {
    try {
      setLoading(true);
      setError(null);

      // Ambil laporan berkala daripada View yang dikira secara automatik di Supabase
      let query = supabase
        .from("v_laporan_berkala")
        .select("*")
        .eq("tahun", parseInt(tahun));

      // Jika bulan dipilih (bukan kesemua tahunan)
      if (bulan && bulan !== "semua") {
        query = query.eq("bulan", parseInt(bulan));
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setDataLaporan(data || []);
    } catch (err) {
      console.error("Ralat menjana laporan:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    dataLaporan,
    loading,
    error,
    janaLaporan: fetchLaporan,
  };
};
