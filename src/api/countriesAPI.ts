import type { NextApiRequest, NextApiResponse } from 'next';

import { Country } from '../types/Countries';
const url = `https://restcountries.com/v3.1`;

interface ResponseData {
  success: boolean;
  message: string;
}

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

export async function wantToGo(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { userId, countryId } = req.body;
    // TODO: Add database logic to save the 'have gone' data
    res.status(200).json({ success: true, message: 'Marked as have gone' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function haveGone(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { userId, countryId } = req.body;
    // TODO: Add database logic to save the 'have gone' data
    res.status(200).json({ success: true, message: 'Marked as have gone' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
