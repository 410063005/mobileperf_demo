import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: [],
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

// TODO use your own URL!
const URL = "http://localhost:5000"

export const socket = io(URL);

socket.on("connect", () => {
    state.connected = true;
    console.log('connected');
});

socket.on("disconnect", () => {
    state.connected = false;
});

socket.on("foo", (...args) => {
    state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
    state.barEvents.push(args);
});