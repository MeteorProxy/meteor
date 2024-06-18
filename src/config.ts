import { cfg } from "./types/cfg"

declare global {
    interface Window {
        __meteor$config: cfg
    }
}

self.__meteor$config = {
    prefix: "/meteor/",
    codec: "XOR",
    config: "config.js",
    client: "client.js",
    worker: "worker.js"
}