import Link from 'next/link';

import ListOfCountries from './countries/page';

export default function Home() {
  return (
    <>
      <Link href='/'></Link>
      <ListOfCountries />
    </>
  );
}
