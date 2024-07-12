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

`meteorPath` is exported from the `@z1g-project/meteor` [NPM package](https://npmjs.com/package/@z1g-project/meteor), which resolves to a path in `node_modules` of built Meteor scripts. You can use this however you serve static directories in your backend framework.

Express:
```js
import express from 'express'
import { meteorPath } from '@z1g-project/meteor'

const app = express()
app.use("/meteor/", express.static(meteorPath)
```

Fastify:
```js
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { meteorPath } from '@z1g-project/meteor'

Fastify()
  .register(fastifyStatic, {
    root: meteorPath,
    prefix: '/meteor/'
  })
```

You can also use the path with Vite, or anything based off Vite, such as Astro. Install the `vite-plugin-static-copy` plugin and use the path in the plugin's configuration.

```js
import { defineConfig } from 'vite'
import { meteorPath } from '@z1g-project/meteor'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
				{
					src: `${meteorPath}/meteor.*`.replace(/\\/g, "/"),
					dest: "meteor",
					overwrite: false,
				},
				// you can do the same with transports!!
			],
    })
  ]
  // other config
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
window.location.href = self.$meteor.config.prefix + self.$meteor.config.codec.encode("https://example.com") // replace url with the (full) url you want to navigate to
```

More in-depth usage and configuration can be found in the Wiki.

## Testing and development
Running `pnpm demo` will serve a basic UI to test Meteor, along with a dev server that watches for changes in the source code and re-builds accordingly.
