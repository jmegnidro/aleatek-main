import React from 'react';
import { strutures } from '../../structure';
import { useRouteMatch } from 'react-router-dom';
import { matchVISO } from './matchVISO';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

let visio = strutures['Aleatek'];

function VISORouter() {
  let {path} = useRouteMatch()
  return (
    <Router>
        <Switch>
          {Object.keys(visio).map( (panel, index) => {
            return (
              <Route key={index} path={`${path}/${panel}`}>
                {matchVISO[panel]}
              </Route>
            );
          })}
        </Switch>
    </Router>
  )
}

export default VISORouter