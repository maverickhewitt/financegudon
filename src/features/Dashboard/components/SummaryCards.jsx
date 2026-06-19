import React from "react";
import { Card } from "../../../components/ui/Card";
import { formatRM } from "../../../utils/formatters";

export const SummaryCards = ({ bakiTabung = [] }) => {
  const totalBakiSemasa = bakiTabung.reduce(
    (sum, item) => sum + Number(item.baki_semasa || 0),
    0,
  );
  const totalBakiTunai = bakiTabung.reduce(
    (sum, item) => sum + Number(item.baki_tunai || 0),
    0,
  );
  const totalBakiBank = bakiTabung.reduce(
    (sum, item) => sum + Number(item.baki_bank || 0),
    0,
  );

  const totalTunaiMasuk = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_tunai_masuk || 0),
    0,
  );
  const totalTunaiKeluar = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_tunai_keluar || 0),
    0,
  );
  const totalBankMasuk = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_bank_masuk || 0),
    0,
  );
  const totalBankKeluar = bakiTabung.reduce(
    (sum, item) => sum + Number(item.total_bank_keluar || 0),
    0,
  );

  const totalMasukKeseluruhan = totalTunaiMasuk + totalBankMasuk;
  const totalKeluarKeseluruhan = totalTunaiKeluar + totalBankKeluar;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-8 border-l-green-600 bg-gradient-to-br from-white to-green-50/20 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
              Jumlah Dana Keseluruhan
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {formatRM(totalBakiSemasa)}
            </span>
            <span className="text-xs text-gray-400 font-medium mt-1">
              Tunai + Bank
            </span>
          </div>
        </Card>

        <Card className="border-l-8 border-l-emerald-600 bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Baki Tunai Semasa
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {formatRM(totalBakiTunai)}
            </span>
            <span className="text-xs text-gray-400 font-medium mt-1">
              Duit fizikal dalam tangan
            </span>
          </div>
        </Card>

        <Card className="border-l-8 border-l-blue-600 bg-gradient-to-br from-white to-blue-50/20 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Baki Bank Semasa
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {formatRM(totalBakiBank)}
            </span>
            <span className="text-xs text-gray-400 font-medium mt-1">
              Simpanan akaun bank
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
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
            <span>Pecahan Aliran Tunai (Cash)</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Masuk Tunai
              </span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {formatRM(totalTunaiMasuk)}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Keluar Tunai
              </span>
              <div className="text-base font-bold text-rose-600 mt-0.5">
                {formatRM(totalTunaiKeluar)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
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
            <span>Pecahan Aliran Bank (Transfer)</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Masuk Bank
              </span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {formatRM(totalBankMasuk)}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Keluar Bank
              </span>
              <div className="text-base font-bold text-rose-600 mt-0.5">
                {formatRM(totalBankKeluar)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Keseluruhan Aliran Masuk
          </span>
          <div className="text-base font-bold text-gray-900 mt-0.5">
            {formatRM(totalMasukKeseluruhan)}
          </div>
        </div>
        <div className="border-l border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Keseluruhan Aliran Keluar
          </span>
          <div className="text-base font-bold text-gray-900 mt-0.5">
            {formatRM(totalKeluarKeseluruhan)}
          </div>
        </div>
      </div>
    </div>
  );
};
