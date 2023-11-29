import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Panel from "./panel/Panel";
import { strutures } from "./structure";
import { matchStructure } from "./matchStructure";
import "./index.css";
import axios from "axios";
import Loader from "./component/utils/Loader/Loader";
import ConnectionModal from "./component/Modal/ConnectionModal";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalConnection, setModalConnection] = useState(false);

  useEffect(() => {
    console.log(process.env.REACT_APP_STARTURIBACK);
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('key');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Token ${token}`;          
        }else{
          delete axios.defaults.headers.common['Authorization'];
        }

        let res = await axios.get(process.env.REACT_APP_STARTURIBACK + '/utilisateur-connecte/')

        setIsLoading(false);
      } catch (error) {
        localStorage.clear();
        setModalConnection(true);
        setIsLoading(true);
      }
    };

    fetchData();
  }, [modalConnection]);

  if (isLoading) {
    return (
      <>
        <Loader />
        {modalConnection && <ConnectionModal exit={() => setModalConnection(false)} />}
      </>
    );
  }

  return (
    <div className="App grid grid-cols-[18rem_auto] min-h-screen w-screen">
      <Router>
        <div className="min-h-screen">
          <Panel />
        </div>
        <div className="bg-gray-100 min-h-screen overflow-scroll">
          <Switch>
            {Object.keys(strutures).map((panel, index) => (
              <Route key={index} path={`/${panel}`}>
                {matchStructure[panel]}
              </Route>
            ))}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
