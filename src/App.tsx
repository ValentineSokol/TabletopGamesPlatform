import React from 'react';
import styled from 'styled-components';
import SvgBoard from "./components/Board";

const AppContainer = styled.div`
  text-align: center;
`;
const App = () => {
  return (
    <AppContainer>
      <SvgBoard />
    </AppContainer>
  );
}

export default App;
