import { Country } from '../types/Countries';

const url = `https://restcountries.com/v3.1`;
const fields = 'languages,capital,name,flags,population,region,subregion,cca2,cca3,borders';

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${url}/all?fields=${fields}`);
    if (!response.ok) {
      throw new Error('Failed to fetch countries.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error while fetching countries:', error);
    throw error;
  }
}

export async function getCountryByCode(countryCode: string) {
  try {
    const response = await fetch(`${url}/alpha/${countryCode}?fields=${fields}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${countryCode}.`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Error while fetching details for ${countryCode}:`, error);
    throw error;
  }
}

export async function getCountriesByCode(countriesCode: string) {
  try {
    const response = await fetch(`${url}/alpha?codes=${countriesCode}&fields=${fields}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${countriesCode}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error while fetching details for ${countriesCode}:`, error);
    throw error;
  }
}
