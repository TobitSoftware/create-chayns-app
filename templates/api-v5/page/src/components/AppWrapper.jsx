import React from 'react';
import { ChaynsProvider } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';

const AppWrapper = () => {
    return (
        <ChaynsProvider>
            <PageProvider>
                <App/>
            </PageProvider>
        </ChaynsProvider>
    )
}

export default AppWrapper;
