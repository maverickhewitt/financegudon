import React from "react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all z-10 border border-gray-200 max-h-[90vh] flex flex-col animate-fade-in">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-2xl px-3 py-1 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
