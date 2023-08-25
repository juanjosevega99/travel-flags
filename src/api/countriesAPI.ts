import { Country } from '../types/Countries';
const url = `https://restcountries.com/v3.1`;

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${url}/all`);
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
    const response = await fetch(`${url}/alpha/${countryCode}`);
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
