import React, { useState, useEffect } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"
import { TabsActionsEnum } from './common/enums'
import { VideoURL } from './common/types'

import Logo from './components/Logo'

import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

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
      <Grid xs={8}>
        <Logo />
      </Grid>
      <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center">Login/Register</Box>
      </Grid>
      <Grid xs={12}>
        <Divider variant='middle' sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
      </Grid>
      <Grid xs={12}>
        <div>{currVideoURL}</div>
        <div>{currVideoURL}</div>
        <div>{currVideoURL}</div>
        <div>{currVideoURL}</div>
        <div>{currVideoURL}</div>
        <div>{currVideoURL}</div>
      </Grid>
      <Grid xs={12}>
        <Divider variant='middle' sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
      </Grid>
    </Grid>
  );
}

export default App;
