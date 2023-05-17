export const formatDate = (selectedDate: string | Date) => {
  const date = new Date(selectedDate);

  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`;
};

export const base64toFile = (baseData: string, filename: string) => {
  const arr = baseData.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
