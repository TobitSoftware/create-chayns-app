import React from 'react';
import { useSite } from 'chayns-api';

const App = () => {
    const { title } = useSite();
    return <h1>Hi! Welcome to your newly created chayns application! {title}</h1>;
};

export default App;
