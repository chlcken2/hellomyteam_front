export const formatDate = (selectedDate: string | Date) => {
  const date = new Date(selectedDate);

  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`;
};
