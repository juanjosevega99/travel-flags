'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FilterByRegionOrName } from '../../components/FilterByRegionOrName';
import { getAllCountries } from '../../api/countriesAPI';
import { client } from '../../libs/DB';
import { getCurrencyDisplay, getFirstItem } from '../../libs/utils';

import { Country } from '../../types/Countries';
import styles from './styles.module.css';

const ListOfCountries = () => {
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

    const searchFilter =
      searchTerm === '' ||
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase());

    return regionFilter && searchFilter;
  });

  const handleWantToGo = async (country_code: string) => {
    try {
      // Assume user ID is available or fetched from context/session
      const userId = 1; // Replace with actual user ID retrieval logic
      const query =
        'INSERT INTO countries_to_visit (user_id, country_code) VALUES (?, ?)';

      await client.execute({
        sql: query,
        args: [userId, country_code],
      });
    } catch (error) {
      console.error('Failed to save want to go:', error);
    }
  };

  const handleHaveGone = async (country_code: string) => {
    try {
      const userId = 1; // Replace with actual user ID retrieval logic
      // const response = await haveGone(userId, country_code);
      const query =
        'INSERT INTO countries_have_visited (user_id, country_code) VALUES (?, ?)';

      await client.execute({ sql: query, args: [userId, country_code] });
    } catch (error) {
      console.error('Failed to save have gone:', error);
    }
  };

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
            <div className={styles.buttons_container}>
              <button
                className={styles.button}
                onClick={() => handleWantToGo(country.cca2)}
              >
                I want to go
              </button>
              <button
                className={styles.button}
                onClick={() => handleHaveGone(country.cca2)}
              >
                I have already gone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfCountries;
