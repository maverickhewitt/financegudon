import React from "react";
import { Card } from "../../../components/ui/Card";
import { formatRM } from "../../../utils/formatters";

export const TabungCard = ({ tabung, onEdit, onDelete }) => {
  const bakiTunai = Number(tabung.baki_tunai || 0);
  const bakiBank = Number(tabung.baki_bank || 0);
  const bakiKeseluruhan = Number(tabung.baki_semasa || 0);

  return (
    <Card className="bg-white border border-gray-200 flex flex-col justify-between h-full p-6 rounded-2xl shadow-sm hover:border-green-600 transition-all duration-200">
      <div>
        <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
          <div>
            <h4 className="text-lg font-bold text-emerald-950 tracking-tight">
              {tabung.nama_tabung}
            </h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Dana Khas Masjid Al-Muahidin
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-4">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Simpanan Tunai / Cash</span>
            </div>
            <span className="text-base font-bold text-gray-900">
              {formatRM(bakiTunai)}
            </span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <span>Simpanan Di Bank / Transfer</span>
            </div>
            <span className="text-base font-bold text-gray-900">
              {formatRM(bakiBank)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3.5 flex justify-between items-baseline mt-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
            Jumlah Baki Keseluruhan
          </span>
          <span
            className={`text-xl font-bold ${bakiKeseluruhan >= 0 ? "text-green-700" : "text-rose-600"}`}>
            {formatRM(bakiKeseluruhan)}
          </span>
        </div>
      </div>

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
