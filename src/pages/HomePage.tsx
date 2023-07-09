import { useEffect, useState } from 'react';
import { getAllCountries } from '../api/countriesAPI';
import { Country } from '../types/Countries';

export const Home = () => {
  const [countries, setCountries] = useState<Country>();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await getAllCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <h2>All Countries</h2>
      <ul>
        {countries.map((country) => {
          <li key={country.name}>{country.name}</li>
        })}
      </ul>
    </div>
  );
};
