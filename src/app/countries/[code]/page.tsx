import Image from 'next/image';

import { getCountryDetails } from '../../../api/countriesAPI';

interface CountryDetailsProps {
  params: {
    code: string;
  };
}

const CountryDetails: React.FC<CountryDetailsProps> = async ({
  params: { code },
}) => {
  const country = await getCountryDetails(code);

  return (
    <div>
      <Image
        src={country.flags.svg || country.flags.png}
        alt='Landscape picture'
        width={250}
        height={250}
      />
      <h3>{country.name.common}</h3>
      <h3>{country.capital}</h3>
    </div>
  );
};

export default CountryDetails;
