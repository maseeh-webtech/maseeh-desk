import socketIOClient from "socket.io-client";
const endpoint = window.location.hostname + ":" + window.location.port;
export let socket = socketIOClient(endpoint);

export const reconnect = () => {
  socket = socketIOClient(endpoint, { forceNew: true });
};
