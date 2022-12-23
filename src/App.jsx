import React, {useContext} from 'react';
import "./components/App.less";
import {Provider, useDispatch, useSelector} from "react-redux";
import {store} from "./reducers/reducers";
import {setCountAC} from "./reducers/reposReducers";

const App = () => {
    const dispatch = useDispatch();
    const count = useSelector(state => state.repos.count)

    function onCountClick() {
        dispatch(setCountAC(5));
    }

    return (
        <div>
            <div className={"app"}>
                <button onClick={() => onCountClick()}>COUNT</button>
            </div>
            <div>
                {count}
            </div>
        </div>
    );
};

export default App;