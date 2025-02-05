import React, { useState, useEffect } from 'react'

import { fetchVideosById, fetchTestData, fetchNewsFactCheck } from './api/api-calls'
import "./App.css"
import { TabsActionsEnum } from './common/enums'
import { VideoURL, FactCheckedURL } from './common/types'

import dummy_url from "./mock_data/dummy_url.json"

import Logo from './components/Logo'

import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'

const App = () => {
  const [currVideoURL, setCurrVideoURL] = useState("")
  const [factCheckedArticles, setFactCheckedArticles] = useState<FactCheckedURL[]>([])

  // to be used a bit later
  useEffect(() => {
    chrome.storage.local.get('url', (data: VideoURL) => {
      setCurrVideoURL(data.url)
      console.log(data.url)
    })
  }, [])

  useEffect(() => {
    fetch("./mock_data/dummy_url.json")
      .then(response => response.json())
      .then((data: FactCheckedURL[]) => setFactCheckedArticles(data))
      .catch(error => console.error("Error while fetching fact checked articles", error))
  })

  return (
    <Grid container spacing={2}>
      <Grid xs={8}>
        <Logo />
      </Grid>
      <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center">Login/Register</Box>
      </Grid>
      <Grid xs={12}>
        <Divider sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
      </Grid>
      <Grid container rowSpacing={1} xs={12}>
        {factCheckedArticles.map(article => (
          <Grid key={article.id} xs={12}>
            <Link href={article.url} underline="hover">{article.title}</Link>
          </Grid>
        ))}
      </Grid>
      <Grid xs={12}>
        <Divider sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
      </Grid>
      <Grid xs={7}>
        <Link href="https://github.com/stanley-utf8/healthy-ui">Learn more about this project</Link>
      </Grid>
      <Grid xs={5}>
        <FormGroup>
          <FormControlLabel labelPlacement="top" control={<Switch />} label='Fact-Check' />
        </FormGroup>
      </Grid>
    </Grid>
  )
}

export default App;
