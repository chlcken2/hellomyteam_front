import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
   const [hello, setHello] = useState('')

    useEffect(() => {
        axios.get('https://hellomyteam-chlcken2.koyeb.app/api/hello')
        .then(response => setHello(response.data))
        .catch(error => console.log(error))
    }, []);

    return (
        <div>
            23년 백엔드에서 가져온 데이터입니다 : {hello}
        </div>
    );
}

export default App;