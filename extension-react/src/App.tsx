import React, { useState, useEffect, useRef } from 'react'

import { VideoURL, FactCheckedArticle, FactCheckedArticlesQueryStatus } from './common/types'
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

import dummyData from './mock_data/dummy_url.json'

const App = () => {
  const [factCheckedArticles, setFactCheckedArticles] = useState<FactCheckedArticle[]>([]);
  const [dataFetchState, setDataFetchState] = useState<DataFetchState>(DataFetchState.WRONG_PAGE);
  const [isAntiSiloingQueryOption, setIsAntiSiloingQueryOption] = useState<boolean>(false);

  const hasAlreadyBeenLoaded = useRef(true);

  useEffect(() => {
    if (!hasAlreadyBeenLoaded.current) {
      return;
    }

    chrome.storage.local.get('url', (data: VideoURL) => {
      if (!data.url.includes("youtube.com/watch")) {
        setDataFetchState(DataFetchState.WRONG_PAGE);
        return;
      }

      setDataFetchState(DataFetchState.SUCCESSFUL_VIDEO_URL_LOADED);
      loadFactCheckArticles(data.url);
    })
    hasAlreadyBeenLoaded.current = false;
  }, [isAntiSiloingQueryOption])


  const loadFactCheckArticles = async (currVideoURL: string) => {
    setDataFetchState(DataFetchState.LOADING);

    const videoId = currVideoURL.split("=")[1].substring(0, 11);
    const { articles, status }: FactCheckedArticlesQueryStatus = await fetchNewsFactCheck(videoId);

    setDataFetchState(status)
    if (status == DataFetchState.SUCCESSFUL_DATA_FETCH && articles !== null) {
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
        <Grid container xs={12} style={{ minHeight: '208px' }}>
          {isAntiSiloingQueryOption &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px', textAlign: 'center' }}>
              This feature has not been implemented yet.<br /> Come back later!!
            </Grid>
          }
          {!isAntiSiloingQueryOption && dataFetchState == DataFetchState.SUCCESSFUL_DATA_FETCH &&
            <Grid xs={12} >{
              factCheckedArticles.map(article => (
                <FactCheckLink key={article.id} article={article} />
              ))}
            </Grid>
          }
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
