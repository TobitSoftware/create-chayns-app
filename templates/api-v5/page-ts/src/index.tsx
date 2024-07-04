import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChaynsProvider } from 'chayns-api';
import App from './components/App';

try {
    const root = createRoot(document.querySelector('#root'));
    root.render(<ChaynsProvider><App /></ChaynsProvider>);
} catch (e) {
    console.error('Encountered error at `ReactDOM.render`: ', e);
}
