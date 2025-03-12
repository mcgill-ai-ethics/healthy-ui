// @ts-nocheck
import axios from 'axios'

import { DataFetchState } from '../common/enums'
import { FactCheckedArticle, LocalStorageArticles } from '../common/types'

import trimFactCheckArticlesJsonData from '../utils/trimFactCheckArticlesJsonData'
import environmentConfig from '../config/environmentConfiig'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/


const backendAPI = environmentConfig();

const localStorageTimeToLive = 5 * 60 * 1000;

// use this to do a basic check if the server is up and running
// and responding to requests
export const fetchTestData = async () => {
  const { data } = await axios.get(`${backendAPI}/`)
  return data
}

// eventually if our results get cpu expensive
// we can also pass in a config object like
// enableFactcheck: true
// enableSpectrumCheck: true
export const fetchVideosById = async (videoIds: string | string[] = []) => {
  // default, no ids
  if (!videoIds.length) {
    const url = `${backendAPI}/api/video`
    const { data } = await axios.get(url)
    return data
  }

  // handle single id or array of ids
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds]
  const encodedIds = encodeURIComponent(ids.join(','))
  const url = `${backendAPI}/api/video?ids=${encodedIds}`
  const { data } = await axios.get(url)
  return data
}

export const fetchNewsFactCheck: FactCheckedArticlesQueryStatus = async (videoId: string) => {
  const url = `${backendAPI}/yt/fc?ids=${videoId}`//testing

  try {

    const localStorageArticles: LocalStorageArticles = JSON.parse(localStorage.getItem(videoId));
    const currDate = new Date()

    if (localStorageArticles !== null && localStorageArticles.timeToLive >= currDate.getTime()) {
      if (localStorageArticles.articles === null) {
        return { article: null, status: DataFetchState.NO_DATA_TO_BE_LOADED };
      }
      return { articles: localStorageArticles.articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH };
    }

    const { data } = await axios.get(url)
    const articles: FactCheckedArticle[] = trimFactCheckArticlesJsonData(data).slice(0, 6);

    localStorage.setItem(videoId, JSON.stringify({ timeToLive: currDate.getTime() + localStorageTimeToLive, articles: articles }))

    if (data.error) {
      return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
    }
    if (Object.keys(data).length === 0) {
      return { articles: null, status: DataFetchState.NO_DATA_TO_BE_LOADED }
    }


    return { articles: articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH }
  }
  catch (error) {
    console.log(error)
    return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
  }
}
