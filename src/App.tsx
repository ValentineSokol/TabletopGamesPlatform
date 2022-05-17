import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import AppRoutes from './components/AppRoutes';

const Background = createGlobalStyle`
 body {
   background: #292929;
 }
`;
const AppContainer = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
`;
function App() {
  return (
    <AppContainer>
      <Router>
        <Navbar />
        <AppRoutes />
        <Background />
      </Router>
    </AppContainer>
  );
}

export default App;
