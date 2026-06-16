import React from "react";
import { Card } from "../../../components/ui/Card";
import { formatRM } from "../../../utils/formatters";

export const TabungCard = ({ tabung, onEdit, onDelete }) => {
  const masuk = Number(tabung.total_masuk || 0);
  const keluar = Number(tabung.total_keluar || 0);
  const baki = Number(tabung.baki_semasa || 0);

  const dapatkanStatusLaporan = () => {
    if (baki > 0) {
      return {
        label: "Ada Baki Simpanan",
        warna: "bg-green-100 text-green-900 border-green-200",
        huraian: "Dana ini mempunyai baki bersih yang selamat untuk digunakan.",
      };
    } else if (baki === 0) {
      return {
        label: "Dana Habis Disalurkan",
        warna: "bg-gray-100 text-gray-700 border-gray-300",
        huraian:
          "Semua kutipan sumbangan telah habis dibelanjakan/diagihkan dengan telus.",
      };
    } else {
      return {
        label: "Peruntukan Kurang",
        warna: "bg-rose-100 text-rose-900 border-rose-300",
        huraian:
          "Perbelanjaan melebihi kutipan. Memerlukan suntikan dana sumbangan baru.",
      };
    }
  };

  const status = dapatkanStatusLaporan();

  return (
    <Card className="bg-white border-2 border-gray-200 flex flex-col justify-between h-full p-6 rounded-2xl shadow-sm hover:border-emerald-600 transition-all duration-200">
      <div>
        {/* Atas: Nama Tabung & Lencana Status Mudah */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-gray-100 pb-3.5 mb-4">
          <div>
            <h4 className="text-lg font-extrabold text-emerald-950 tracking-tight">
              {tabung.nama_tabung}
            </h4>
            <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">
              Akaun Dana Khas Masjid
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold border tracking-wide whitespace-nowrap ${status.warna}`}>
            {status.label}
          </span>
        </div>

        {/* Tengah: Petak Ringkasan Aliran Kewangan Tradisional */}
        <div className="grid grid-cols-2 gap-3 my-4 bg-stone-50 p-4 rounded-xl border border-stone-200/60">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-emerald-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 13l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              JUMLAH DUIT MASUK
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-600 mt-1">
              {formatRM(masuk)}
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              Kutipan & Sumbangan
            </span>
          </div>

          <div className="flex flex-col border-l border-stone-200 pl-4">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-rose-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 11l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              JUMLAH DUIT KELUAR
            </span>
            <span className="text-base sm:text-lg font-extrabold text-rose-600 mt-1">
              {formatRM(keluar)}
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              Belanja & Bantuan
            </span>
          </div>
        </div>

        {/* Penerangan Status Maklumat Dana */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 font-medium leading-relaxed mb-4 flex items-start gap-2">
          <svg
            className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <strong className="text-gray-900">Nota Keadaan:</strong>{" "}
            {status.huraian}
          </div>
        </div>

        {/* Bawah: Jumlah Baki Semasa */}
        <div className="border-t border-gray-100 pt-3.5 flex justify-between items-baseline mt-2">
          <span className="text-xs font-extrabold text-gray-400 tracking-wider">
            BAKI SEKARANG:
          </span>
          <span
            className={`text-xl font-extrabold ${baki >= 0 ? "text-gray-900" : "text-rose-600"}`}>
            {formatRM(baki)}
          </span>
        </div>
      </div>

      {/* Butang Tindakan Berikon Komponen */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onEdit(tabung)}
          className="py-2.5 px-4 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-transparent hover:border-emerald-200">
          <svg
            className="w-3.5 h-3.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span>Kemaskini Nama</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(tabung)}
          className="py-2.5 px-4 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-700 text-xs font-bold rounded-xl border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Padam Tabung</span>
        </button>
      </div>
    </Card>
  );
};
