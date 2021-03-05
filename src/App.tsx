/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import "sanitize.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import Nutpage from "./components/Nutpage"

const App: React.FC = () => {

  return(
    <div>
      <Router>
          <Route path='/' exact render={(props) => (
          <Mainpage/>)}>
          </Route>
          
          <Route path='/nutpage' exact render={(props) => (
          <Nutpage/>)}>
          </Route>
      </Router>      

    </div>
  )
  
};

export default App;
