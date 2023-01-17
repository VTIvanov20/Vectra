import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'
import './index.css'

const dark = extendTheme({
  colors: {
    bg: '#020207',
    white: '#fff',
    lightGray: '#bbb',
    darkGray: '#656565',
    gradientRed: 'linear-gradient(90deg, #FF862F 0%, #FF2F2F 100%);',
    gradientGreen: 'linear-gradient(90deg, #2F94FF 0%, #2F37FF 100%);',
    gradientBlue: 'linear-gradient(90deg, #C9FF2F 0%, #2FFF8F 100%);',
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
