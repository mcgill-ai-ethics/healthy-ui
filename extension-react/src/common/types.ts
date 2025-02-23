import { DataFetchState } from "./enums"

export type VideoURL = {
  url: string
}

export type FactCheckedArticle = {
  id: string,
  title: string,
  url: string
}

export type FactCheckedArticlesQueryStatus = {
  articles: FactCheckedArticle[],
  status: DataFetchState
}

export type LocalStorageArticles = {
  timeToLive: number,
  articles: FactCheckedArticle[]
}
