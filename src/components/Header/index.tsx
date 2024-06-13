import Link from 'next/link';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <div>
      <header className={styles.header_container}>
        <Link href='/'>
          <h1>Country Explorer</h1>
        </Link>
        <Link href='/profile'>
          <h1 className={styles.header_link}>Profile</h1>
        </Link>
      </header>
    </div>
  );
};
