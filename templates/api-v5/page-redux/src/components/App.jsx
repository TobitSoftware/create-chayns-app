import React from 'react';
import { useSelector } from "react-redux";
import { selectCount } from "../../../page-module-redux/src/redux-modules/counter/counterSelectors";

const App = () => {
    const counter = useSelector(selectCount);
    return <h1>Hi! Welcome to your newly created chayns application!${counter}</h1>;
};

export default App;
