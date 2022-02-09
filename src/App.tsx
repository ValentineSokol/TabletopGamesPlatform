import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
// eslint-disable-next-line import/extensions,import/no-unresolved
import SvgBoard from './components/Board';

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
      <Background />
      <SvgBoard />
    </AppContainer>
  );
}

export default App;
