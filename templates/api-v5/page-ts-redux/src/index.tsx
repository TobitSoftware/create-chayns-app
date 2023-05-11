import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';

// @ts-expect-error chayns-js api has no types
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
chayns.ready
    .then(() => {
        try {
            const root = createRoot(document.querySelector('#root'));
            root.render(<AppWrapper />);
        } catch (e) {
            console.error('Encountered error at `ReactDOM.render`: ', e);
        }
    })
    .catch((error: Error) => {
        console.warn('No chayns environment found.', error);
    });
