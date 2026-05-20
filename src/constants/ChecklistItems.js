export const CHECKLIST_CATEGORIES = {
  ENGINE: 'Engine & Drivetrain',
  FLUID: 'Fluids & Filters',
  BRAKES: 'Brakes & Tyres',
  ELECTRICAL: 'Electrical & Lights',
  BODY: 'Body & Safety',
  FINAL: 'Final Inspection',
};

export const DEFAULT_CHECKLIST = [
  {
    id: 'eng_01',
    category: CHECKLIST_CATEGORIES.ENGINE,
    task: 'Inspect engine oil level and condition',
    critical: true,
  },
  {
    id: 'eng_02',
    category: CHECKLIST_CATEGORIES.ENGINE,
    task: 'Check coolant level and hoses',
    critical: true,
  },
  {
    id: 'eng_03',
    category: CHECKLIST_CATEGORIES.ENGINE,
    task: 'Inspect drive belts for wear or cracking',
    critical: false,
  },
  {
    id: 'eng_04',
    category: CHECKLIST_CATEGORIES.ENGINE,
    task: 'Check gearbox and differential oils',
    critical: false,
  },
  {
    id: 'eng_05',
    category: CHECKLIST_CATEGORIES.ENGINE,
    task: 'Test engine start and idle',
    critical: true,
  },

  {
    id: 'flu_01',
    category: CHECKLIST_CATEGORIES.FLUID,
    task: 'Replace engine oil and filter',
    critical: true,
  },
  {
    id: 'flu_02',
    category: CHECKLIST_CATEGORIES.FLUID,
    task: 'Replace fuel filter',
    critical: false,
  },
  {
    id: 'flu_03',
    category: CHECKLIST_CATEGORIES.FLUID,
    task: 'Inspect and top up brake fluid',
    critical: true,
  },
  {
    id: 'flu_04',
    category: CHECKLIST_CATEGORIES.FLUID,
    task: 'Check power steering fluid level',
    critical: false,
  },
  {
    id: 'flu_05',
    category: CHECKLIST_CATEGORIES.FLUID,
    task: 'Replace air filter if required',
    critical: false,
  },

  {
    id: 'brk_01',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Inspect front brake pads and discs',
    critical: true,
  },
  {
    id: 'brk_02',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Inspect rear brake pads / drums and linings',
    critical: true,
  },
  {
    id: 'brk_03',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Check handbrake operation and adjustment',
    critical: true,
  },
  {
    id: 'brk_04',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Inspect tyre tread depth on all wheels',
    critical: true,
  },
  {
    id: 'brk_05',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Check and adjust tyre pressure',
    critical: false,
  },
  {
    id: 'brk_06',
    category: CHECKLIST_CATEGORIES.BRAKES,
    task: 'Inspect wheel nuts and studs',
    critical: false,
  },

  {
    id: 'elc_01',
    category: CHECKLIST_CATEGORIES.ELECTRICAL,
    task: 'Test all exterior lights (head, tail, indicators)',
    critical: true,
  },
  {
    id: 'elc_02',
    category: CHECKLIST_CATEGORIES.ELECTRICAL,
    task: 'Check battery voltage and terminals',
    critical: false,
  },
  {
    id: 'elc_03',
    category: CHECKLIST_CATEGORIES.ELECTRICAL,
    task: 'Test horn functionality',
    critical: false,
  },
  {
    id: 'elc_04',
    category: CHECKLIST_CATEGORIES.ELECTRICAL,
    task: 'Inspect wiper blades and washer fluid',
    critical: false,
  },

  {
    id: 'bdy_01',
    category: CHECKLIST_CATEGORIES.BODY,
    task: 'Inspect cab and cargo body for damage',
    critical: false,
  },
  {
    id: 'bdy_02',
    category: CHECKLIST_CATEGORIES.BODY,
    task: 'Check door locks, hinges and seals',
    critical: false,
  },
  {
    id: 'bdy_03',
    category: CHECKLIST_CATEGORIES.BODY,
    task: 'Verify fire extinguisher present and charged',
    critical: true,
  },
  {
    id: 'bdy_04',
    category: CHECKLIST_CATEGORIES.BODY,
    task: 'Check seat belts for wear and function',
    critical: true,
  },

  {
    id: 'fin_01',
    category: CHECKLIST_CATEGORIES.FINAL,
    task: 'Road test — check braking, steering, and gears',
    critical: true,
  },
  {
    id: 'fin_02',
    category: CHECKLIST_CATEGORIES.FINAL,
    task: 'Confirm no warning lights on dashboard',
    critical: true,
  },
  {
    id: 'fin_03',
    category: CHECKLIST_CATEGORIES.FINAL,
    task: 'Clean vehicle interior',
    critical: false,
  },
  {
    id: 'fin_04',
    category: CHECKLIST_CATEGORIES.FINAL,
    task: 'Document all repairs performed on job card',
    critical: true,
  },
];