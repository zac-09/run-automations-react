import socketIOClient from "socket.io-client";

export const connectServer = (url) => {
  const socket = socketIOClient(url);
  console.log("successfully subscried")
  return socket;
};
