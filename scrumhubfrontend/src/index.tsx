// index.tsx
/**
 * File doc comment for index.tsx
 * @packageDocumentation
 */
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import { Provider } from 'react-redux'
import { store } from './appstate/store';
import React from 'react';

export const ReactStrictMode = <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
</React.StrictMode>
  
export const rootElement = document.getElementById('root')

ReactDOM.render(
  ReactStrictMode,
  rootElement
);