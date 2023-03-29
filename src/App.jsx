import { createContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { v4 as uuid } from 'uuid';

import Home from './pages/Home';
import New from './pages/New';
import Edit from './pages/Edit';
import Diary from './pages/Diary';

// Reducer
const reducer = (diary, action) => {
  let newDiary = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      newDiary = [action.data, ...diary];
      break;
    }
    case 'REMOVE': {
      newDiary = diary.filter(item => item.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newDiary = diary.map(item => (item.id === action.data.id ? { ...action.data } : item));
      break;
    }
    default:
      return diary;
  }
  localStorage.setItem('diary', JSON.stringify(newDiary));
  return newDiary;
};

// Context
export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

const diaryExample = [
  {
    id: uuid(),
    emotion: 1,
    content: '첫 번째 일기',
    date: 1680086426187,
  },
  {
    id: uuid(),
    emotion: 2,
    content: '두 번째 일기',
    date: 1679616426187,
  },
  {
    id: uuid(),
    emotion: 3,
    content: '세 번째 일기',
    date: 1679116426187,
  },
  {
    id: uuid(),
    emotion: 4,
    content: '네 번째 일기',
    date: 1678616426187,
  },
  {
    id: uuid(),
    emotion: 5,
    content: '다섯 번째 일기',
    date: 1678086426187,
  },
];

export default function App() {
  const [diary, dispatch] = useReducer(reducer, diaryExample);

  // 로컬 스토리지에서 기존의 일기 목록 가져오기
  useEffect(() => {
    const getDiary = localStorage.getItem('diary');
    if (getDiary) {
      const diaryList = JSON.parse(getDiary);
      dispatch({ type: 'INIT', data: diaryList });
    }
  }, []);

  // CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: uuid(),
        content,
        date: new Date(date).getTime(),
        emotion,
      },
    });
  };

  // REMOVE
  const onRemove = targetId => [dispatch({ type: 'REMOVE', targetId })];

  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: 'EDIT',
      data: {
        id: targetId,
        content,
        date: new Date(date).getTime(),
        emotion,
      },
    });
  };

  // Set mobile screen
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  return (
    <DiaryStateContext.Provider value={diary}>
      <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
        <BrowserRouter>
          <div className="diary">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}
