import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryStateContext } from '../App';

import Header from '../components/Header/Header';
import Button from '../components/Button/Button';

import getStringDate from '../util/date';
import { emotionList } from '../util/emotion';

export default function Diary() {
  const [diary, setDiary] = useState();
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();

  useEffect(() => {
    const title = document.querySelector('title');
    title.innerText = '감정 일기장 - 상세 페이지';
  }, []);

  useEffect(() => {
    if (diaryList.length) {
      const targetDiary = diaryList.find(diary => diary.id === id);
      if (targetDiary) {
        // 일기가 존재할 때
        setDiary(targetDiary);
      } else {
        // 일기가 존재하지 않을 때
        navigate('/', { replace: true });
      }
    }
  }, [id, diaryList, navigate]);

  if (!diary) {
    return <div className="detail">로딩 중입니다...</div>;
  } else {
    const currentEmotion = emotionList.find(emotion => parseInt(emotion.emotion_score) === parseInt(diary.emotion));
    return (
      <>
        <Header
          text={getStringDate(new Date(diary.date))}
          leftBtn={<Button text={'< 뒤로 가기'} onClick={() => navigate(-1)} />}
          rightBtn={<Button text={'수정하기'} onClick={() => navigate(`/edit/${diary.id}`)} />}
        />
        <div className="detail">
          <section className="section">
            <h4 className="title">오늘의 감정</h4>
            <div className={[`emotion`, `emotion_${currentEmotion.emotion_score}`].join(' ')}>
              <img src={currentEmotion.emotion_image} alt="emotion" />
              <p className="description">{currentEmotion.emotion_description}</p>
            </div>
          </section>
          <section className="section">
            <h4 className="title">오늘의 일기</h4>
            <div className="content">{diary.content}</div>
          </section>
        </div>
      </>
    );
  }
}
