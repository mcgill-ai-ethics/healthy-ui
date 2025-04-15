import { Article } from "../common/types";

export const trimFactCheckArticles = (data: any): Article[] => {
  const claims: Article[] = []

  const findClaims = (data: any) => {
    if (data.hasOwnProperty("claimReview")) {
      console.log("Trimming articles: ", data['claimReview']);//test
      claims.push({ id: data['claimReview'][0]['url'] + data['claimReview'][0]['title'], title: data['claimReview'][0]['title'], url: data['claimReview'][0]['url'] });
    }

    for (const key in data) {
      if (typeof data[key] === "object" && data[key] !== null) {
        findClaims(data[key]);
      }
    }
  };

  findClaims(data);
  return claims;
}

export const trimAntiSiloingArticles = (data: any): Article[] => {
  const articles: Article[] = [];

  const findHeadlines = (data: any) => {
    if (data.hasOwnProperty("articles") && data['articles'] !== null) {
      console.log("Trimming articles: ", data['articles'])//test
      data['articles'].forEach((currArticle: any) => {
        articles.push({ id: currArticle['url'] + currArticle['title'], title: currArticle['title'], url: currArticle['url'] })
      });
    }

    for (const key in data) {
      if (typeof data[key] === "object" && data[key] !== null) {
        findHeadlines(data[key]);
      }
    }
  };

  findHeadlines(data);
  return articles;
}

export const removeDuplicateArticles = (data: Article[]): Article[] => {
  return data.reduce((uniqueArticles: Article[], article: Article) => {
    if (!uniqueArticles.some(uniqueArticle => uniqueArticle.title === article.title)) {
      uniqueArticles.push(article)
    }
    return uniqueArticles;
  }, [])
}

