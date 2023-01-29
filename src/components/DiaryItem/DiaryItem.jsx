import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './DiaryItem.module.css';

function DiaryItem({ id, content, date, emotion }) {
  const navigate = useNavigate();
  const dateString = new Date(parseInt(date)).toLocaleDateString();

  const goDetail = () => navigate(`/diary/${id}`);
  const goEdit = () => navigate(`/edit/${id}`);

  return (
    <div className={styles.item}>
      <div className={`${styles.emotion} emotion_${emotion}`} onClick={goDetail}>
        <img src={`../img/emotion${emotion}.png`} alt="emotion" />
      </div>
      <div className={styles.info} onClick={goDetail}>
        <div className={styles.date}>{dateString}</div>
        <div className={styles.content}>{content}</div>
      </div>
      <div className={styles.button}>
        <Button text={'수정하기'} onClick={goEdit} />
      </div>
    </div>
  );
}

export default memo(DiaryItem);
