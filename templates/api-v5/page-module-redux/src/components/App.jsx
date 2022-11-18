import React from 'react';
import { WaitUntil } from "chayns-api";
import { SmallWaitCursor } from "chayns-components";
import { useSelector } from "react-redux";
import { selectCount } from "../redux-modules/counter/counterSelectors";

const App = () => {
    const counter = useSelector(selectCount);

    const taskList = [
        // tasks on first level are executed parallel
        () => chayns.ready,
        () => new Promise((resolve) => {setTimeout(resolve, 1000)}), // Add your initial Requests, textstrings here
        [
            // tasks in second level are executed one after another
        ]
    ]

    return (<div className="{{ package-name-underscore }}">
        <WaitUntil
            tasks={taskList}
            loadingComponent={(
                <div style={{ textAlign: 'center' }}>
                    <SmallWaitCursor show/>
                </div>
            )}
        >
            <h1>Hi! Welcome to your newly created chayns application! {counter}</h1>
        </WaitUntil></div>);
};

export default App;
