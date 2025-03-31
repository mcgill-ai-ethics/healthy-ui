import React from 'react';

import Grid from '@mui/material/Unstable_Grid2'
import { CircularProgress } from '@mui/material';

import { DataFetchStateProps } from '../common/props';
import { DataFetchState } from '../common/enums';
import ArticleLink from './ArticleLink';

const Articles: React.FC<DataFetchStateProps> = ({ fetchState, articles }) => {
  return (
    <>
      {fetchState == DataFetchState.SUCCESSFUL_DATA_FETCH &&
        <Grid xs={12} >{
          articles.map(article => (
            <ArticleLink key={article.id} article={article} />
          ))}
        </Grid>
      }
      {fetchState == DataFetchState.UNSUCCESSFUL_DATA_FETCH &&
        <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px' }}>
          Unable to fetch data for this video
        </Grid>
      }
      {fetchState == DataFetchState.NO_DATA_TO_BE_LOADED &&
        <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px' }}>
          No fact-checked articles for this video
        </Grid>
      }
      {fetchState == DataFetchState.LOADING &&
        <Grid container xs={12} justifyContent="center" alignItems="center" style={{ minHeight: '208px' }}>
          <CircularProgress />
        </Grid>
      }
      {fetchState == DataFetchState.WRONG_PAGE &&
        <Grid container xs={12} justifyContent="center" alignItems='center' style={{ minHeight: '208px', textAlign: 'center' }}>
          Not a YouTube video page.<br /> Navigate to a YouTube pages for articles.
        </Grid>
      }
    </>
  )

}
export default Articles;
