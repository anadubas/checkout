import socket from "../socket";

const channel = socket.channel("order:lobby", {});

channel.join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp);
  })
  .receive("error", resp => {
    console.log("Unable to join", resp);
  });

export default channel;