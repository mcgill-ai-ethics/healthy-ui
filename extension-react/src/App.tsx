import React, { useState, useEffect, useRef } from 'react'

import { VideoURL, Article, ArticlesQueryStatus } from './common/types'
import { DataFetchState, QueryOption } from './common/enums'
import { fetchAntiSiloing, fetchNewsFactCheck } from './api/api-calls'

import Logo from './components/Logo'
import TypographyTheme from './components/TypographyTheme'

import Grid from '@mui/material/Unstable_Grid2'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Articles from './components/Articles'

const App = () => {
  const [factCheckedArticles, setFactCheckedArticles] = useState<Article[]>([]);
  const [antiSiloingArticles, setAntiSiloingArticles] = useState<Article[]>([]);
  const [dataFetchState, setDataFetchState] = useState<DataFetchState>(DataFetchState.WRONG_PAGE);
  const [isAntiSiloingQueryOption, setIsAntiSiloingQueryOption] = useState<boolean>(false);

  const hasNotBeenLoaded = useRef(true);

  useEffect(() => {
    if (!hasNotBeenLoaded.current) {
      return;
    }

    chrome.storage.local.get('url', (data: VideoURL) => {
      if (!data.url.includes("youtube.com/watch")) {
        setDataFetchState(DataFetchState.WRONG_PAGE);
        return;
      }

      setDataFetchState(DataFetchState.SUCCESSFUL_VIDEO_URL_LOADED);
      if (isAntiSiloingQueryOption) {
        loadArticles(data.url, QueryOption.ANTI_SILOING);
      }
      else {
        loadArticles(data.url, QueryOption.FACT_CHECK);
      }
    })
    hasNotBeenLoaded.current = false;
  }, [isAntiSiloingQueryOption])


  const loadArticles = async (currVideoURL: string, option: QueryOption) => {
    setDataFetchState(DataFetchState.LOADING);

    const videoId = currVideoURL.split("=")[1].substring(0, 11);
    let fetchResult: ArticlesQueryStatus;

    if (option === QueryOption.ANTI_SILOING) {
      fetchResult = await fetchAntiSiloing(videoId);
    }
    else {
      fetchResult = await fetchNewsFactCheck(videoId);
    }
    console.log(fetchResult);//test

    setDataFetchState(fetchResult.status)
    if (fetchResult.status == DataFetchState.SUCCESSFUL_DATA_FETCH && fetchResult.articles !== null) {
      if (option === QueryOption.ANTI_SILOING) {
        setAntiSiloingArticles(fetchResult.articles);
      }
      else {
        setFactCheckedArticles(fetchResult.articles);
      }
    }
  }

  const changeQueryOption = () => {
    if (isAntiSiloingQueryOption) {
      setIsAntiSiloingQueryOption(false);
    }
    else {
      setIsAntiSiloingQueryOption(true);
    }
    hasNotBeenLoaded.current = true;
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
        <Grid container xs={12} justifyContent="center" style={{ minHeight: '208px' }}>
          {isAntiSiloingQueryOption && <Articles fetchState={dataFetchState} articles={antiSiloingArticles} />}
          {!isAntiSiloingQueryOption && <Articles fetchState={dataFetchState} articles={factCheckedArticles} />};
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
