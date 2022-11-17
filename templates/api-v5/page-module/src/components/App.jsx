import React from 'react';
import { WaitUntil } from "chayns-api";
import { SmallWaitCursor } from "chayns-components";

const App = () => {

    const taskList = [
        // tasks in first level are executed one after another
        () => chayns.ready,
        () => new Promise((resolve) => setTimeout(resolve, 1000)), // Add your initial Requests, textstrings here

        [
            // tasks on second level are executed parallel
        ]
    ]

    return (<WaitUntil
        tasks={taskList}
        loadingComponent={(
            <div style={{ textAlign: 'center' }}>
                <SmallWaitCursor show/>
            </div>
        )}
    >
        <h1>Hi! Welcome to your newly created chayns application!
        </h1>
    </WaitUntil>);
};

export default App;
