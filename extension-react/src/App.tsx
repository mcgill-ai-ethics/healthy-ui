import React, { useState, useEffect } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"
import { TabsActionsEnum } from './common/enums'
import { VideoURL } from './common/types'

const App = () => {
  const [currVideoURL, setCurrVideoURL] = useState("")

  useEffect(() => {
    chrome.storage.local.get('url', (data: VideoURL) => {
      setCurrVideoURL(data.url)
      console.log(data.url)
    })
  }, [])

  return (
    <>
      <div>{currVideoURL}</div>
    </>
  );
}

export default App;
