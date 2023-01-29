import React, { memo } from 'react';
import styles from './EmotionItem.module.css';

function EmotionItem({ emotion_score, emotion_image, emotion_description, onClick, isSelected }) {
  return (
    <div
      className={`${styles.item} ${isSelected ? `emotion_${emotion_score}` : 'emotion_default'}`}
      onClick={() => onClick(emotion_score)}
    >
      <img className={styles.img} src={emotion_image} alt="emotion" />
      <span className={styles.text}>{emotion_description}</span>
    </div>
  );
}

export default memo(EmotionItem);
