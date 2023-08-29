'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


import { Header } from '../../components/Header';
import { getAllCountries } from '../../api/countriesAPI';
import { Country } from '../../types/Countries';

export const ListOfCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await getAllCountries();
        setCountries(countriesData);
      } catch (error) {
        // Handle error
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <Header />
      {/* {countries.slice(0, 5).map((country) => ( */}
      {countries.map((country) => (
        <section key={country.name.official}>
          <Link
            href='/countries/[code]'
            as={`/countries/${country.cca2.toLowerCase()}`}
          >
            {country.flags && (
              <Image
                src={country.flags.svg || country.flags.png}
                alt='Landscape picture'
                width={250}
                height={250}
              />
            )}
            <h2>{country.name.common}</h2>
          </Link>
        </section>
      ))}
    </div>
  );
};
