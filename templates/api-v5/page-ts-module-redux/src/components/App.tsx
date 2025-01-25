import React, { useState } from 'react';
import { WaitUntil } from 'chayns-api';
import { SmallWaitCursor } from '@chayns-components/core';
import { useSelector } from 'react-redux';
import { selectCounterValue } from '../redux-modules/counter/slice';
import './app.scss';

const App = () => {
    const counter = useSelector(selectCounterValue);

    const [taskList] = useState(() => [
        // first level tasks are executed one after the other
        () =>
            new Promise((resolve) => {
                setTimeout(resolve, 1000);
            }), // Add your initial Requests, textstrings here
        [
            // second level tasks are executed in parallel
        ],
    ]);

    return (
        <WaitUntil
            tasks={taskList}
            loadingComponent={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SmallWaitCursor />
                </div>
            }
        >
            <h1>Hi! Welcome to your newly created chayns application!</h1>
            <p>Count: {counter}</p>
        </WaitUntil>
    );
};

export default App;
