import { deviceActions, url } from "..";

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
  };
};
