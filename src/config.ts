import { cfg } from "./types/cfg"

declare global {
    interface Window {
        __chloride$config: cfg
    }
}

self.__chloride$config = {
    prefix: "/chloride/",
    codec: "XOR",
    config: "config.js",
    client: "client.js",
    worker: "worker.js"
}