import React from 'react';
import { Provider } from 'react-redux';
import { ChaynsProvider } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';
import store from '../redux-modules';

const AppWrapper = () => (
    <ChaynsProvider>
        <Provider store={store}>
            <PageProvider>
                <App />
            </PageProvider>
        </Provider>
    </ChaynsProvider>
);

export default AppWrapper;
