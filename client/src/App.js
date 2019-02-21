import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { MainRouter } from './MainRouter';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#282c34",
      contrastText: "#D3D6DB"
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#70213D',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#FBE9EE',
    },
    // error: will use the default color
  },
});


const App = () => (

  <BrowserRouter>
    <MuiThemeProvider theme={theme} >
      <MainRouter />
    </MuiThemeProvider>
  </BrowserRouter>

)

export default App;
