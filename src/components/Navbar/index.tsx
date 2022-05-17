import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.div`
    background: black;
    padding: 1%;
  ul {
    text-align: left;
  }
    a {
      font-size: 1.3em;
      text-decoration: none;
      color: white;
      margin: 1%;
    }
`;

function Navbar({ isAuthorized = false }) {
  return (
    <NavbarContainer>
    <nav>
      <ul>
        {
                 isAuthorized
                   ? (
                     <>
                       <Link to="/home">Домашня</Link>
                       <Link to="/play">Грати</Link>
                       <button type="button">Вихід</button>
                     </>
                   )
                   : (
                     <>
                       <Link to="/login">Вхід</Link>
                       <Link to="/play">Грати</Link>
                     </>
                   )
             }
      </ul>
    </nav>
    </NavbarContainer>
  );
}

export default Navbar;
