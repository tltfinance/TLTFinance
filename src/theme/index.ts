import { black, green, grey, red, white, gradient } from './colors'

const theme = {
  borderRadius: 12,
  breakpoints: {
    mobile: 500,
  },
  color: {
    black,
    grey,
    red,
    gradient,
    primary: {
      light: red[200],
      main: red[500],
    },
    secondary: {
      main: green[500],
    },
    white,
  },
  height: 80,
  width: 
   {
    1: 140,
    2: 80,


   },
  
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  topBarSize: 72
}

export default theme