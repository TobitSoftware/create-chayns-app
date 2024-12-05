import React from 'react';
import { ChaynsProvider, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';

const AppWrapper = ({ ...props }) => {
    return (
        <div className="tapp">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ChaynsProvider {...props}>
                <PageProvider>
                    <App/>
                </PageProvider>
            </ChaynsProvider>
        </div>
    )
}

export default withCompatMode(AppWrapper);
