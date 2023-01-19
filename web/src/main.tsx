import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'
import './index.css'

const dark = extendTheme({
  colors: {
    bg: '#000',
    white: '#fff',
    headingWhite: '#F6F6F6',
    lightGray: '#bbb',
    darkGray: '#656565',
    themeBlue: '#2f94ff',
  }
})

const breakpoins = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
  '3xl': '112em',
}

// const fontSizes = [
//   'xl': '',
//   '2xl': '96em',

// ]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={dark}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
