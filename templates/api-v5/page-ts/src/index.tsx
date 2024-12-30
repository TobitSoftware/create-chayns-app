import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';

try {
    const root = createRoot(document.querySelector('#root') as Element);
    root.render(<AppWrapper/>);
} catch (e) {
    console.error('Encountered error at `ReactDOM.render`: ', e);
}
