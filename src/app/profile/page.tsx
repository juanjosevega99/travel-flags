'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { supabase } from '../../supabaseClient';
import { client } from '../../libs/DB';
import { getFirstItem, getCurrencyDisplay } from '../../libs/utils';
import { Country } from '../../types/Countries';
import { API_URL } from '../../../config';
// import styles from '../countries/styles.module.css';
import styles from './styles.module.css';

type SetterFunction = (countries: Country[]) => void;

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
      console.log('🚀 ~ fetchUser ~ session:', session);
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
        setter(countriesData);
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
      <div>
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
            <div key={country.name.official} className={styles.country_card}>
              <Link
                href='/countries/[code]'
                as={`/countries/${country.cca2.toLowerCase()}`}
              >
                <div className={styles.country_flag}>
                  <Image
                    loader={() => country.flags.png}
                    src={country.flags.png}
                    alt={`${country.name.common} flag`}
                    width={270}
                    height={170}
                  />
                </div>
                <div className={styles.country_info}>
                  <h3 className={styles.country_title}>
                    {country.name.common}
                  </h3>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
