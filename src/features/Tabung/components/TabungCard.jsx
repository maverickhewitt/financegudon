import React from "react";
import { Card } from "../../../components/ui/Card";
import { formatRM } from "../../../utils/formatters";

export const TabungCard = ({ tabung, onEdit, onDelete }) => {
  const masuk = Number(tabung.total_masuk || 0);
  const keluar = Number(tabung.total_keluar || 0);
  const baki = Number(tabung.baki_semasa || 0);

  const peratusGuna =
    masuk > 0 ? Math.min(Math.round((keluar / masuk) * 100), 100) : 0;

  return (
    <Card className="bg-white border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-4">
          <div>
            <h4 className="text-lg font-black text-blue-950 uppercase tracking-tight">
              {tabung.nama_tabung}
            </h4>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Dana Terasing Kampung Gudon
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-700">
              📈 Total Kutipan
            </span>
            <span className="text-base font-extrabold text-emerald-600 mt-0.5">
              {formatRM(masuk)}
            </span>
          </div>
          <div className="flex flex-col border-l border-gray-200 pl-3">
            <span className="text-xs font-bold text-rose-700">
              📉 Total Guna
            </span>
            <span className="text-base font-extrabold text-rose-600 mt-0.5">
              {formatRM(keluar)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
            <span>Tahap Penggunaan Dana:</span>
            <span
              className={peratusGuna > 80 ? "text-rose-600" : "text-gray-600"}>
              {peratusGuna}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                peratusGuna > 80
                  ? "bg-rose-500"
                  : peratusGuna > 50
                    ? "bg-amber-500"
                    : "bg-blue-600"
              }`}
              style={{ width: `${peratusGuna}%` }}></div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline mt-2">
          <span className="text-xs font-bold text-gray-400">
            BAKI BERSIH SEKARANG:
          </span>
          <span
            className={`text-xl font-black ${baki >= 0 ? "text-gray-900" : "text-rose-600"}`}>
            {formatRM(baki)}
          </span>
        </div>
      </div>

      {/* 🔥 BUTANG UTAMA: Aksi Pengurusan Bilik Kemaskini & Padam */}
      <div className="grid grid-cols-2 gap-2 mt-6 pt-3 border-t border-gray-50">
        <button
          type="button"
          onClick={() => onEdit(tabung)}
          className="py-2 px-3 bg-gray-100 hover:bg-amber-100 hover:text-amber-900 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center">
          ✏️ Kemaskini Nama
        </button>
        <button
          type="button"
          onClick={() => onDelete(tabung)}
          className="py-2 px-3 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-700 text-xs font-bold rounded-lg border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer text-center">
          🗑️ Padam Tabung
        </button>
      </div>
    </Card>
  );
};
