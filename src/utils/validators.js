import { STRINGS } from '../constants/strings';

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) return STRINGS.requiredField;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) ? null : STRINGS.invalidEmail;
};

/**
 * Validate a password (minimum 6 characters).
 * @param {string} password
 * @returns {string|null}
 */
export const validatePassword = (password) => {
  if (!password) return STRINGS.requiredField;
  return password.length >= 6 ? null : STRINGS.passwordTooShort;
};

/**
 * Validate that a string field is not empty.
 * @param {string} value
 * @returns {string|null}
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return STRINGS.requiredField;
  return String(value).trim().length > 0 ? null : STRINGS.requiredField;
};

/**
 * Validate an odometer reading.
 * Must be a positive number.
 * @param {string|number} value
 * @returns {string|null}
 */
export const validateOdometer = (value) => {
  if (value === '' || value === null || value === undefined) return STRINGS.requiredField;
  const n = Number(value);
  if (isNaN(n)) return 'Odometer must be a number.';
  if (n < 0) return 'Odometer reading cannot be negative.';
  if (n > 10_000_000) return 'Odometer reading seems too high.';
  return null;
};

/**
 * Validate a vehicle registration plate.
 * Allows letters, digits, spaces, and hyphens; 2–10 characters.
 * @param {string} plate
 * @returns {string|null}
 */
export const validatePlate = (plate) => {
  if (!plate || !plate.trim()) return STRINGS.requiredField;
  const re = /^[A-Za-z0-9\s\-]{2,15}$/;
  return re.test(plate.trim()) ? null : 'Enter a valid registration plate.';
};

/**
 * Validate the full check-in form.
 * @param {object} form  - { truckPlate, truckModel, odometerReading, condition }
 * @returns {object} Map of field names to error strings (empty = valid)
 */
export const validateCheckInForm = (form) => {
  const errors = {};

  const plateErr = validatePlate(form.truckPlate);
  if (plateErr) errors.truckPlate = plateErr;

  const modelErr = validateRequired(form.truckModel);
  if (modelErr) errors.truckModel = modelErr;

  const odoErr = validateOdometer(form.odometerReading);
  if (odoErr) errors.odometerReading = odoErr;

  const condErr = validateRequired(form.condition);
  if (condErr) errors.condition = 'Please select the vehicle condition.';

  return errors;
};

/**
 * Returns true when an errors object has no keys.
 * @param {object} errors
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;