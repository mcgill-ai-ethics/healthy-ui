import { FactCheckedArticle } from "../common/types";

export const trimArticles = (data: any): FactCheckedArticle[] => {
  const claims: FactCheckedArticle[] = []

  const findClaims = (data: any) => {
    if (data.hasOwnProperty("claimReview")) {
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

export const removeDuplicateArticles = (data: FactCheckedArticle[]): FactCheckedArticle[] => {
  return data.reduce((uniqueArticles: FactCheckedArticle[], article: FactCheckedArticle) => {
    if (!uniqueArticles.some(uniqueArticle => uniqueArticle.title === article.title)) {
      uniqueArticles.push(article)
    }
    return uniqueArticles;
  }, [])
}

