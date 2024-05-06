'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { API_URL } from '../../../../config';
import { Country } from '../../../types/Countries';

interface CountryDetailsProps {
  params: {
    code: string;
  };
}

const CountryDetails: React.FC<CountryDetailsProps> = ({
  params: { code },
}) => {
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(`${API_URL}/alpha/${code}`);
        const data: Country[] = await response.json();
        setCountry(data[0]);
      } catch (error) {
        console.error('Failed to fetch country:', error);
      }
    };

    fetchCountry();
  }, [code]);

  if (!country) {
    return <div>Loading...</div>; // Display loading or handle this case appropriately
  }

  return (
    <div>
      <Image
        src={country.flags.svg || country.flags.png}
        alt={`${country.name.common} flag`}
        width={250}
        height={250}
      />
      <h3>{country.name.common}</h3>
      <h3>Capital: {country.capital}</h3>

      <div>
        <h4>Maps:</h4>
        <p>
          {/* TODO: check the map here */}
          {/* <Link href={country.maps.googleMaps} target='_blank'>
            Google Maps
          </Link> */}
        </p>
      </div>
    </div>
  );
};

export default CountryDetails;
