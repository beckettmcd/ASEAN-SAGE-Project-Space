import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { ASEAN_COUNTRIES, getAllASEANCountries } from '../utils/mapData';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map country IDs to codes
const idToCode = {
  '764': 'THA', '704': 'VNM', '360': 'IDN', '608': 'PHL',
  '458': 'MYS', '702': 'SGP', '104': 'MMR', '418': 'LAO',
  '116': 'KHM', '096': 'BRN'
};

export const ASEANMap = ({ assignmentCounts = {}, selectedCountry, onCountryClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const getCountryColor = (code) => {
    const count = assignmentCounts[code] || 0;
    const isSelected = selectedCountry === code;
    const isHovered = hoveredCountry === code;
    
    if (isSelected) return '#0369a1';
    if (isHovered) return '#0284c7';
    if (count === 0) return '#e5e7eb';
    if (count >= 3) return '#0ea5e9';
    if (count >= 1) return '#38bdf8';
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
      const count = assignmentCounts[countryCode] || 0;
      setTooltip({
        show: true,
        content: `${country?.name}: ${count} assignment${count !== 1 ? 's' : ''}`,
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

  // Get regional assignment count (assignments without countryId)
  const regionalCount = assignmentCounts['ASEAN'] || 0;

  // Sort countries by assignment count
  const sortedCountries = getAllASEANCountries()
    .map(country => ({
      ...country,
      count: assignmentCounts[country.code] || 0
    }))
    .sort((a, b) => b.count - a.count);

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

          {/* Assignment count markers */}
          {Object.entries(ASEAN_COUNTRIES).map(([code, country]) => {
            const count = assignmentCounts[code] || 0;
            if (count === 0) return null;

            return (
              <Marker key={code} coordinates={country.coordinates}>
                <g>
                  <circle r={9} fill="#dc2626" stroke="#ffffff" strokeWidth={2} />
                  <text
                    textAnchor="middle"
                    y={3.5}
                    style={{
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '10px',
                      fill: '#ffffff',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}
                  >
                    {count}
                  </text>
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
