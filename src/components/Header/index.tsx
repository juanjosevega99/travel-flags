import Link from 'next/link';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <div className={styles.header_container}>
      <header className={styles.header_title}>
        <Link href='/'>
          <h1>Country Explorer</h1>
        </Link>
      </header>
    </div>
  );
};
