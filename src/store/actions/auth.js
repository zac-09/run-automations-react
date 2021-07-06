import { authActions, deviceActions, notificationActions, url } from "../index";

let timer;
export const logout = () => {
  clearLogoutTimer();
  localStorage.removeItem("userData");
  return authActions.logout();
};
export const authenticate = (user, token, devices, expiryTime) => {
  return async (dispatch) => {
    await dispatch(authActions.authenticate({ token: token, user: user }));
    // await dispatch(
    //   deviceActions.setDeviceData({
    //     devices: devices,
    //     selectedDevice_id: devices[0].device_imei,
    //   })
    // ); 
    dispatch(setLogoutTimer(expiryTime));
  };
};
const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const saveDataToStorage = (user, token, devices, expirationDate) => {
  localStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      user: user,
      devices: devices,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const login = (email, password, remember_me = false) => {
  return async (dispatch) => {
    const response = await fetch(`${url}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        notificationActions.showAlert({ type: "error", message: error.message })
      );

      throw new Error(error.message);
    }
    const data = await response.json();
    console.log("data from action", data);
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn)
    );
    await dispatch(
      authActions.authenticate({ token: data.token, user: data.data.user })
    );
    // await dispatch(
    //   deviceActions.setDeviceData({
    //     devices: data.data.devices,
    //     selectedDevice_id: data.data.devices[0].device_imei,
    //   })
    // );
    // authenticate(data.token, data.data.user, +data.expiresIn);
    dispatch(setLogoutTimer(+data.expiresIn));

    saveDataToStorage(
      data.data.user,
      data.token,
      data.data.devices,
      expirationDate
    );
  };
};
