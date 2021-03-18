/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import Nutpage from "./components/Nutpage"
import Signup from "./components/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./components/PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import MyProfile from "./MyProfile"


const App: React.FC = () => {

  return(
    <div>
      <Router><AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Mainpage} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <PrivateRoute path="/my-profile"component={MyProfile}/>
            </Switch>
          </AuthProvider>

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
