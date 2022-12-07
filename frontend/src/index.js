import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';

// ✅ correct ID passed
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
