/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import Nutpage from "./components/Nutpage"

const App: React.FC = () => {

  return(
    <div style={{ width: '100%', height: '100%' }}>
      <Router>
          <Route path='/' exact render={(props) => (
            <Mainpage/>)}>
          </Route>
          <Route exact path='/:name' render={(props) => (
            <Nutpage />
          )}>
          </Route>
      </Router>      

    </div>
  )
  
};

export default App;
