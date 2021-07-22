import { deviceActions, url, socketUrl, notificationActions } from "..";
import { connectServer } from "../../utils/socket-client";
import socketIOClient from "socket.io-client";

const GET_DEVICE_PARAMS_EVENT = "GET_DEVICE_PARAMATERS";
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);
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
          notificationActions.showCardNotification({
            type: "warning",
            message: "no devices found",
            title: "caution",
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "error fetching data",
        })
      );
      // setTimeout(() => {
      //   dispatch(notificationActions.hideCardNotification());
      // }, [3000]);
      return;
    }
    const data = await response.json();
    if (!data.data) {
      await dispatch(
        notificationActions.showCardNotification({
          type: "warning",
          message: "selected device has not logged any data yet",
          title: "Device not logging",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);
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
    const socket = connectServer(socketUrl);

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
  const socket = connectServer(socketUrl);

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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "An error occured",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);

      throw new Error(error.message);
    }
    const data = await response.json();
    await dispatch(
      notificationActions.showCardNotification({
        type: "success",
        message: "successfully added device",
        title: "success",
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error deleting",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);

      throw new Error(error.message);
    }
    dispatch(
      notificationActions.showCardNotification({
        type: "success",
        message: "device successfully deleted",
        title: "success",
      })
    );
    dispatch(getAllUserDevices());
  };
};

export const changeSelectedDevice = (device_imei) => {
  return async (dispatch) => {
    await dispatch(deviceActions.setNewSelectedDevice({ device_imei }));
    await dispatch(getDeviceData());
    await dispatch(getDeviceMonthlyData(2021));
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Authentication Error",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);
      throw new Error(error.message);
    }
    // const data = await response.json();
  };
};

export const updateDeviceDetails = (
  device_name,
  location,
  device_type,
  device_imei
) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const response = await fetch(`${url}/devices/updateDevice`, {
      method: "PUT",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      }),
      body: JSON.stringify({
        device_name,
        location,
        device_type,
        device_imei,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      //   console.log(error.message);
      dispatch(
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error while updating",
        })
      );
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, [4000]);
      throw new Error(error.message);
    }
    dispatch(
      notificationActions.showCardNotification({
        type: "success",
        message: "device info successfully updated ",
        title: "success",
      })
    );
    setTimeout(() => {
      dispatch(notificationActions.hideCardNotification());
    }, [4000]);
    dispatch(getAllUserDevices());
  };
};

export const getDeviceAnnualData = (year) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    let device_id = state.devices.selectedDevice_id;

    const response = await fetch(
      `${url}/data/getDeviceStats/annual?device_id=${device_id}&year=${year}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
        }),
      }
    );
    const data = await response.json();

    const chartData = data;
    console.log("the chart data is ", data);
  };
};
export const getDeviceMonthlyData = (year) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    let device_id = state.devices.selectedDevice_id;
    console.log("getting monthly dara");
    const response = await fetch(
      `${url}/data/getDeviceStats/monthly?device_id=${device_id}&year=${year}`,
      {
        method: "GET",
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error while getting chart data ",
        })
      );
      dispatch(deviceActions.setDeviceChartData({ chartData: {} }));

      // setTimeout(() => {
      //   dispatch(notificationActions.hideCardNotification());
      // }, [3000]);
      // throw new Error(error.message);
      return;
    }
    const data = await response.json();
    if (
      data.data.length === 0 ||
      data.data === undefined ||
      data.data === null
    ) {
      dispatch(
        await notificationActions.showCardNotification({
          type: "warning",
          message: "no chart data found device has not yet logged any data",
          title: "No data found ",
        })
      );
    }
    const newData = {
      labels: [],
      datasets: [
        {
          label: "Power in Watts",
          data: [],
          fill: true,
          backgroundColor: "#5accf0",
          borderColor: "#5accf0",
        },
      ],
    };
    data.data.forEach((el) => {
      newData.labels.push(el.month);
      newData.datasets[0].data.push(el.averagePower.toFixed(2));
    });
    console.log("the chart data is ", newData);
    dispatch(
      deviceActions.setDeviceChartData({
        chartData: newData,
        timeRange: `Annual Power ${year}`,
      })
    );
  };
};
export const getDeviceWeeklyData = (year, week) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    let device_id = state.devices.selectedDevice_id;
    console.log("getting monthly dara");
    const response = await fetch(
      `${url}/data/getDeviceStats/weekly?device_id=${device_id}&year=${year}&week=${week}`,
      {
        method: "GET",
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error while getting chart data ",
        })
      );
      dispatch(deviceActions.setDeviceChartData({ chartData: {} }));

      // setTimeout(() => {
      //   dispatch(notificationActions.hideCardNotification());
      // }, [3000]);
      // throw new Error(error.message);
      return;
    }
    const data = await response.json();
    if (
      data.data.length === 0 ||
      data.data === undefined ||
      data.data === null
    ) {
      dispatch(
        await notificationActions.showCardNotification({
          type: "warning",
          message: "no chart data found device has not yet logged any data",
          title: "No data found ",
        })
      );
    }
    const newData = {
      labels: [],
      datasets: [
        {
          label: "Power in Watts",
          data: [],
          fill: true,
          backgroundColor: "#5accf0",
          borderColor: "#5accf0",
        },
      ],
    };
    data.data.forEach((el) => {
      newData.labels.push(el.dayOfWeek);
      newData.datasets[0].data.push(el.averagePower.toFixed(2));
    });
    console.log("the chart data is ", newData);
    dispatch(
      deviceActions.setDeviceChartData({
        chartData: newData,
        timeRange: `Weekly Power ${year}`,
      })
    );
  };
};
export const getDeviceRealtimeData = (year, month, day) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    let device_id = state.devices.selectedDevice_id;
    console.log("getting monthly dara");
    const response = await fetch(
      `${url}/data/getDeviceStats/realtime?device_id=${device_id}&year=${year}&month=${month}&day=${day}`,
      {
        method: "GET",
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
        await notificationActions.showCardNotification({
          type: "error",
          message: error.message,
          title: "Error while getting chart data ",
        })
      );
      dispatch(deviceActions.setDeviceChartData({ chartData: {} }));

      // setTimeout(() => {
      //   dispatch(notificationActions.hideCardNotification());
      // }, [3000]);
      // throw new Error(error.message);
      return;
    }
    const data = await response.json();
    if (
      data.data.length === 0 ||
      data.data === undefined ||
      data.data === null
    ) {
      dispatch(
        await notificationActions.showCardNotification({
          type: "warning",
          message: "no chart data found device has not yet logged any data",
          title: "No data found ",
        })
      );
    }
    const newData = {
      labels: [],
      datasets: [
        {
          label: "Power in Watts",
          data: [],
          fill: true,
          backgroundColor: "#5accf0",
          borderColor: "#5accf0",
        },
      ],
    };
    data.data.forEach((el) => {
      newData.labels.push(el.time);
      newData.datasets[0].data.push(el.averagePower.toFixed(2));
    });
    console.log("the chart data is ", newData);
    dispatch(
      deviceActions.setDeviceChartData({
        chartData: newData,
        timeRange: `Real-time Power `,
      })
    );
  };
};
