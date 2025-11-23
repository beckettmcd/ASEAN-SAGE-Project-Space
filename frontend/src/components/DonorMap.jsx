import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { ASEAN_COUNTRIES } from '../utils/mapData';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map country IDs to codes
const idToCode = {
  '764': 'THA', '704': 'VNM', '360': 'IDN', '608': 'PHL',
  '458': 'MYS', '702': 'SGP', '104': 'MMR', '418': 'LAO',
  '116': 'KHM', '096': 'BRN'
};

export const DonorMap = ({ projects = [], donors = [], selectedCountry, onCountryClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  // Calculate donors per country
  const donorsByCountry = {};
  projects.forEach(project => {
    if (project.isRegional) {
      // Regional projects apply to all countries
      Object.keys(ASEAN_COUNTRIES).forEach(code => {
        if (!donorsByCountry[code]) donorsByCountry[code] = new Set();
        if (project.donorOrganisation) {
          donorsByCountry[code].add(project.donorOrganisation.id);
        }
      });
    } else if (project.country) {
      const code = project.country.code;
      if (!donorsByCountry[code]) donorsByCountry[code] = new Set();
      if (project.donorOrganisation) {
        donorsByCountry[code].add(project.donorOrganisation.id);
      }
    }
  });

  const getCountryColor = (code) => {
    const isSelected = selectedCountry === code;
    const donorCount = donorsByCountry[code]?.size || 0;
    const isHovered = hoveredCountry === code;
    
    if (isSelected) return '#0369a1';
    if (isHovered) return '#0284c7';
    if (donorCount === 0) return '#e5e7eb';
    if (donorCount >= 4) return '#0ea5e9';
    if (donorCount >= 2) return '#38bdf8';
    if (donorCount === 1) return '#7dd3fc';
    return '#e5e7eb';
  };

  const handleCountryClick = (geo) => {
    const countryCode = idToCode[geo.id] || idToCode[geo.properties.a3];
    if (countryCode && onCountryClick) {
      onCountryClick(countryCode);
    }
  };

  const handleMouseEnter = (geo, event) => {
    const countryCode = idToCode[geo.id] || idToCode[geo.properties.a3];
    if (countryCode) {
      setHoveredCountry(countryCode);
      const country = ASEAN_COUNTRIES[countryCode];
      const donorCount = donorsByCountry[countryCode]?.size || 0;
      const donorsList = donors.filter(d => donorsByCountry[countryCode]?.has(d.id));
      const donorNames = donorsList.map(d => d.name).join(', ');
      
      setTooltip({
        show: true,
        content: `${country?.name}: ${donorCount} donor${donorCount !== 1 ? 's' : ''}${donorNames ? ' - ' + donorNames : ''}`,
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleMouseMove = (event) => {
    if (tooltip.show) {
      setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  // Get donors for a specific country
  const getCountryDonors = (countryCode) => {
    const donorIds = donorsByCountry[countryCode];
    if (!donorIds) return [];
    return donors.filter(d => donorIds.has(d.id));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [110, 8],
          scale: 600
        }}
        width={800}
        height={600}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[110, 8]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter(geo => {
                  const code = idToCode[geo.id] || idToCode[geo.properties.a3];
                  return code !== undefined;
                })
                .map((geo) => {
                  const countryCode = idToCode[geo.id] || idToCode[geo.properties.a3];
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryColor(countryCode)}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="cursor-pointer transition-colors duration-200"
                    />
                  );
                })
            }
          </Geographies>

          {/* Donor logo markers */}
          {Object.entries(ASEAN_COUNTRIES).map(([code, country]) => {
            const countryDonors = getCountryDonors(code);
            if (countryDonors.length === 0) return null;

            return (
              <Marker key={code} coordinates={country.coordinates}>
                <g>
                  {countryDonors.slice(0, 4).map((donor, index) => {
                    const radius = 8; // used to keep spacing consistent
                    const spacing = radius * 2.2;
                    const totalWidth = Math.min(countryDonors.length, 4) * spacing;
                    const startX = -(totalWidth / 2) + radius;
                    const size = radius * 2;

                    return (
                      <g key={donor.id} transform={`translate(${startX + index * spacing}, 0)`}>
                        <defs>
                          <clipPath id={`donor-clip-${donor.id}-${code}`}>
                            <rect x={-radius} y={-radius} width={size} height={size} rx={2} ry={2} />
                          </clipPath>
                        </defs>
                        <rect x={-radius} y={-radius} width={size} height={size} fill="white" stroke="#e5e7eb" strokeWidth="1.5" rx={2} ry={2} />
                        {donor.logoUrl && (
                          <image
                            href={donor.logoUrl}
                            x={-radius}
                            y={-radius}
                            width={size}
                            height={size}
                            clipPath={`url(#donor-clip-${donor.id}-${code})`}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-2 py-1 rounded shadow-lg text-xs pointer-events-none"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y + 15
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
