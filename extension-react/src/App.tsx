import React, { useState, useEffect } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"
import { TabsActionsEnum } from './common/enums'

const App = () => {
  const [currVideoURL, setCurrVideoURL] = useState("")

  useEffect(() => {
    const handleNewURL = (event: MessageEvent) => {
      if (event.data.action === TabsActionsEnum.URL_CHANGED) {
        setCurrVideoURL(event.data.url)
      }
    }

    window.addEventListener('message', handleNewURL)

    return () => {
      window.removeEventListener('message', handleNewURL)
    }
  }, [])

  return (
    <>
      <div>{currVideoURL}</div>
    </>
  );
}

export default App;
