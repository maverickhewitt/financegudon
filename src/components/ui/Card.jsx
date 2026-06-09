import React from "react";

export const Card = ({ title, children, footer, className = "" }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 transition-all ${className}`}>
      {title && (
        <div className="border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
        </div>
      )}

      <div className="text-gray-700 text-base">{children}</div>

      {footer && (
        <div className="border-t border-gray-100 pt-3 mt-4 text-sm text-gray-500 font-medium">
          {footer}
        </div>
      )}
    </div>
  );
};
