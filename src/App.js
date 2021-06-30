import logo from "./logo.svg";
import "./App.scss";
import { Fragment } from "react";
import Header from "./components/layouts/Header";
import Sidebar from "./components/layouts/Sidebar";
import Content from "./components/layouts/Content";
import { Route, Redirect } from "react-router-dom";
import Settings from "./components/layouts/Settings";
import Account from "./components/layouts/Account";
import Devices from "./components/layouts/Devices";
function App() {
  return (
    <Fragment>
      <div className="container">
        <Sidebar />

        <div className="content">
          <Route path="/" exact>
            <Redirect to="/dashboard" />
          </Route>
          <Route path="/dashboard" exact>
            <Header title="Device: kasubi-36" />

            <Content />
          </Route>
          <Route path="/devices" exact>
            <Header title="Devices" />

            <Devices />
          </Route>
          <Route path="/account" exact>
            <Header title="account" />

            <Account />
          </Route>
          <Route path="/settings" exact>
            <Header title="settings" />

            <Settings />
          </Route>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
