import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChaynsProvider } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';

import App from './components/App';

try {
    const root = createRoot(document.querySelector('#root'));
    root.render(<ChaynsProvider><PageProvider><App /></PageProvider></ChaynsProvider>);
} catch (e) {
    console.error('Encountered error at `ReactDOM.render`: ', e);
}
