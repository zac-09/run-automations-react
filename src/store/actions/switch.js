import { switchActions, url, notificationActions } from "..";

export const getSwitchData = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const device_id = state.devices.selectedDevice_id;

    const response = await fetch(`${url}/switch?device_id=${device_id}`, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
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
    console.log("from switch", data.relay.relay, device_id);
    await dispatch(
      switchActions.toggleSwitch({
        relay_on: data.relay.relay === 1 ? true : false,
      })
    );
  };
};

export const toggleSwitch = (relay_status) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const device_id = state.devices.selectedDevice_id;
    const response = await fetch(`${url}/switch`, {
      method: "POST",
      body: JSON.stringify({
        relay: relay_status === true ? 1 : 0,
        device_imei: device_id,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      }),
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
    await dispatch(
      switchActions.toggleSwitch({
        relay_on: data.data.relay.relay === 1 ? true : false,
      })
    );
    dispatch(
      notificationActions.showAlert({
        type: "info",
        message:
          data.data.relay.relay === 1
            ? "device   sitched on"
            : "device  switched off",
      })
    );
  };
};
