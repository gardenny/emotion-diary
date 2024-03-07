![diary](https://user-images.githubusercontent.com/110226567/215329946-b0b7878b-a051-4f99-bbc1-86f792702fad.png)

# 📔 Emotion diary

나만의 작은 감정 일기장 👉 [Demo](https://emotion-diary-jone.web.app/)

<br />

## 📢 프로젝트 개요

오늘의 감정과 함께 간단한 일기를 작성할 수 있는 감정 일기장입니다.<br />
일기는 월 단위로 기록되며, 원하는 기준에 따라 목록을 정렬할 수 있습니다.<br />
기존의 투두 리스트보다는 조금 더 참신한 프로젝트를 진행하고 싶어 제작하게 되었습니다.

<br />

## 🗨️ 사용 기술

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/React Router-CA4245?style=flat-square&logo=React-Router&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=PostCSS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=Firebase&logoColor=white"/>
</p>

<br />

## 📋 주요 기능

- 새로운 일기 작성
- 일기 수정 및 삭제
- 최신순 / 오래된 순 정렬
- 좋은 감정만 / 나쁜 감정만 정렬
- 일기 목록 월 단위로 열람 가능

<br />

## 💻 소스 코드

전체 코드 보러 가기 👉 [Notion](https://imjone.notion.site/Emotion-diary-8a01a0f8e2fd43e2b84576eb631f6fb2?pvs=4)

### 📍 리듀서 및 디스패치 함수 정의

먼저 일기 추가/수정/삭제 기능을 담당할 리듀서와 디스패치 함수를 정의합니다.<br />
`onCreate`, `onRemove`, `onEdit`을 통해 필요한 정보를 인자로 넣어서 디스패치 함수를 호출하면,<br />
리듀서 내부에서는 각 케이스마다 전달 받은 `action.type`에 따라 적절하게 새로운 상태를 반환합니다.

```javascript
// reducer
const [diary, dispatch] = useReducer(reducer, []);

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
  return newDiary;
};
```

```javascript
// dispatch
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

const onRemove = targetId => [dispatch({ type: 'REMOVE', targetId })];

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
```

### 📍 Context 생성 및 공급

자주 사용될 것 같은 전체 일기 데이터와 특정 행동에 필요한 함수들을 Context로 생성하여 공급합니다.<br />
`DiaryStateContext`를 생성한 후, Provider의 `value`로 원하는 데이터를 객체 형태로 묶어서 전달해줍니다.

```javascript
// App.jsx

export const DiaryStateContext = createContext(); // 일기 데이터
export const DiaryDispatchContext = createContext(); // 디스패치 함수

<DiaryStateContext.Provider value={diary}>
  <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
    { ... }
  </DiaryDispatchContext.Provider>
</DiaryStateContext.Provider>
```

### 📍 일기 목록 날짜순 정렬

기준값이 되는 `sortType`을 정의한 후 정렬 기준이 최신순(lastest)인지 오래된 순(oldest)인지에 따라서,<br />
`compare()` 함수를 통해 1차적으로 정렬 과정을 거친 후에 새로운 배열로 복사하여 다시 최종 정렬을 해줍니다.<br />
sort된 배열은 `sortedList` 라는 변수에 할당되며, `getProcessedDiaryList()` 함수의 최종 리턴 값이 됩니다.<br />

```javascript
// DiaryList.jsx

const sortOptionList = [
  { value: 'latest', name: '최신순' },
  { value: 'oldest', name: '오래된 순' },
];

// Select Component
const ControlMenu = ({ value, onChange, optionList }) => {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {optionList.map((item, index) => (
        <option key={index} value={item.value}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

export default function DiaryList({ diaryList }) {
  const [sortType, setSortType] = useState('latest');

  const getProcessedDiaryList = () => {
    const compare = (a, b) => {
      if (sortType === 'latest') {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    const copyList = JSON.parse(JSON.stringify(diaryList));
    const sortedList = copyList.sort(compare);
    return sortedList;
  };

  return (
    <div>
      <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList} />
      {getProcessedDiaryList().map(diary => (
        <DiaryItem key={diary.id} {...diary} />
      ))}
    </div>
  );
}

DiaryList.defaultProps = {
  diaryList: [],
};
```

<br />

## 😊 배운 점 및 느낀 점

- 리액트에서 어떤 식으로 UI를 컴포넌트 단위로 쪼개어서 표기해 나갈 수 있는지 큰 틀을 이해할 수 있었습니다.
- 목록 정렬 및 월 단위 날짜 계산 등 나름 여러 가지 시도를 통해 다양한 기능 구현에 대한 시야를 넓힐 수 있었습니다.
- 컴포넌트 최적화에 대한 이해도가 부족하다고 느꼈고, 부족함을 느낀 만큼 더욱 열심히 공부해야겠다고 다짐하였습니다.
