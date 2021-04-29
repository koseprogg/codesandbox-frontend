/* eslint-disable prettier/prettier */
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CompetitionPage from "./components/CompetitionPage";
import Mainpage from "./components/Mainpage";
import Nutpage from "./components/Nutpage";
import CreateNut from "./components/CreateNut";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact render={() => <Mainpage />}></Route>
            <Route
              exact
              path="/:name"
              render={() => <CompetitionPage />}
            ></Route>
            <Route exact path="/:name/new" render={() => <CreateNut />}></Route>
            <Route
              exact
              path="/:name/:taskname/edit"
              render={() => <CreateNut edit />}
            ></Route>
            <Route
              exact
              path="/:name/:taskname"
              render={() => <Nutpage />}
            ></Route>
            <Route
              exact
              path="/:name/day/:day"
              render={() => <Nutpage />}
            ></Route>
          </Switch>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
