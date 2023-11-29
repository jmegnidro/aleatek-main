import React from 'react'
import { 
    BrowserRouter as Router,
    Switch, 
    Route 
} from 'react-router-dom'
import { strutures } from '../../../../structure';

import { matchCTC } from './matchCTC';
import { useRouteMatch } from 'react-router-dom';
import CTC from './CTC';

let ctc = strutures["Aleatek"]["Affaires"]["CTC"];

function CTCRouter() {
    let {path} = useRouteMatch();
    return (
        <Router>
            <Switch>
                <Route exact path={path}>
                    <CTC/>
                </Route>
                {Object.keys(ctc).map((panel, index)=>{
                    return (
                    <Route key={index} path={`${path}/${panel}`}>
                        {matchCTC[panel]}
                    </Route>
                    )
                })}
            </Switch>
        </Router>
  )
}

export default CTCRouter;