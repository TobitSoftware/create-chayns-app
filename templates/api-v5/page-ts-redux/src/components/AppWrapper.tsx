import React from "react";
import { Provider } from "react-redux";
import { ChaynsProvider } from "chayns-api";
import App from "./App";
import store from '../redux-modules';

const AppWrapper = ({ ...props }) => {
    return (
        <ChaynsProvider {...props}>
            <Provider store={store}>
                <App/>
            </Provider>
        </ChaynsProvider>
    )
}

export default AppWrapper;
