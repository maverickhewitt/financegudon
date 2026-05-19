import React from "react";

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) => {
  // Pilihan gaya warna yang terang dan jelas mengikut fungsi
  const baseStyles =
    "px-5 py-3 rounded-lg font-semibold text-base transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto text-center cursor-pointer";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    masuk: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md", // Hijau untuk Duit Masuk
    keluar: "bg-rose-600 text-white hover:bg-rose-700 shadow-md", // Merah untuk Duit Keluar
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
