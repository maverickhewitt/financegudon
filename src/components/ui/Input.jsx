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
          className="text-gray-700 font-bold text-sm sm:text-base tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg text-base outline-none transition-all duration-150
          ${
            error
              ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }
        `}
        {...props}
      />
      {error && (
        <span className="text-rose-600 text-xs sm:text-sm font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
