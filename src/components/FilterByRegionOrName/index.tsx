import React, { useState } from 'react';

interface FilterByRegionOrNameProps {
  onRegionSelect: (region: string) => void;
  onSearch: (countryName: string) => void;
}

export const FilterByRegionOrName: React.FC<FilterByRegionOrNameProps> = ({
  onRegionSelect,
  onSearch,
}) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const [showRegions, setShowRegions] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');

  const handleRegionToggle = () => {
    setShowRegions((prev) => !prev);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchCountry(search);
    onSearch(search);
  };

  return (
    <div className='filter-container'>
      <button onClick={handleRegionToggle}>Filter by Region</button>
      {showRegions && (
        <div className='region-options'>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => {
                onRegionSelect(region);
                setShowRegions(false);
              }}
            >
              {region}
            </button>
          ))}
        </div>
      )}
      <div className='search-container'>
        <input
          type='text'
          id='search'
          value={searchCountry}
          onChange={handleSearchChange}
          placeholder='Search for a country'
        />
      </div>
    </div>
  );
};
