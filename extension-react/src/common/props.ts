import { DataFetchState } from "./enums";
import { Article } from "./types";

export interface LinkProps {
  article: Article
}
export interface DataFetchStateProps {
  fetchState: DataFetchState,
  articles: Article[]
}
