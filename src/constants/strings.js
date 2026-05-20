export const STRINGS = {
  appName: "Valentine's Garage",
  tagline: 'Fleet Service Management',

  // Auth
  login: 'Log In',
  logout: 'Log Out',
  email: 'Email Address',
  password: 'Password',
  loginSubtitle: 'Sign in to your account',

  // Roles
  admin: 'Admin',
  mechanic: 'Mechanic',

  // Check-in
  checkIn: 'Vehicle Check-In',
  checkInSubtitle: 'Register a truck for service',
  truckPlate: 'Truck Registration / Plate',
  truckModel: 'Make & Model',
  kilometersDriven: 'Odometer Reading (km)',
  vehicleCondition: 'Vehicle Condition',
  driverName: 'Driver / Owner Name',
  notes: 'Additional Notes',
  submitCheckIn: 'Check In Vehicle',
  photoEvidence: 'Photo Evidence',
  takePhoto: 'Take Photo',
  choosePhoto: 'Choose from Gallery',

  // Conditions
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  critical: 'Critical',

  // Service
  serviceChecklist: 'Service Checklist',
  serviceChecklistSubtitle: 'Tick tasks as you complete them',
  taskNote: 'Add a note for this task…',
  saveNote: 'Save Note',
  completedBy: 'Completed by',
  inProgress: 'In Progress',
  notStarted: 'Not Started',
  completed: 'Completed',

  // Reports
  reports: 'Reports',
  reportsSubtitle: 'Vehicle & employee activity',
  employeeActivity: 'Employee Activity',
  vehicleHistory: 'Vehicle History',
  checkInCondition: 'Check-in Condition',
  tasksCompleted: 'Tasks Completed',
  lastService: 'Last Service',

  // Navigation
  dashboard: 'Dashboard',
  vehicles: 'Vehicles',
  checklist: 'Checklist',

  // Errors
  requiredField: 'This field is required.',
  invalidEmail: 'Please enter a valid email address.',
  passwordTooShort: 'Password must be at least 6 characters.',
  loginFailed: 'Login failed. Check your credentials and try again.',
  genericError: 'Something went wrong. Please try again.',
};

export const VEHICLE_CONDITIONS = [
  { label: 'Excellent', value: 'excellent', color: '#27AE60', icon: 'checkmark-circle' },
  { label: 'Good',      value: 'good',      color: '#2ECC71', icon: 'thumbs-up' },
  { label: 'Fair',      value: 'fair',      color: '#F39C12', icon: 'alert-circle' },
  { label: 'Poor',      value: 'poor',      color: '#E67E22', icon: 'warning' },
  { label: 'Critical',  value: 'critical',  color: '#E74C3C', icon: 'close-circle' },
];