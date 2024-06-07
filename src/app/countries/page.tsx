'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { supabase } from '../../supabaseClient';
import { FilterByRegionOrName } from '../../components/FilterByRegionOrName';
import { client } from '../../libs/DB';
import { getCurrencyDisplay, getFirstItem } from '../../libs/utils';

import { Country } from '../../types/Countries';
import { API_URL } from '../../../config';
import styles from './styles.module.css';

const ListOfCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/auth/login');
      } else {
        setUser(session.user);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/all`);
        const data: Country[] = await response.json();
        setCountries(data);
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
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }
      const userId = user?.id;
      const selectQuery =
        'SELECT 1 FROM countries_to_visit WHERE user_id = ? AND country_code = ?';

      const selectResponse = await client.execute({
        sql: selectQuery,
        args: [userId, country_code],
      });

      if (selectResponse.rows.length === 0) {
        const insertQuery =
          'INSERT INTO countries_to_visit (user_id, country_code) VALUES (?, ?)';
        await client.execute({
          sql: insertQuery,
          args: [userId, country_code],
        });
      } else {
        console.error('Country already in want to go list');
      }
    } catch (error) {
      console.error('Failed to save want to go:', error);
    }
  };

  const handleHaveGone = async (country_code: string) => {
    try {
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }
      const userId = user?.id;
      const selectQuery =
        'SELECT 1 FROM countries_have_visited WHERE user_id = ? AND country_code = ?';

      const selectResponse = await client.execute({
        sql: selectQuery,
        args: [userId, country_code],
      });

      if (selectResponse.rows.length === 0) {
        const insertQuery =
          'INSERT INTO countries_have_visited (user_id, country_code) VALUES (?, ?)';
        await client.execute({
          sql: insertQuery,
          args: [userId, country_code],
        });
      } else {
        console.log('Country already in have visited list');
      }
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
