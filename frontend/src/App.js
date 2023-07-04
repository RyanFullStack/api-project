import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotDetail from "./components/SpotDetails";
import './index.css'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="wholepage">
        <div className="header"><Navigation isLoaded={isLoaded} />
          {isLoaded && <Switch></Switch>}</div>
        <Switch>
          <Route exact path='/'>
            <div className="spots"><Spots /></div>
          </Route>

          <Route path='/spots/:spotId'>
            <div className='spot-detail'><SpotDetail /></div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
