import React from 'react';
import { Routes, Route } from 'react-router-dom';
// eslint-disable-next-line import/extensions,import/no-unresolved
import SvgBoard from '../Board';
import Login from '../../Login';

function AppRoutes() {
  return (
        <Routes>
            <Route path="/" element={<div>Hi!</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/play" element={<SvgBoard />} />
            <Route path="*" element={<div>404!</div>} />
        </Routes>
  );
}

export default AppRoutes;
