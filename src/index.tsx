import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Nav } from './ui/navigation/Nav';
import { HashRouter, Routes, Route } from 'react-router';
import ScrollToTop from './utils/ScrollToTop';
import { ConnectionProvider } from './context/ConnectionContext';

import Timer from './pages/Timer';
import Analytics from './features/analytics/Analytics';
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="overflow-x-hidden overflow-y-auto">
          <main className="font-sans pt-4 px-2 antialiased h-[calc(100vh-5rem)] lg:h-[100vh]  mx-auto bg-slate-50 max-w-3xl lg:pl-23">
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
            <div className="h-20"></div>
          </main>
        </div>
        <Nav />
      </HashRouter>
    </ConnectionProvider>
  </React.StrictMode>,
);
