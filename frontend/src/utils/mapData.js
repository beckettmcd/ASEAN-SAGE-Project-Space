// ASEAN Country data for map visualization

export const ASEAN_COUNTRIES = {
  THA: {
    name: 'Thailand',
    code: 'THA',
    coordinates: [100.5, 13.75],
    flagCode: 'TH'
  },
  VNM: {
    name: 'Vietnam',
    code: 'VNM',
    coordinates: [108.0, 14.0],
    flagCode: 'VN'
  },
  IDN: {
    name: 'Indonesia',
    code: 'IDN',
    coordinates: [113.0, -2.5],
    flagCode: 'ID'
  },
  PHL: {
    name: 'Philippines',
    code: 'PHL',
    coordinates: [122.0, 12.0],
    flagCode: 'PH'
  },
  MYS: {
    name: 'Malaysia',
    code: 'MYS',
    coordinates: [101.5, 4.0],
    flagCode: 'MY'
  },
  SGP: {
    name: 'Singapore',
    code: 'SGP',
    coordinates: [103.8, 1.3],
    flagCode: 'SG'
  },
  MMR: {
    name: 'Myanmar',
    code: 'MMR',
    coordinates: [96.0, 21.0],
    flagCode: 'MM'
  },
  LAO: {
    name: 'Laos',
    code: 'LAO',
    coordinates: [102.5, 18.0],
    flagCode: 'LA'
  },
  KHM: {
    name: 'Cambodia',
    code: 'KHM',
    coordinates: [105.0, 12.5],
    flagCode: 'KH'
  },
  BRN: {
    name: 'Brunei',
    code: 'BRN',
    coordinates: [114.5, 4.5],
    flagCode: 'BN'
  }
};

export const getCountryColor = (assignmentCount, status) => {
  if (assignmentCount === 0) return '#e5e7eb'; // gray-200
  if (status === 'Mobilising') return '#f59e0b'; // amber-500
  return '#0ea5e9'; // primary-500 (blue)
};

export const getCountryByCode = (code) => {
  return ASEAN_COUNTRIES[code];
};

export const getAllASEANCountries = () => {
  return Object.values(ASEAN_COUNTRIES);
};

