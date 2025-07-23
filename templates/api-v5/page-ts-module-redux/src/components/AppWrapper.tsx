import React, { ComponentPropsWithoutRef } from 'react';
import { Provider } from 'react-redux';
import { ChaynsProvider, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';
import store from '../redux-modules';

const AppWrapper = (props: ComponentPropsWithoutRef<typeof ChaynsProvider>) => (
    <div className="{{ package-name-underscore }}">
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
