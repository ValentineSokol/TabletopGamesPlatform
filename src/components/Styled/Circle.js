import React from 'react';
import styled from 'styled-components';

const Circle = styled.div`
  height: ${props => props.radius};
  width: ${props => props.radius};
  background: ${props => props.color};
  border-radius: 50%;
  padding: 5px;
`;

export default Circle;