import { DataFetchState } from "./enums"

export type VideoURL = {
  url: string
}

export type Article = {
  id: string,
  title: string,
  url: string
}

export type ArticlesQueryStatus = {
  articles: Article[],
  status: DataFetchState
}


export type LocalStorageArticles = {
  timeToLive: number,
  articles: Article[]
}
