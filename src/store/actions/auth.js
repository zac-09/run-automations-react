import { authActions } from "../index";

const url = "https://cryptic-wave-64102.herokuapp.com";
let timer;
export const logout = () => {
  clearLogoutTimer();
  localStorage.removeItem("userData");
  return authActions.logout();
};
export const authenticate = (user, token, expiryTime) => {
  return (dispatch) => {
    dispatch(authActions.authenticate({ token: token, user: user }));
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

const saveDataToStorage = (user, token, expirationDate) => {
  localStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      user: user,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const login = (email, password, remember_me = false) => {
  return async (dispatch) => {
    const response = await fetch(`${url}/login`, {
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
      throw new Error("login failed");
    }
    const data = await response.json();
    console.log("data from action", data);
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn)
    );
    dispatch(authActions.authenticate({ token: data.token, user: data.user }));
    // authenticate(data.token, data.data.user, +data.expiresIn);
    dispatch(setLogoutTimer(+data.expiresIn));

    saveDataToStorage(data.data.user, data.token, expirationDate);
  };
};
