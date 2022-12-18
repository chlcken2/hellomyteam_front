import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DEV_BASE_URL, PROD_BASE_URL } from './constants/urls';

const App: React.FC = () => {
  const [hello, setHello] = useState('');

  const defaultFetchFunc = (): void => {
    if (DEV_BASE_URL) {
      axios
        // .get(`${DEV_BASE_URL}/api/hello`)
        .get('/api/hello')
        .then((response) => setHello(response.data))
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <button onClick={defaultFetchFunc}>Fetch</button>
      {hello && <div>성공! 백엔드에서 가져온 데이터입니다 : {hello}</div>}
    </>
  );
};

export default App;
