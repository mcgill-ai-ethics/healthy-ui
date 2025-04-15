// @ts-nocheck
import axios from 'axios'

import { DataFetchState } from '../common/enums'
import { ArticlesQueryStatus, LocalStorageArticles } from '../common/types'

import { removeDuplicateArticles, trimFactCheckArticles, trimAntiSiloingArticles } from '../utils/trimArticlesJsonData'
import environmentConfig from '../config/environmentConfiig'
import { QueryOption } from '../common/enums'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/


const backendAPI = environmentConfig();
const localStorageTimeToLive = 5 * 60 * 1000;

export const fetchArticles = async (videoId: string, queryOption: QueryOptions): Promise<ArticlesQueryStatus> => {
  let url: string = "";
  let localStorageKey: string = "";

  if (queryOption === QueryOption.FACT_CHECK) {
    url = `${backendAPI}/yt/fc?ids=${videoId}`;
    localStorageKey = videoId + "fc";
  }
  else {
    url = `${backendAPI}/yt/a-s?ids=${videoId}`;
    localStorageKey = videoId + "a-s";
  }

  try {
    const localStorageArticles: LocalStorageArticles = JSON.parse(localStorage.getItem(localStorageKey));
    const currDate = new Date();

    if (localStorageArticles !== null && localStorageArticles.timeToLive >= currDate.getTime()) {
      console.log("fetching from local storage for articles")

      if (localStorageArticles.articles.length === 0) {
        return { articles: null, status: DataFetchState.NO_DATA_TO_BE_LOADED };
      }
      return { articles: localStorageArticles.articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH };
    }

    const { data } = await axios.get(url);

    let articles: Article[] = [];
    if (queryOption === QueryOption.FACT_CHECK) {
      articles = removeDuplicateArticles(trimFactCheckArticles(data)).slice(0, 6);
    }
    else {
      articles = removeDuplicateArticles(trimAntiSiloingArticles(data)).slice(0, 6);
    }

    //avoid double fetching
    const localStorageArticlesAfterFetch: LocalStorageArticles = JSON.parse(localStorage.getItem(localStorageKey));
    if (localStorageArticlesAfterFetch !== null
      && localStorageArticlesAfterFetch.timeToLive >= currDate.getTime()
      && localStorageArticlesAfterFetch.articles.length !== 0) {
      console.log("fetching from local storage for articles after backend fetch")
      return { articles: localStorageArticlesAfterFetch.articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH };
    }

    localStorage.setItem(localStorageKey, JSON.stringify({ timeToLive: currDate.getTime() + localStorageTimeToLive, articles: articles }));

    if (data.error) {
      return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
    }
    if (articles.length === 0) {
      return { articles: null, status: DataFetchState.NO_DATA_TO_BE_LOADED };
    }
    return { articles: articles, status: DataFetchState.SUCCESSFUL_DATA_FETCH };
  }
  catch (error) {
    console.log(error)
    return { articles: null, status: DataFetchState.UNSUCCESSFUL_DATA_FETCH };
  }
}
