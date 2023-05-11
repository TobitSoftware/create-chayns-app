import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';

chayns.ready
    .then(() => {
        try {
            const root = createRoot(document.querySelector('#root'));
            root.render(<AppWrapper/>);
        } catch (e) {
            console.error('Encountered error at `ReactDOM.render`: ', e);
        }
    })
    .catch((error) => {
        console.warn('No chayns environment found.', error);
    });
