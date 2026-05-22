import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateOdometer,
  validatePlate,
  validateCheckInForm,
  isFormValid,
} from '../src/utils/validators';

describe('validateEmail', () => {
  it('returns null for a valid email', () => {
    expect(validateEmail('mechanic@valentine.na')).toBeNull();
    expect(validateEmail('john.doe+tag@example.co.za')).toBeNull();
  });

  it('returns error for empty value', () => {
    expect(validateEmail('')).toBeTruthy();
    expect(validateEmail(null)).toBeTruthy();
  });

  it('returns error for malformed email', () => {
    expect(validateEmail('notanemail')).toBeTruthy();
    expect(validateEmail('@nodomain.com')).toBeTruthy();
    expect(validateEmail('missing@')).toBeTruthy();
  });
});

describe('validatePassword', () => {
  it('returns null for valid password (>= 6 chars)', () => {
    expect(validatePassword('secret')).toBeNull();
    expect(validatePassword('longpassword123')).toBeNull();
  });

  it('returns error for empty password', () => {
    expect(validatePassword('')).toBeTruthy();
    expect(validatePassword(null)).toBeTruthy();
  });

  it('returns error for password shorter than 6 chars', () => {
    expect(validatePassword('abc')).toBeTruthy();
    expect(validatePassword('12345')).toBeTruthy();
  });
});

describe('validateRequired', () => {
  it('returns null for non-empty values', () => {
    expect(validateRequired('hello')).toBeNull();
    expect(validateRequired('0')).toBeNull();
  });

  it('returns error for empty or whitespace', () => {
    expect(validateRequired('')).toBeTruthy();
    expect(validateRequired('   ')).toBeTruthy();
    expect(validateRequired(null)).toBeTruthy();
    expect(validateRequired(undefined)).toBeTruthy();
  });
});

describe('validateOdometer', () => {
  it('returns null for valid positive numbers', () => {
    expect(validateOdometer(0)).toBeNull();
    expect(validateOdometer(145000)).toBeNull();
    expect(validateOdometer('99999')).toBeNull();
  });

  it('returns error for empty value', () => {
    expect(validateOdometer('')).toBeTruthy();
    expect(validateOdometer(null)).toBeTruthy();
  });

  it('returns error for non-numeric value', () => {
    expect(validateOdometer('abc')).toBeTruthy();
  });

  it('returns error for negative value', () => {
    expect(validateOdometer(-1)).toBeTruthy();
  });

  it('returns error for unrealistically high reading', () => {
    expect(validateOdometer(11_000_000)).toBeTruthy();
  });
});

describe('validatePlate', () => {
  it('returns null for valid Namibian-style plates', () => {
    expect(validatePlate('N 123-456 WB')).toBeNull();
    expect(validatePlate('ABC123')).toBeNull();
  });

  it('returns error for empty plate', () => {
    expect(validatePlate('')).toBeTruthy();
    expect(validatePlate(null)).toBeTruthy();
  });

  it('returns error for plates that are too long', () => {
    expect(validatePlate('ABCDEFGHIJKLMNOP')).toBeTruthy(); // > 15 chars
  });
});

describe('validateCheckInForm', () => {
  const validForm = {
    truckPlate: 'N 123 WB',
    truckModel: 'Mercedes Actros',
    odometerReading: 150000,
    condition: 'good',
  };

  it('returns empty errors for a fully valid form', () => {
    const errors = validateCheckInForm(validForm);
    expect(isFormValid(errors)).toBe(true);
  });

  it('flags missing plate', () => {
    const errors = validateCheckInForm({ ...validForm, truckPlate: '' });
    expect(errors.truckPlate).toBeTruthy();
  });

  it('flags missing model', () => {
    const errors = validateCheckInForm({ ...validForm, truckModel: '' });
    expect(errors.truckModel).toBeTruthy();
  });

  it('flags invalid odometer', () => {
    const errors = validateCheckInForm({ ...validForm, odometerReading: -5 });
    expect(errors.odometerReading).toBeTruthy();
  });

  it('flags missing condition', () => {
    const errors = validateCheckInForm({ ...validForm, condition: '' });
    expect(errors.condition).toBeTruthy();
  });
});

describe('isFormValid', () => {
  it('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns false when errors exist', () => {
    expect(isFormValid({ truckPlate: 'Required' })).toBe(false);
  });
});