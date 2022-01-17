import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import React from 'react';
import {Main} from './components/Main';

export function App() {
  return (
        <Router>
          <Main></Main>
        </Router>
  );
}