import "./App.scss";
import { Fragment, useEffect } from "react";
import Header from "./components/layouts/Header/Header";
import Sidebar from "./components/layouts/Sidebar/Sidebar";
import Dashboard from "./components/layouts/Dashboard/Dashboard";
import { Route, Redirect, Switch } from "react-router-dom";
import Settings from "./components/layouts/Settings/Settings";
import Account from "./components/layouts/Account/Account";
import Devices from "./components/layouts/Device/Devices";
import SignIn from "./pages/auth/SignIn/SignIn";
import { authenticate } from "./store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import { notificationActions } from "./store";
import Notification from "./components/UI/Notification/Notification";
function App() {
  const auth = useSelector((state) => state.auth);
  console.log("from app", auth);
  const notification = useSelector((state) => state.notification);
  const deviceData = useSelector((state) => state.devices);
  const selectedDevice = deviceData.devices.find(
    (device) => device.device_imei === deviceData.selectedDevice_id
  );
  console.log("the selected device is", selectedDevice);
  const isLoggedIn = auth.isLoggedIn;
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.hideAlert());
  };
  const closeCardHandler = () => {
    dispatch(notificationActions.hideCardNotification());
  };
  useEffect(() => {
    setTimeout(() => {
      dispatch(notificationActions.hideCardNotification());
      dispatch(notificationActions.hideAlert());
    }, [4000]);
  }, [dispatch]);
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
                style={{ zIndex: 1000000 }}
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
              style={{ zIndex: 1000000 }}
            >
              <span className="notification__text">
                {notification.alertMessage}
              </span>
            </Alert>
          )}
          {notification.showCardNotification && (
            <Notification
              type={notification.cardNotificationType}
              title={notification.cardNotificationTitle}
              message={notification.cardMessage}
              onClose={closeCardHandler}
            />
          )}

          <div className="container">
            <Sidebar />

            <div className="dashboard">
              <Route path="/dashboard" exact>
         

                <Dashboard />
              </Route>
              <Route path="/devices" exact>
                <Header title="Devices" />

                <Devices />
              </Route>
              <Route path="/home" exact>
                <Header title={`Welcome  ${auth.user ? auth.user.name : ""}`} />

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
              <Route path="/" exact>
                <Redirect to="/devices" />
              </Route>
              <Route path="*">
                <Redirect to="/devices" />
              </Route>
            </div>
          </div>
        </Fragment>
      )}
    </Switch>
  );
}

export default App;
