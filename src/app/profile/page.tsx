'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { supabase } from '../../supabaseClient';
import { client } from '../../libs/DB';
import { Country } from '../../types/Countries';
import { API_URL } from '../../../config';
import styles from './styles.module.css';
import CountryCard from '../../components/countryCard';

type SetterFunction = (countries: Country[]) => void;

const sortCountriesAlphabetically = (countries: Country[]) => {
  return countries.sort((a, b) => a.name.official.localeCompare(b.name.official));
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('wantToGo');
  const [wantToGoCountries, setWantToGoCountries] = useState<Country[]>([]);
  const [haveVisitedCountries, setHaveVisitedCountries] = useState<Country[]>(
    []
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (!user) return;

    const fetchCountryDetails = async (
      sqlQuery: string,
      setter: SetterFunction
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.execute({
          sql: sqlQuery,
          args: [user.id],
        });

        if (!response.rows || response.rows.length === 0) {
          setter([]);
          return;
        }

        const countriesCode = response.rows
          .map((row) => row.country_code)
          .join(',');
        const countriesResponse = await fetch(
          `${API_URL}/alpha?codes=${countriesCode}`
        );
        const countriesData: Country[] = await countriesResponse.json();
        setter(sortCountriesAlphabetically(countriesData));
      } catch (error) {
        setError('Failed to fetch countries.');
        setter([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails(
      'SELECT * FROM countries_to_visit WHERE user_id = ?',
      setWantToGoCountries
    );
    fetchCountryDetails(
      'SELECT * FROM countries_have_visited WHERE user_id = ?',
      setHaveVisitedCountries
    );
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.buttonsToGo}>
        <button
          className={`${styles.button} ${
            activeTab === 'wantToGo'
              ? styles.activeButton
              : styles.inactiveButton
          }`}
          onClick={() => setActiveTab('wantToGo')}
        >
          Countries I Want to Go
        </button>
        <button
          className={`${styles.button} ${
            activeTab === 'haveVisited'
              ? styles.activeButton
              : styles.inactiveButton
          }`}
          onClick={() => setActiveTab('haveVisited')}
        >
          Countries I Have Visited
        </button>
      </div>
      <div className={styles.titleNumbers}>
        {activeTab === 'haveVisited' && (
          <div className={styles.count}>
            Number of countries I have visited: {haveVisitedCountries.length}
          </div>
        )}
      </div>
      <div className={styles.container}>
        {loading ? (
          <div>Loading countries...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          (activeTab === 'wantToGo'
            ? wantToGoCountries
            : haveVisitedCountries
          ).map((country) => (
            <CountryCard key={country.name.official} country={country} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
