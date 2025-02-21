import React, { useState, useEffect } from 'react'

import { VideoURL, FactCheckedArticle } from './common/types'
import { DataFetchState } from './common/enums'
import { fetchNewsFactCheck } from './api/api-calls'

import Logo from './components/Logo'
import TypographyTheme from './components/TypographyTheme'

import Grid from '@mui/material/Unstable_Grid2'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import FactCheckLink from './components/FactCheckLink'
import CircularProgress from '@mui/material/CircularProgress';

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
  const [factCheckedArticles, setFactCheckedArticles] = useState<FactCheckedArticle[]>([]);
  const [dataFetchState, setDataFetchState] = useState<DataFetchState>(DataFetchState.WRONG_PAGE);
  const [isAntiSiloingQueryOption, setIsAntiSiloingQueryOption] = useState<boolean>(false);


  // to be used a bit later
  useEffect(() => {
    chrome.storage.local.get('url', (data: VideoURL) => {
      if (!data.url.includes("youtube.com/watch")) {
        setDataFetchState(DataFetchState.WRONG_PAGE);
        return;
      }

      setDataFetchState(DataFetchState.SUCCESSFUL_VIDEO_URL_LOADED);
      loadFactCheckArticles(data.url);
      console.log(data.url)//test
    })
  }, [isAntiSiloingQueryOption])


  const loadFactCheckArticles = async (currVideoURL: string) => {
    setDataFetchState(DataFetchState.LOADING);

    const videoId = currVideoURL.split("=")[1];
    const { articles, status } = await fetchNewsFactCheck(videoId);

    console.log(articles)//test

    setDataFetchState(status)
    if (status == DataFetchState.SUCCESSFUL_DATA_FETCH) {
      setFactCheckedArticles(articles)
    }
  }

  const changeQueryOption = () => {
    if (isAntiSiloingQueryOption) {
      setIsAntiSiloingQueryOption(false);
    }
    else {
      setIsAntiSiloingQueryOption(true);
    }
  }

  return (
    <TypographyTheme>
      <Grid container spacing={2}>
        <Grid container xs={12} justifyContent="center">
          <Logo />
        </Grid>
        <Grid xs={12}>
          <Divider sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
        </Grid>
        <Grid container rowSpacing={1} xs={12} style={{ minHeight: '208px' }}>
          {isAntiSiloingQueryOption &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px', textAlign: 'center' }}>
              This feature has not been implemented yet.<br /> Come back later!!
            </Grid>
          }
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.SUCCESSFUL_DATA_FETCH &&
            factCheckedArticles.map(article => (
              <Grid key={article.id} xs={12}>
                <FactCheckLink article={article} />
              </Grid>
            ))}
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.UNSUCCESSFUL_DATA_FETCH &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px' }}>
              Unable to fetch data for this video
            </Grid>
          }
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.NO_DATA_TO_BE_LOADED &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px' }}>
              No fact-checked articles for this video
            </Grid>
          }
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.LOADING &&
            <Grid container xs={12} justifyContent="center" alignItems="center" style={{ minHeight: '208px' }}>
              <CircularProgress />
            </Grid>
          }
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.WRONG_PAGE &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px', textAlign: 'center' }}>
              Not a YouTube video page.<br /> Navigate to a YouTube pages for articles.
            </Grid>
          }
        </Grid>
        <Grid xs={12}>
          <Divider sx={{ backgroundColor: 'black', boxShadow: "0px 0px 10px gray" }} aria-hidden='true' />
        </Grid>
        <Grid container justifyContent='center' alignItems='center' xs={7}>
          <Link href="https://github.com/stanley-utf8/healthy-ui" target="_blank">Learn more about this project</Link>
        </Grid>
        <Grid xs={5}>
          <FormGroup>
            <FormControlLabel
              labelPlacement="top"
              control={
                <Switch
                  checked={isAntiSiloingQueryOption}
                  onChange={changeQueryOption} />}
              label={isAntiSiloingQueryOption ? 'Anti-Siloing' : 'Fact-Check'} />
          </FormGroup>
        </Grid>
      </Grid>
    </TypographyTheme >
  )
}

export default App;
