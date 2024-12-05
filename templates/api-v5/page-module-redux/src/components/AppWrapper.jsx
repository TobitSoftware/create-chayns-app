import React from 'react';
import { ChaynsProvider, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';
import store from '../redux-modules';
import { Provider } from 'react-redux';

const AppWrapper = ({ ...props }) => {
    return (
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <ChaynsProvider {...props}>
            <Provider store={store}>
                <PageProvider>
                    <App/>
                </PageProvider>
            </Provider>
        </ChaynsProvider>
    )
}

export default withCompatMode(AppWrapper);
