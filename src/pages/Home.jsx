import React, { useContext, useEffect, useState } from 'react';
import { DiaryStateContext } from '../App';
import Button from '../components/Button/Button';
import DiaryList from '../components/DiaryList/DiaryList';
import Header from '../components/Header/Header';

export default function Home() {
  const diaryList = useContext(DiaryStateContext);

  const [list, setList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const headerText = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

  useEffect(() => {
    const title = document.querySelector('title');
    title.innerText = '감정 일기장';
  }, []);

  useEffect(() => {
    if (diaryList.length === 0) return;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).getTime();
    setList(diaryList.filter(item => firstDay <= item.date && item.date <= lastDay));
  }, [diaryList, currentDate]);

  const decreaseMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()));
  };
  const increaseMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()));
  };

  return (
    <>
      <Header text={headerText} leftBtn={<Button text={'< 이전 달력'} onClick={decreaseMonth} />} rightBtn={<Button text={'다음 달력 >'} onClick={increaseMonth} />} />
      <DiaryList diaryList={list} />
    </>
  );
}
