import styles from './styles.module.css';

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerTitle}>
        <h1>Country Explorer</h1>
      </header>
      Dark Mode
    </div>
  );
};
