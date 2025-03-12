import React from 'react'
import Box from '@mui/material/Box'

const Logo = () => {
  const path = chrome.runtime.getURL("./assets/logo_v2.png")
  return (
    <Box component="img" sx={{ wdith: 135, height: 80 }} src={path} alt="Logo Image" />
  )
}

export default Logo;
