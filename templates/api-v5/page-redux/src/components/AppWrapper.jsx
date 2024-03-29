import React from 'react';
import { Provider } from 'react-redux';
import { ChaynsProvider } from 'chayns-api';
import store from '../redux-modules';
import App from './App';

const AppWrapper = () => {
    return (
        <ChaynsProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ChaynsProvider>
    )
}

export default AppWrapper;
