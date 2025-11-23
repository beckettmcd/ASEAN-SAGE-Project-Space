import TH from 'country-flag-icons/react/3x2/TH';
import VN from 'country-flag-icons/react/3x2/VN';
import ID from 'country-flag-icons/react/3x2/ID';
import PH from 'country-flag-icons/react/3x2/PH';
import MY from 'country-flag-icons/react/3x2/MY';
import SG from 'country-flag-icons/react/3x2/SG';
import MM from 'country-flag-icons/react/3x2/MM';
import LA from 'country-flag-icons/react/3x2/LA';
import KH from 'country-flag-icons/react/3x2/KH';
import BN from 'country-flag-icons/react/3x2/BN';

const flagComponents = {
  THA: TH,
  VNM: VN,
  IDN: ID,
  PHL: PH,
  MYS: MY,
  SGP: SG,
  MMR: MM,
  LAO: LA,
  KHM: KH,
  BRN: BN
};

export const CountryFlag = ({ countryCode, size = 32, className = '' }) => {
  // Handle ASEAN regional assignments
  if (countryCode === 'ASEAN' || !countryCode) {
    return (
      <div className={`inline-flex items-center ${className}`} style={{ width: size }}>
        <img 
          src="/assets/asean-seal.png" 
          alt="ASEAN" 
          className="rounded shadow-sm" 
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  const FlagComponent = flagComponents[countryCode];
  
  if (!FlagComponent) {
    return (
      <div 
        className={`inline-flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xs rounded ${className}`}
        style={{ width: size, height: size * 0.67 }}
      >
        {countryCode}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`} style={{ width: size }}>
      <FlagComponent className="rounded shadow-sm" style={{ width: size, height: size * 0.67 }} />
    </div>
  );
};
