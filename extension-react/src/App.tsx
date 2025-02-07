import React, { useState, useEffect } from 'react'

import "./App.css"
import { VideoURL, FactCheckedURL } from './common/types'


import Logo from './components/Logo'

import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import FactCheckLink from './components/FactCheckLink'

//test data -> to be replaced by fetch afterward
const dummyData =
  [
    {
      "id": "1",
      "title": "What's with Trump's obsession with Greenland? | About That",
      "url": "https://www.youtube.com/watch?v=uYPxb0veHUE"
    },
    {
      "id": "2",
      "title": "What would a Canada-U.S. tariff war actually look like? | About That",
      "url": "https://www.youtube.com/watch?v=wkwb0YaHJEk"
    },
    {
      "id": "3",
      "title": "Why Economists Hate Trump's Tariff Plan | WSJ",
      "url": "https://www.youtube.com/watch?v=_-eHOSq3oqI"
    },
    {
      "id": "4",
      "title": "Trump claims he had 'very good call' with Trudeau about tariffs",
      "url": "https://www.youtube.com/watch?v=GHShm26y-AA"
    },
    {
      "id": "5",
      "title": "Mark Carney - Canada Not Interested in Trump's Offer & Liberal Leadership Prospects | The Daily Show",
      "url": "https://www.youtube.com/watch?v=zs8St-fF0kE"
    },
    {
      "id": "6",
      "title": "Jon on Trump's Trade War, The War on DEI & Myth of 'Meritocracy' | The Daily Show",
      "url": "https://www.youtube.com/watch?v=TLOuiApOnbw"
    }
  ]


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
    setFactCheckedArticles(dummyData)
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
        <Divider sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
      </Grid>
      <Grid container rowSpacing={1} xs={12}>
        {factCheckedArticles.map(article => (
          <Grid key={article.id} xs={12}>
            <FactCheckLink article={article} />
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
