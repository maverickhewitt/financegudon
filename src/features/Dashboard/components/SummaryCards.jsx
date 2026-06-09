import React from "react";
import { Card } from "../../../components/ui/Card";
import { formatRM } from "../../../utils/formatters";

export const SummaryCards = ({ bakiTabung = [] }) => {
  const totalMasuk = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_masuk || 0),
    0,
  );
  const totalKeluar = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_keluar || 0),
    0,
  );
  const bakiSemasa = totalMasuk - totalKeluar;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <Card className="border-l-8 border-l-green-600 bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
            BAKI SEMASA (JUMLAH DANA)
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            {formatRM(bakiSemasa)}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-1">
            Duit bersih yang boleh digunakan sekarang
          </span>
        </div>
      </Card>

      <Card className="border-l-8 border-l-emerald-600 bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider">
            TOTAL KESELURUHAN MASUK
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight mt-1">
            {formatRM(totalMasuk)}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-1">
            Semua pungutan dan sumbangan terkumpul
          </span>
        </div>
      </Card>

      <Card className="border-l-8 border-l-rose-600 bg-gradient-to-br from-white to-rose-50/30 sm:col-span-2 lg:col-span-1 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider">
            TOTAL KESELURUHAN KELUAR
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight mt-1">
            {formatRM(totalKeluar)}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-1">
            Semua perbelanjaan, bil dan bantuan keluar
          </span>
        </div>
      </Card>
    </div>
  );
};
