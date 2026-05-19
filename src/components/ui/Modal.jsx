import React from "react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Jika modal ditutup, jangan paparkan apa-apa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Latar belakang yang boleh diklik untuk tutup modal */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Kotak Kandungan Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all z-10 border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Bahagian Kepala Modal */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-850 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-650 font-bold text-2xl p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            &times;
          </button>
        </div>

        {/* Bahagian Isi Borang */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
