'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Header } from '../../components/Header';
import { FilterByRegionOrName } from '../../components/FilterByRegionOrName';
import { getAllCountries } from '../../api/countriesAPI';
import { Country } from '../../types/Countries';
import styles from './styles.module.css';

export const ListOfCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredCountries = countries.filter((country) => {
    if (selectedRegion) {
      return country.region === selectedRegion;
    }
    return true;

    // Apply the search filter
    const searchFilter =
      searchTerm === '' ||
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase());

    return regionFilter && searchFilter;
  });

  return (
    <div>
      <Header />
      <FilterByRegionOrName
        onRegionSelect={handleRegionSelect}
        onSearch={handleSearch}
      />
      {filteredCountries.map((country) => (
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
