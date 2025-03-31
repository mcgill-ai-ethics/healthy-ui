import React, { useState, useEffect, useRef } from 'react'

import { VideoURL, FactCheckedArticle, FactCheckedArticlesQueryStatus, AntiSiloingArticlesQueryStatus } from './common/types'
import { DataFetchState, QueryOption } from './common/enums'
import { fetchNewsFactCheck, fetchAntiSiloing } from './api/api-calls'

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
      if (isAntiSiloingQueryOption) {
        loadArticles(data.url, QueryOption.ANTI_SILOING);
      }
      else {
        loadArticles(data.url, QueryOption.FACT_CHECK);
      }
    })
    hasAlreadyBeenLoaded.current = false;
  }, [isAntiSiloingQueryOption])


  const loadArticles = async (currVideoURL: string, option: QueryOption) => {
    setDataFetchState(DataFetchState.LOADING);

    const videoId = currVideoURL.split("=")[1].substring(0, 11);
    let fetchResult: FactCheckedArticlesQueryStatus | AntiSiloingArticlesQueryStatus;

    if (option === QueryOption.ANTI_SILOING) {
      fetchResult = await fetchAntiSiloing(videoId);
    }
    else {
      fetchResult = await fetchNewsFactCheck(videoId);
    }

    setDataFetchState(fetchResult.status)
    if (fetchResult.status == DataFetchState.SUCCESSFUL_DATA_FETCH && fetchResult.articles !== null) {
      setFactCheckedArticles(fetchResult.articles)
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
        <Grid container xs={12} justifyContent="center" style={{ minHeight: '208px' }}>
          {isAntiSiloingQueryOption &&
            <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px', textAlign: 'center' }}>
              This feature has not been implemented yet.<br /> Come back later!!
            </Grid>
          }

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
