import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes';
import { CookiesProvider } from 'react-cookie';
import { Provider } from './context';
import dotenv from 'dotenv';

dotenv.config();

ReactDOM.render(
  <CookiesProvider>
    <Provider>
      <Routes />
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
);
