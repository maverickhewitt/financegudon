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
    <Card className="bg-white border border-gray-200 flex flex-col justify-between h-full p-5 rounded-2xl shadow-sm">
      <div>
        <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
          <div>
            <h4 className="text-lg font-bold text-emerald-950 tracking-tight">
              {tabung.nama_tabung}
            </h4>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Dana Terasing Kampung Gudon
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total Kutipan
            </span>
            <span className="text-lg font-bold text-emerald-600 mt-1">
              {formatRM(masuk)}
            </span>
          </div>
          <div className="flex flex-col border-l border-gray-200 pl-4">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Total Guna
            </span>
            <span className="text-lg font-bold text-rose-600 mt-1">
              {formatRM(keluar)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
            <span>Tahap Penggunaan Dana:</span>
            <span
              className={peratusGuna > 80 ? "text-rose-600" : "text-gray-700"}>
              {peratusGuna}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                peratusGuna > 80
                  ? "bg-rose-500"
                  : peratusGuna > 50
                    ? "bg-amber-500"
                    : "bg-green-600"
              }`}
              style={{ width: `${peratusGuna}%` }}></div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline mt-2">
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            BAKI BERSIH SEKARANG:
          </span>
          <span
            className={`text-xl font-bold ${baki >= 0 ? "text-gray-900" : "text-rose-600"}`}>
            {formatRM(baki)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onEdit(tabung)}
          className="py-3 px-4 bg-gray-100 hover:bg-green-50 hover:text-green-800 text-gray-700 text-sm font-bold rounded-xl transition-colors cursor-pointer text-center border border-transparent hover:border-green-200">
          Kemaskini Nama
        </button>
        <button
          type="button"
          onClick={() => onDelete(tabung)}
          className="py-3 px-4 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-700 text-sm font-bold rounded-xl border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer text-center">
          Padam Tabung
        </button>
      </div>
    </Card>
  );
};
