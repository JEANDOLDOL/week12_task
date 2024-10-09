import "./App.css";
import { AuthProvider } from "./AuthContext";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import MainHeader from "./components/MainHeaders";
import { useState } from "react";
import Login from "./pages/login";
import Board from "./pages/board";
import Write from "./pages/write";
import Welcome from "./pages/welcome";

// bootstrap
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <MainHeader />
        <main>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/board">
            <Board />
          </Route>
          <Route path="/write">
            <Write />
          </Route>
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/" exact>
            <Redirect to="/welcome" />
          </Route>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
