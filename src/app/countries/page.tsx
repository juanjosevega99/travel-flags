'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { supabase } from '../../supabaseClient';
import { FilterByRegionOrName } from '../../components/FilterByRegionOrName';
import { client } from '../../libs/DB';

import { Country } from '../../types/Countries';
import { API_URL } from '../../../config';
import styles from './styles.module.css';
import CountryCard from '../../components/countryCard';

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
          <CountryCard
            key={country.name.official}
            country={country}
            onWantToGo={handleWantToGo}
            onHaveGone={handleHaveGone}
          />
        ))}
      </div>
    </div>
  );
};

export default ListOfCountries;
