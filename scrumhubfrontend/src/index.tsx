// index.tsx
/**
 * Entry point for the application
 * @packageDocumentation
 */
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import { Provider } from 'react-redux'
import { store } from './appstate/store';
import React from 'react';
require('dotenv').config();

export const ReactStrictMode = 
<React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
</React.StrictMode>
  
export const rootElement = document.getElementById('root')

ReactDOM.render(
  ReactStrictMode,
  rootElement
);