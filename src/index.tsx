import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Nav } from './components/common/Nav';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Nav />
    <App />
  </React.StrictMode>,
);
