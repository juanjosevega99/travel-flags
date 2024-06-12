'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getCurrencyDisplay, getFirstItem } from '../../libs/utils';
import { Country } from '../../types/Countries';
import styles from './styles.module.css';

type CountryCardProps = {
  country: Country;
  onWantToGo?: (country_code: string) => void;
  onHaveGone?: (country_code: string) => void;
};

const CountryCard = ({ country, onWantToGo, onHaveGone }: CountryCardProps) => {
  return (
    <div key={country.name.official} className={styles.country_card}>
      <Link href='/countries/[code]' as={`/countries/${country.cca2.toLowerCase()}`}>
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
            <p>Language: {country.languages ? getFirstItem(Object.values(country.languages)) : 'N/A'}</p>
            <p>Currency: {country.currencies ? getCurrencyDisplay(country.currencies) : 'N/A'}</p>
          </div>
        </div>
      </Link>
      {onWantToGo && onHaveGone && (
        <div className={styles.buttons_container}>
          <button className={styles.button} onClick={() => onWantToGo(country.cca2)}>I want to go</button>
          <button className={styles.button} onClick={() => onHaveGone(country.cca2)}>I have already gone</button>
        </div>
      )}
    </div>
  );
};

export default CountryCard;
