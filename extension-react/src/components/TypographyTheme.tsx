import React, { ReactNode } from "react"

import { CssBaseline, Typography } from "@mui/material"
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

interface ChildrenProps {
  children: ReactNode;
}

const theme = createTheme({
  typography: {
    fontFamily: 'Advent Pro, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          padding: '10px'
        }
      }
    }
  }
});

const typographyTheme = ({ children }: ChildrenProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default typographyTheme 
