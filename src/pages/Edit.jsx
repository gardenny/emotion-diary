import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryStateContext } from '../App';
import DiaryEditor from '../components/DiaryEditor/DiaryEditor';

export default function Edit() {
  const [originalDiary, setOriginalDiary] = useState();
  const { id } = useParams(); // 전달 받은 id 꺼내옴
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();

  useEffect(() => {
    const title = document.querySelector('title');
    title.innerText = '감정 일기장 - 수정하기';
  }, []);

  useEffect(() => {
    if (diaryList) {
      const targetDiary = diaryList.find(diary => diary.id === id);
      if (targetDiary) {
        setOriginalDiary(targetDiary);
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [id, diaryList, navigate]);

  return <>{originalDiary && <DiaryEditor isEdit={true} originalDiary={originalDiary} />}</>;
}
