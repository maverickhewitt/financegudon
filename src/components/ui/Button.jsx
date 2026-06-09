import React from "react";

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "px-5 py-3.5 rounded-xl font-bold text-base transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto text-center cursor-pointer shadow-sm";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    masuk: "bg-emerald-600 text-white hover:bg-emerald-700",
    keluar: "bg-rose-600 text-white hover:bg-rose-700",
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
