import { deviceActions, url, socketUrl } from "..";
import { connectServer } from "../../utils/socket-client";
import socketIOClient from "socket.io-client";

const GET_DEVICE_PARAMS_EVENT = "GET_DEVICE_PARAMATERS";
const socket = connectServer(socketUrl);

export const getDeviceData = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const device_id = state.devices.selectedDevice_id;
    console.log("the device id is", device_id);
    const response = await fetch(
      `${url}/data/getDeviceData?device_id=${device_id}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
        }),
      }
    );
    const data = await response.json();
    console.log("the data is", data);
    await dispatch(
      deviceActions.upadateDeviceParameters({
        current: data.data.current,
        voltage: data.data.voltage,
        power: data.data.power,
        createdAt: data.data.createdAt,
      })
    );

    socket.on(`${GET_DEVICE_PARAMS_EVENT}-${device_id}`, async (data) => {
      console.log("data received socket", data);
      await dispatch(
        deviceActions.upadateDeviceParameters({
          current: data.current,
          voltage: data.voltage,
          power: data.power,
          createdAt: data.createdAt,
        })
      );
    });
  };
};

export const disconnectsocket = () => {
  console.log("disconnecting socket ...");
  socket.disconnect();
};
