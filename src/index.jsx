import Post from '@models/Post';
import * as $ from 'jquery';
import "./index.scss";
import './babel';
import {render} from "react-dom";
import React from "react";
import ReactDOM from "react-dom/client";

const post = new Post('Webpack post title');
$('pre').html(post.toString());
console.log('Post to string', post.toString());

const App = () => {
    return (
        <div className={'App'}>
            <h1>Hello there</h1>
            <div className="logo"></div>
            <pre></pre>
        </div>
    )
};

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(<App/>);