import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { MainRouter } from './MainRouter';
import "./styles/css/index.css"

const App = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
)

export default App;
