import { deviceActions, url, socketUrl, notificationActions } from "..";
import { connectServer } from "../../utils/socket-client";
import socketIOClient from "socket.io-client";

const GET_DEVICE_PARAMS_EVENT = "GET_DEVICE_PARAMATERS";
const socket = connectServer(socketUrl);
export const getAllUserDevices = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const response = await fetch(`${url}/devices/getAll`, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showAlert({
          type: "error",
          message: error.message,
        })
      );

      throw new Error(error.message);
    }
    const data = await response.json();
    await dispatch(
      deviceActions.setDevices({
        devices: data.devices,
      })
    );
  };
};
export const getDeviceData = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    let device_id = state.devices.selectedDevice_id;
    const selectedIdNotDeleted = state.devices.devices.find(
      (device) => device.device_imei === device_id
    );
    console.log("selected devices o=", selectedIdNotDeleted);
    if (
      device_id === null ||
      !device_id ||
      device_id === undefined ||
      !selectedIdNotDeleted
    ) {
      if (!state.devices.devices || state.devices.devices.length === 0) {
        dispatch(
          notificationActions.showAlert({
            type: "error",
            message: "no devices found",
          })
        );
        return;
      }
      device_id = state.devices.devices[0].device_imei;
      console.log("changing device imei from here", device_id);
    }

    const response = await fetch(
      `${url}/data/getDeviceData?device_id=${device_id}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showAlert({
          type: "error",
          message: "error fetching device data " + error.message,
        })
      );
      return;
    }
    const data = await response.json();
    if (!data.data) {
      await dispatch(
        notificationActions.showAlert({
          type: "error",
          message: "selected device has not logged any data yet",
        })
      );
      await dispatch(
        deviceActions.upadateDeviceParameters({
          current: 0,
          voltage: 0,
          power: 0,
          createdAt: null,
          selectedDevice_id: device_id,
        })
      );
      return;
    }
    await dispatch(
      deviceActions.upadateDeviceParameters({
        current: data.data.current,
        voltage: data.data.voltage,
        power: data.data.power,
        createdAt: data.data.createdAt,
        selectedDevice_id: device_id,
      })
    );

    socket.on(`${GET_DEVICE_PARAMS_EVENT}-${device_id}`, async (data) => {
      console.log(
        "received data",
        `${GET_DEVICE_PARAMS_EVENT}-${device_id}`,
        data
      );
      await dispatch(
        deviceActions.upadateDeviceParameters({
          current: data.current,
          voltage: data.voltage,
          power: data.power,
          createdAt: data.createdAt,
          selectedDevice_id: device_id,
        })
      );
    });
  };
};

export const disconnectsocket = () => {
  console.log("disconnecting socket ...");
  socket.disconnect();
};

export const addDevice = (device_name, location, device_type) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const response = await fetch(`${url}/devices/registerDevice`, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      }),
      body: JSON.stringify({
        device_name,
        location,
        device_type,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showAlert({
          type: "error",
          message: error.message,
        })
      );

      throw new Error(error.message);
    }
    const data = await response.json();
    await dispatch(
      notificationActions.showAlert({
        type: "info",
        message: "successfully added device",
      })
    );
    dispatch(
      deviceActions.setDevices({
        devices: data.data,
      })
    );
  };
};

export const deleteDevice = (device_imei) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const response = await fetch(
      `${url}/devices/deleteDevice?device_id=${device_imei}`,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showAlert({
          type: "error",
          message: error.message,
        })
      );

      throw new Error(error.message);
    }
    dispatch(
      notificationActions.showAlert({
        type: "info",
        message: "device successfully deleted",
      })
    );
    dispatch(getAllUserDevices());
  };
};

export const changeSelectedDevice = (device_imei) => {
  return async (dispatch) => {
    await dispatch(deviceActions.setNewSelectedDevice({ device_imei }));
    await dispatch(getDeviceData());
  };
};

export const confirmPassword = (password) => {
  // console.log("the password is", passowrd);
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const response = await fetch(`${url}/users/confirmPassword`, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      }),
      body: JSON.stringify({
        password,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showAlert({
          type: "error",
          message: error.message,
        })
      );

      throw new Error(error.message);
    
    }
    // const data = await response.json();
  };
};
