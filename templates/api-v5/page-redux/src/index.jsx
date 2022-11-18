import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './components/AppWrapper';

chayns.ready
    .then(() => {
        try {
            ReactDOM.render(<AppWrapper/>, document.querySelector('#root'));
        } catch (e) {
            console.error('Encountered error at `ReactDOM.render`: ', e);
        }
    })
    .catch((error) => {
        console.warn('No chayns environment found.', error);
    });
