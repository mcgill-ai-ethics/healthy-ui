// @ts-nocheck
import axios from 'axios'
import { DataFetchState } from '../common/enums'
import { FactCheckedArticle, FactCheckedURL } from '../common/types'
import trimFactCheckArticlesJsonData from '../utils/trimFactCheckArticlesJsonData'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/
// @todo move this to env file
// const apiHost = process.env.REACT_APP_BACKEND_HOST ?? 'http://127.0.0.1:5000'
const apiHost = 'http://127.0.0.1:5000'

// use this to do a basic check if the server is up and running
// and responding to requests
export const fetchTestData = async () => {
  const { data } = await axios.get(`${apiHost}/`)
  return data
}

// eventually if our results get cpu expensive
// we can also pass in a config object like
// enableFactcheck: true
// enableSpectrumCheck: true
export const fetchVideosById = async (videoIds: string | string[] = []) => {
  // default, no ids
  if (!videoIds.length) {
    const url = `${apiHost}/api/video`
    const { data } = await axios.get(url)
    return data
  }

  // handle single id or array of ids
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds]
  const encodedIds = encodeURIComponent(ids.join(','))
  const url = `${apiHost}/api/video?ids=${encodedIds}`
  const { data } = await axios.get(url)
  return data
}

export const fetchNewsFactCheck: FactCheckedArticlesQueryStatus = async (videoId: string) => {
  const url = `${apiHost}/yt/fc?ids=${videoId}`//testing

  try {
    const { data } = await axios.get(url)
    console.log(data);//test
    if (data.error) {
      return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
    }
    if (Object.keys(data).length === 0) {
      return { articles: null, status: DataFetchState.NO_DATA_TO_BE_LOADED }
    }

    const articles: FactCheckedArticle[] = trimFactCheckArticlesJsonData(data).slice(0, 6);

    return { articles: articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH }
  }
  catch (error) {
    console.log(error)
    return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
  }
}
