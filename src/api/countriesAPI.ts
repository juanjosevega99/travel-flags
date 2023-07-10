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

export async function getCountryDetails(countryName: string) {
  try {
    const response = await fetch(`${url}/name/${countryName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${countryName}.`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Error while fetching details for ${countryName}:`, error);
    throw error;
  }
}
