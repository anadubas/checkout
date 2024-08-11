import { Socket } from "phoenix-channels";

const socket = new Socket("ws://localhost:4000/socket", {
  params: "hello"
})

socket.connect();

export default socket;