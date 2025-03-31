import { DataFetchState } from "./enums";
import { AntiSiloingArticle, FactCheckedArticle } from "./types";

export interface LinkProps {
  article: FactCheckedArticle | AntiSiloingArticle;
}
export interface DataFetchStateProps {
  fetchState: DataFetchState,
  articles: FactCheckedArticle[] | AntiSiloingArticle[]
}
