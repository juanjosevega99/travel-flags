'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { client } from '../../libs/DB';
import { getFirstItem, getCurrencyDisplay } from '../../libs/utils';
import { Country } from '../../types/Countries';
import { getCountriesByCode } from '../../api/countriesAPI';
import styles from '../countries/styles.module.css';

type SetterFunction = (countries: Country[]) => void;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('wantToGo');
  const [wantToGoCountries, setWantToGoCountries] = useState<Country[]>([]);
  const [haveVisitedCountries, setHaveVisitedCountries] = useState<Country[]>(
    []
  );

  useEffect(() => {
    const fetchCountryDetails = async (
      sqlQuery: string,
      setter: SetterFunction
    ): Promise<void> => {
      try {
        const response = await client.execute({
          sql: sqlQuery,
          args: [1], // Replace '1' with the actual user ID
        });
        const codes = response.rows.map((row) => row.country_code).join(',');
        const countries = await getCountriesByCode(codes);
        setter(countries);
      } catch (error) {
        console.error('Failed to fetch countries to visit:', error);
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
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('wantToGo')}>
          Countries I Want to Go
        </button>
        <button onClick={() => setActiveTab('haveVisited')}>
          Countries I Have Visited
        </button>
      </div>
      <div className={styles.container}>
        {(activeTab === 'wantToGo'
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

export default Profile;
