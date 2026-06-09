import React from "react";
import { formatRM, formatTarikh } from "../../../utils/formatters";

export const TransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 font-medium">
        Tiada rekod duit masuk atau keluar dijumpai setakat ini.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="block sm:hidden space-y-3">
        {transactions.map((tx) => {
          const isMasuk = tx.jenis === "masuk";
          return (
            <div
              key={tx.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-lg font-semibold">
                  {formatTarikh(tx.tarikh)}
                </span>
                <span className="text-emerald-900 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  Tabung: {tx.tabung?.nama || "Umum"}
                </span>
              </div>

              <div className="text-base font-bold text-gray-900 leading-snug">
                {tx.keterangan}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                <div>
                  {tx.url_resit ? (
                    <a
                      href={tx.url_resit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors">
                      Lihat Gambar Resit
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Tiada Resit
                    </span>
                  )}
                </div>

                <div
                  className={`text-lg font-bold ${
                    isMasuk ? "text-emerald-600" : "text-rose-600"
                  }`}>
                  {isMasuk ? "+ " : "- "}RM{" "}
                  {formatRM(tx.jumlah).replace("RM", "").trim()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-bold tracking-wide">
              <tr>
                <th className="p-4">Tarikh</th>
                <th className="p-4">Keterangan / Tujuan</th>
                <th className="p-4">Tabung Terbitan</th>
                <th className="p-4 text-center">Jenis</th>
                <th className="p-4 text-center">Bukti</th>
                <th className="p-4 text-right">Jumlah</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-800 font-medium">
              {transactions.map((tx) => {
                const isMasuk = tx.jenis === "masuk";
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {formatTarikh(tx.tarikh)}
                    </td>
                    <td className="p-4 font-semibold text-gray-900 max-w-xs sm:max-w-md break-words">
                      {tx.keterangan}
                    </td>
                    <td className="p-4 text-emerald-950 font-semibold whitespace-nowrap">
                      {tx.tabung?.nama || "Umum"}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs font-bold tracking-wide ${
                          isMasuk
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}>
                        {isMasuk ? "MASUK" : "KELUAR"}
                      </span>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      {tx.url_resit ? (
                        <a
                          href={tx.url_resit}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
                          Lihat Resit
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300 font-normal italic">
                          Tiada
                        </span>
                      )}
                    </td>

                    <td
                      className={`p-4 text-right font-bold whitespace-nowrap text-base ${
                        isMasuk ? "text-emerald-600" : "text-rose-600"
                      }`}>
                      {isMasuk ? "+ " : "- "}
                      {formatRM(tx.jumlah).replace("RM", "").trim()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
