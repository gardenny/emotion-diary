// date input의 초기값으로 표기될 날짜를 세팅해주는 함수
export default function getStringDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) month = `0${month}`;
  if (day < 10) month = `0${day}`;

  return `${year}-${month}-${day}`;
}
