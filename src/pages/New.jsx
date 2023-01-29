import { useEffect } from 'react';
import DiaryEditor from '../components/DiaryEditor/DiaryEditor';

export default function New() {
  useEffect(() => {
    const title = document.querySelector('title');
    title.innerText = '감정 일기장 - 새로운 일기';
  }, []);

  return <DiaryEditor />;
}
