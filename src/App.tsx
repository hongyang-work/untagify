import React from 'react';
import './App.css';
import Tagify from "./tagify/Tagify";
import {transform} from "./tagify/Transform";

function App() {
    const rawText = "[[{\"value\": \"first\", \"prefix\": \"@\"}]] [[{\"value\": \"second\", \"prefix\": \"@\"}]]";
    const tagify = new Tagify(rawText);
    const transformed = transform(tagify.parsed, tagify.ranges());

    return (
        <div className="App">
            <div>{tagify.raw}</div>
            <div>{tagify.parsed}</div>
            <div>{JSON.stringify(tagify.tags)}</div>
            <div>{transformed}</div>
            <div>{tagify.raw === transformed}</div>
        </div>
    );
}

export default App;
