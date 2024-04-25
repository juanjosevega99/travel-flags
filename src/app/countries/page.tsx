'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    setSearchTerm('');
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setSelectedRegion('');
  };

  const filteredCountries = countries.filter((country) => {
    const regionFilter =
      selectedRegion === '' || country.region === selectedRegion;

    // Apply the search filter
    const searchFilter =
      searchTerm === '' ||
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase());

    return regionFilter && searchFilter;
  });

  function getFirstItem(data: any): string {
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    if (typeof data === 'string') {
      return data;
    }
    return 'N/A';
  }

  function getCurrencyDisplay(currencies: any): string {
    const currencyCode = Object.keys(currencies)[0];
    const currency = currencies[currencyCode];
    if (currency) {
      return `${currency.name} (${currency.symbol})`;
    }
    return 'N/A';
  }

  return (
    <div>
      <FilterByRegionOrName
        onRegionSelect={handleRegionSelect}
        onSearch={handleSearch}
      />
      <div className={styles.container}>
        {filteredCountries.map((country) => (
          <div key={country.name.official} className={styles.country_card}>
            <Link
              href='/countries/[code]'
              as={`/countries/${country.cca2.toLowerCase()}`}
            >
              <div className={styles.country_flag}>
                <Image
                  loader={() => country.flags.png}
                  // src={country.flags.svg || country.flags.png}
                  src={country.flags.png}
                  alt='Landscape picture'
                  width={270}
                  height={170}
                />
              </div>
              <div className={styles.country_info}>
                <h3 className={styles.country_title}>{country.name.common}</h3>
                <div>
                  <p>Capital: {getFirstItem(country.capital)}</p>
                  <p>
                    Language:{' '}
                    {country.languages
                      ? getFirstItem(Object.values(country.languages))
                      : 'N/A'}
                  </p>
                  <p>
                    Currency:{' '}
                    {country.currencies
                      ? getCurrencyDisplay(country.currencies)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
