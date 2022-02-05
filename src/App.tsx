import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions,import/no-unresolved
import SvgBoard from './components/Board';

const AppContainer = styled.div`
  text-align: center;
`;
function App() {
  return (
    <AppContainer>
      <SvgBoard />
    </AppContainer>
  );
}

export default App;
