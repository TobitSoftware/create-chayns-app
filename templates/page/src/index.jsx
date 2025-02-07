import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

try {
    await chayns.ready;
} catch (ex) {
    console.warn('No chayns environment found.', ex);
}

try {
    const root = createRoot(document.querySelector('#root'));
    root.render(<App />);
} catch (ex) {
    console.error('Encountered error at `ReactDOM.render`: ', ex);
}
