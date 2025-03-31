import React from 'react'
import Typography from '@mui/material/Typography'
import { Link } from '@mui/material'

import { LinkProps } from '../common/props'

const ArticleLink: React.FC<LinkProps> = ({ article }) => {
  return (
    <Link href={article.url} underline="hover" target="_blank">
      <Typography sx={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        my: 0.5
      }}>
        {article.title}
      </Typography>
    </Link >
  )
}
export default ArticleLink 
