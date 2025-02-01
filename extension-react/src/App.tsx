import React, { useState, useEffect } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"
import { TabsActionsEnum } from './common/enums'
import { VideoURL } from './common/types'

import Logo from './components/Logo'

import Grid from '@mui/material/Unstable_Grid2'

const App = () => {
  const [currVideoURL, setCurrVideoURL] = useState("")

  useEffect(() => {
    chrome.storage.local.get('url', (data: VideoURL) => {
      setCurrVideoURL(data.url)
      console.log(data.url)
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Logo />
        <div>{currVideoURL}</div>
      </Grid>
    </Grid>
  );
}

export default App;
