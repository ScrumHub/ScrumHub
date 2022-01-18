import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
