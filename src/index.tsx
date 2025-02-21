import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Nav } from './components/common/Nav';
import { HashRouter, Routes, Route } from 'react-router';
import ScrollToTop from './utils/ScrollToTop';

import Timer from './pages/Timer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ScrollToTop />
      <main className="font-sans pb-20 pt-16 px-2 antialiased h-[calc(100vh-5rem)] overflow-x-hidden overflow-y-auto bg-slate-50">
        <Routes>
          <Route
            path="/"
            element={<Timer />}
          />
          <Route
            path="/analytics"
            element={<Analytics />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </main>
      <Nav />
    </HashRouter>
  </React.StrictMode>,
);
