import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { MainRouter } from './MainRouter';
import "./styles/css/index.css"

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText:  '#fff',
    },
  }
});

const App = () => (
  <MuiThemeProvider theme={theme}>
  <BrowserRouter>
      <MainRouter/>
  </BrowserRouter>
  </MuiThemeProvider>
)

export default App;
