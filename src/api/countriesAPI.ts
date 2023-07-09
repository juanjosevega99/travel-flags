const url = `https://restcountries.com/v2/all`;

interface Country {
  name: string;
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(url);
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
