<div align="center">
  <img src="assets/meteor.png" height="250" />
</div>

---

> [!WARNING]
> Meteor is in a very early stage of development. Mainstream site support is not guaranteed. You can see our roadmap [here](TODO.md).

The modern interception proxy you've been waiting for.

Meteor is a web proxy powered by service workers that intercepts HTTP requests and routes them through a Wisp server using bare-mux.

## Installation
Meteor is a client-side JavaScript library. You can install it in your application in one of two ways:

1. Hosting manually

Build Meteor's scripts by first cloning the repository, installing packages (`pnpm install`),  running `pnpm build` and copy the files in the `dist/` folder into a `meteor` folder in your application's folder.

2. Serving a static path with a backend framework

`meteorPath` is exported from the `meteorproxy` [NPM package](https://npmjs.com/package/meteorproxy), which resolves to a path in `node_modules` of built Meteor scripts. You can use this however you serve static directories in your backend framework.

Express:
```js
import express from 'express'
import { meteorPath } from 'meteorproxy'

const app = express()
app.use("/meteor/", express.static(meteorPath)
```

Fastify:
```js
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { meteorPath } from 'meteorproxy'

Fastify()
  .register(fastifyStatic, {
    root: meteorPath,
    prefix: '/meteor/'
  })
```

You can use this path with the `vite-plugin-static-copy` Vite plugin in your Vite (or Vite-powered) app to copy Meteor scripts into your assets directory. Install `vite-plugin-static-copy` with your favorite package manager and use the path in the plugin's configuration.

```js
import { defineConfig } from 'vite'
import { meteorPath } from 'meteorproxy'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    // ...
    viteStaticCopy({
      targets: [
        {
          src: `${meteorPath}/meteor.*`.replace(/\\/g, "/"),
          dest: "meteor",
          overwrite: false,
        },
      ],
    })
  ]
})
```

## Usage
Once you have the scripts served, register your service worker and set your transport on your frontend.

```js
if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js')
    BareMux.SetTransport(
      "EpxMod.EpoxyClient", // replace with your transport
      { wisp: `wss://wisp-server-here.com` } // replace with the url of your wisp server
    )
  })
}

// After a button click or other event:
iframe.src = self.$meteor.util.formatUrl("https://google.com"") // replace with a chosen url
```

> [!IMPORTANT]
> During our testing, we've found that Meteor only supports being viewed inside iframes due to a limitation with bare-mux.

More in-depth usage and configuration will be coming soon in a Wiki.

## Testing and development
Running `pnpm demo` will serve a UI to test Meteor, along with a dev server that watches for changes in the source code and re-builds accordingly.
