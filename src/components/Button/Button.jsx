import styles from './Button.module.css';

export default function Button({ type, text, onClick }) {
  const btnType = ['positive', 'negative'].includes(type) ? type : 'default';

  return (
    <button className={`${styles.button} ${btnType}`} onClick={onClick}>
      {text}
    </button>
  );
}

Button.defaultProps = {
  type: 'default',
};
