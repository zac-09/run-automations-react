import logo from "./logo.svg";
import "./App.scss";
import { Fragment, useEffect } from "react";
import Header from "./components/layouts/Header";
import Sidebar from "./components/layouts/Sidebar";
import Content from "./components/layouts/Content";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import Settings from "./components/layouts/Settings";
import Account from "./components/layouts/Account";
import Devices from "./components/layouts/Devices";
import SignIn from "./pages/auth/SignIn";
import { authenticate } from "./store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import { notificationActions } from "./store";
function App() {
  const auth = useSelector((state) => state.auth);
  console.log("from app", auth);
  const notification = useSelector((state) => state.notification);
  const deviceData = useSelector((state) => state.devices);
  const selectedDevice = deviceData.devices.find(
    (device) => device.device_imei === deviceData.selectedDevice_id
  );
  console.log("the selected device is",selectedDevice)
  const isLoggedIn = auth.isLoggedIn;
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.hideAlert());
  };
  useEffect(() => {
    const tryLogin = () => {
      const userData = localStorage.getItem("userData");
      const parsedData = JSON.parse(userData);
      if (!userData) {
        console.log("no data found");

        return (
          <Route path="/">
            <Redirect to="/signin" />
          </Route>
        );
      }
      const { user, token, expiryDate, devices } = parsedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !user) {
        console.log("token expired already");

        return (
          <Route path="/">
            <Redirect to="/signin" />
          </Route>
        );
      }
      const expiryTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authenticate(user, token, devices, expiryTime));
    };
    tryLogin();
  }, [dispatch]);

  return (
    <Switch>
      {!isLoggedIn && (
        <Fragment>
          <Route path="/signin" exact>
            {notification.showAlert && (
              <Alert
                severity={notification.alertType}
                onClose={closeNotificationHandler}
              >
                <span className="notification__text">
                  {notification.alertMessage}
                </span>
              </Alert>
            )}
            <SignIn />
          </Route>
          <Route path="*">
            <Redirect to="/signin" />
          </Route>
        </Fragment>
      )}

      {isLoggedIn && (
        <Fragment>
          {notification.showAlert && (
            <Alert
              severity={notification.alertType}
              onClose={closeNotificationHandler}
            >
              <span className="notification__text">
                {notification.alertMessage}
              </span>
            </Alert>
          )}
          <div className="container">
            <Sidebar />

            <div className="content">
              <Route path="/dashboard" exact>
                <Header
                  title={`Device: ${
                    selectedDevice ? selectedDevice.device_name : ""
                  }`}
                />

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
              <Route path="*">
                <Redirect to="/dashboard" />
              </Route>
            </div>
          </div>
        </Fragment>
      )}
    </Switch>
  );
}

export default App;
