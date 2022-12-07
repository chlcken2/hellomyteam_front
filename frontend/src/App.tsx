import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App: React.FC = () => {
  const [hello, setHello] = useState('')
  const API_URL = process.env.REACT_APP_DEV_API_URL

  useEffect(() => {
    console.log(API_URL, '?????')
    axios.get('/api/hello')
      .then(response => setHello(response.data))
      .catch(error => console.log(error))
  }, [])

  return (
        <div>
            백엔드에서 가져온 데이터입니다 : {hello}
        </div>
  )
}

export default App
