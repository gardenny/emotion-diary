import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DiaryEditor.module.css';

import Button from '../Button/Button';
import Header from '../Header/Header';
import EmotionItem from '../EmotionItem/EmotionItem';
import { DiaryDispatchContext } from '../../App';

import getStringDate from '../../util/date';
import { emotionList } from '../../util/emotion';

export default function DiaryEditor({ isEdit, originalDiary }) {
  const [date, setDate] = useState(getStringDate(new Date())); // 오늘 날짜를 초기값으로 설정
  const [emotion, setEmotion] = useState(3);
  const [content, setContent] = useState('');
  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  const contentRef = useRef();

  const navigate = useNavigate();
  const handleClickEmotion = useCallback(emotion => setEmotion(emotion), []);
  const handleSubmit = () => {
    if (content.trim().length === 0) {
      alert('일기 내용을 작성해주세요!');
      contentRef.current.focus();
      return;
    }

    if (window.confirm(isEdit ? '일기를 수정할까요?' : '새로운 일기를 작성할까요?')) {
      if (isEdit) {
        onEdit(originalDiary.id, date, content, emotion);
        alert('일기를 수정했어요!');
      } else {
        onCreate(date, content, emotion);
        alert('일기를 작성했어요!');
      }
      navigate('/', { replace: true }); // 뒤로 가기 제어
    }
  };
  const handleRemove = () => {
    if (window.confirm('일기를 삭제할까요?')) {
      alert('일기가 삭제되었어요!');
      onRemove(originalDiary.id);
      navigate('/', { replace: true });
    }
  };

  // 수정 모드일 경우, 해당 날짜로 세팅
  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originalDiary.date))));
      setContent(originalDiary.content);
      setEmotion(originalDiary.emotion);
    }
  }, [isEdit, originalDiary]);

  return (
    <>
      <Header
        text={isEdit ? '일기 수정하기' : '새로운 일기'}
        leftBtn={<Button text={'< 뒤로 가기'} onClick={() => navigate(-1)} />}
        rightBtn={isEdit && <Button type={'negative'} text={'삭제하기'} onClick={handleRemove} />}
      />
      <div className={styles.editor}>
        <section className={styles.section}>
          <h4 className={styles.title}>오늘의 날짜</h4>
          <div>
            <input className={styles.input_date} type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </section>
        <section className={styles.section}>
          <h4 className={styles.title}>오늘의 감정</h4>
          <div className={styles.emotion}>
            {emotionList.map(item => (
              <EmotionItem
                key={item.emotion_score}
                {...item}
                onClick={handleClickEmotion}
                isSelected={item.emotion_score === emotion}
              />
            ))}
          </div>
        </section>
        <section className={styles.section}>
          <h4 className={styles.title}>오늘의 일기</h4>
          <div>
            <textarea
              className={styles.textarea}
              ref={contentRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="오늘 하루는 어땠나요?"
            ></textarea>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.group}>
            <Button text={'취소하기'} onClick={() => navigate(-1)} />
            <Button type={'positive'} text={'작성 완료'} onClick={handleSubmit} />
          </div>
        </section>
      </div>
    </>
  );
}
