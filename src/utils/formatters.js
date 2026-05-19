/**
 * Menukar nombor biasa kepada format Ringgit Malaysia yang kemas.
 * Contoh: 5000 -> RM 5,000.00
 */
export const formatRM = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount))
    return "RM 0.00";

  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Menukar tarikh sistem kepada format tarikh tempatan yang senang dibaca.
 * Contoh: "2026-05-19" -> 19 Mei 2026
 */
export const formatTarikh = (dateString) => {
  if (!dateString) return "-";

  const tarikh = new Date(dateString);
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(tarikh);
};
