import React from 'react';

import "./styles/index.scss"

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import NewMidi from './views/NewMidi';

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
    <NewMidi></NewMidi>
  </MuiThemeProvider>
)

export default App;
