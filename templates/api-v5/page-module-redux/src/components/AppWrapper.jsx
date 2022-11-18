import React from 'react';
import { ChaynsProvider, withCompatMode } from "chayns-api";
import App from "./App";
import store from '../redux-modules';
import { Provider } from "react-redux";

const AppWrapper = ({ ...props }) => {
    return (
        <div className="tapp">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ChaynsProvider {...props}>
                <Provider store={store}>
                    <App/>
                </Provider>
            </ChaynsProvider>
        </div>
    )
}

export default withCompatMode(AppWrapper);
