import React from 'react'
import Box from '@mui/material/Box'

const Logo = () => {
  return (
    <Box component="img" sx={{ wdith: 135, height: 80 }} src={chrome.runtime.getURL("../assets/bursting-the-bubble-high-resolution-logo.png")} alt="Logo Image" />
  )
}

export default Logo;
