import React from 'react'
import Typography from '@mui/material/Typography'
import { Link } from '@mui/material'

import { FactCheckLinkProps } from '../common/props'

const FactCheckLink: React.FC<FactCheckLinkProps> = ({ article }) => {
  return (
    <Link href={article.url} underline="hover" target="_blank">
      <Typography sx={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {article.title}
      </Typography>
    </Link >
  )
}
export default FactCheckLink 
