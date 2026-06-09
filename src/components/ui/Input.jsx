import React from "react";

export const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="text-gray-700 font-bold text-base tracking-wide">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3.5 border rounded-xl text-base outline-none transition-all duration-150 shadow-sm ${
          error
            ? "border-rose-500 bg-rose-50 focus:ring-4 focus:ring-rose-100"
            : "border-gray-300 focus:border-green-600 focus:ring-4 focus:ring-green-50"
        }`}
        {...props}
      />
      {error && (
        <span className="text-rose-600 text-sm font-semibold mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
