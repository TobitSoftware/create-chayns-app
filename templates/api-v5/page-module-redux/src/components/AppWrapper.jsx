import React from 'react';
import { Provider } from 'react-redux';
import { ChaynsProvider, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';
import store from '../redux-modules';

const AppWrapper = (props) => (
    <div className="{{ package-name-underscore }}">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ChaynsProvider {...props}>
            <Provider store={store}>
                <PageProvider>
                    <App />
                </PageProvider>
            </Provider>
        </ChaynsProvider>
    </div>
);

export default withCompatMode(AppWrapper);
