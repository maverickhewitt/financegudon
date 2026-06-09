import React from "react";
import { formatRM, formatTarikh } from "../../../utils/formatters";

export const TransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-150 rounded-xl p-8 text-center text-gray-400 font-medium">
        📭 Tiada rekod duit masuk atau keluar dijumpai setakat ini.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Tarikh</th>
              <th className="p-4">Keterangan / Tujuan</th>
              <th className="p-4">Tabung Terbitan</th>
              <th className="p-4 text-center">Jenis</th>
              <th className="p-4 text-center">Bukti</th>{" "}
              {/* Changed to Bukti column header */}
              <th className="p-4 text-right">Jumlah (RM)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm sm:text-base text-gray-800 font-medium">
            {transactions.map((tx) => {
              const isMasuk = tx.jenis === "masuk";
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    {formatTarikh(tx.tarikh)}
                  </td>
                  <td className="p-4 font-bold text-gray-900 break-words max-w-xs sm:max-w-md">
                    {tx.keterangan}
                  </td>
                  <td className="p-4 text-xs sm:text-sm text-blue-900 whitespace-nowrap">
                    📁 {tx.tabung?.nama || "Umum"}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-black tracking-wide
                      ${isMasuk ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-200"}`}>
                      {isMasuk ? "📥 MASUK" : "📤 KELUAR"}
                    </span>
                  </td>

                  {/* 🔥 BUKTI RESIT ROW INTERACTION (NEW) */}
                  <td className="p-4 text-center whitespace-nowrap">
                    {tx.url_resit ? (
                      <a
                        href={tx.url_resit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors">
                        👁️ Lihat Resit
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300 font-normal italic">
                        Tiada
                      </span>
                    )}
                  </td>

                  <td
                    className={`p-4 text-right font-black whitespace-nowrap text-base ${isMasuk ? "text-emerald-600" : "text-rose-600"}`}>
                    {isMasuk ? "+" : "-"}{" "}
                    {formatRM(tx.jumlah).replace("RM", "").trim()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
