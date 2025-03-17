import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebrtcProvider } from './context/WebrtcContext';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WebrtcProvider>
      <App />
    </WebrtcProvider>
  </React.StrictMode>
);

