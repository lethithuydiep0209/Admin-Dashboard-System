export const validateRequired = (value) => (!String(value || "").trim() ? "This field is required" : "");

export const validateEmail = (email) => {
  if (!String(email || "").trim()) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? "" : "Please enter a valid email";
};

export const validateNumber = (value, fieldName = "Value") => {
  if (value === "" || value === null || value === undefined) return `${fieldName} is required`;
  return Number.isFinite(Number(value)) ? "" : `${fieldName} must be a number`;
};
