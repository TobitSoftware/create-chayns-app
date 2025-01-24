import React from 'react';
import { ChaynsProvider, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';

const AppWrapper = (props) => (
    <div className="{{ package-name-underscore }}">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ChaynsProvider {...props}>
            <PageProvider>
                <App />
            </PageProvider>
        </ChaynsProvider>
    </div>
);

export default withCompatMode(AppWrapper);
