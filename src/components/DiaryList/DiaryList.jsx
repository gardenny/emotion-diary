import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Button/Button';
import DiaryItem from '../DiaryItem/DiaryItem';
import styles from './DiaryList.module.css';

const sortOptionList = [
  { value: 'latest', name: '최신순' },
  { value: 'oldest', name: '오래된 순' },
];
const filterOptionList = [
  { value: 'all', name: '전체 보기' },
  { value: 'good', name: '좋은 감정만' },
  { value: 'bad', name: '나쁜 감정만' },
];

// Select Component
const ControlMenu = memo(({ value, onChange, optionList }) => {
  return (
    // onChange 이벤트 발생 시, setSortType 함수를 통해
    // sortType의 상태값이(value) e.target.value로 변경됨
    <select className={styles.select} value={value} onChange={e => onChange(e.target.value)}>
      {optionList.map((item, index) => (
        <option className={styles.option} key={index} value={item.value}>
          {item.name}
        </option>
      ))}
    </select>
  );
});

export default function DiaryList({ diaryList }) {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('latest');
  const [filter, setFilter] = useState('all');

  const getProcessedDiaryList = () => {
    const filteringEmotion = item => {
      if (filter === 'good') {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    // 비교 정렬 함수
    const compare = (a, b) => {
      if (sortType === 'latest') {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    // 그냥 sort 함수를 사용하면 기존의 배열 자체가 정렬되므로
    // 먼저 diaryList 배열을 JSON 형태의 문자열로 변환한 후에
    // 다시 자바스크립트 배열의 형태로 복구시킴으로써 깊은 복사가 이루어짐
    const copyList = JSON.parse(JSON.stringify(diaryList));
    const filteredList = filter === 'all' ? copyList : copyList.filter(item => filteringEmotion(item));
    const sortedList = filteredList.sort(compare); // 감정 점수 기준으로 필터링된 배열을 sort
    return sortedList;
  };

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.left}>
          <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList} />
          <ControlMenu value={filter} onChange={setFilter} optionList={filterOptionList} />
        </div>
        <div className={styles.right}>
          <Button type={'positive'} text={'새 일기 쓰기'} onClick={() => navigate('/new')} />
        </div>
      </div>
      <div className={styles.list}>
        {getProcessedDiaryList().map(diary => (
          <DiaryItem key={diary.id} {...diary} />
        ))}
      </div>
    </>
  );
}

DiaryList.defaultProps = {
  diaryList: [],
};
