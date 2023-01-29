import styles from './Header.module.css';

export default function Header({ text, leftBtn, rightBtn }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>{leftBtn}</div>
      <div className={styles.title}>{text}</div>
      <div className={styles.right}>{rightBtn}</div>
    </header>
  );
}
