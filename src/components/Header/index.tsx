import styles from "./styles.module.css";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerTitle}>
        <h1>Country Explorer</h1>
      </header>
      <div className={styles.dropdown}>
        <select>
          <option value='Americas'>Americas</option>
          <option value='Europe'>Europe</option>
          <option value='Asia'>Asia</option>
        </select>
      </div>
    </div>
  );
};
