# Meteor

A simple fast interception proxy

## Table of Contents

- [Installation](#installation)
- [Usage](#usage-in-your-frontend)

## Installation

1. You can install meteor using the npm package: `npm i @z1g-project/meteor` or by building it
2A. If your building, clone or download this repo and run `npm i; npm run build` then copy all the files from the `dist` folder to where you will be serving them.
2B. If your installing via npm, You can import it into your project using `import meteorPath from "@z1g-project/meteor"` or if your using CJS `const meteorPath = require("@z1g-project/meteor") then include it in your backend. Below is an example of it with a Express Backend and a Fastify Backend

- Express
  - Example:

  ```js
    app.use(meteorPath, '/meteor/');
  ```

- Fastify
  - Example:

  ```js
    Fastify({}).register(fastifyStatic, {
    root: meteorPath,
    prefix: '/meteor/',
    decorateReply: false
  })
  ```

## Usage in your frontend

1. Adding meteor to your frontend is incredibly easy to do, First go ahead and create a script for your service worker and in it put something along the lines of this:

 - Example:

 ```js
importScripts('https://unpkg.com/@mercuryworkshop/epoxy-transport@2.0.6/dist/index.js') // Replace with the transport of your choice
importScripts('/meteor/meteor.bundle.js')
importScripts('/meteor/meteor.config.js')
importScripts('/meteor/meteor.worker.js')

const meteor = new MeteorServiceWorker()

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (meteor.shouldRoute(event)) {
        return meteor.handleFetch(event)
      }

      return await fetch(event.request)
    })()
  )
})
 ```

2. Next, Make sure you have [baremux](https://github.com/mercuryworkshop/bare-mux) installed. This can be added to your backend exactly how you did for the meteor files in [#installation](#installation) except replace the imports to `baremuxPath` from `@mercuryworkshop/bare-mux`.

3. Next, Add your registration script for your service worker. An example of how to do this is below:

  - Example:

  ```js
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        for await (const registration of registrations) {
          await registration.unregister()
        }

        const registration = await navigator.serviceWorker.register('/sw.js') // Replace sw.js with whatever you named your sw script from step 1
        BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: `${location.protocol === "http:" ? 'ws:' : 'wss:'}//${location.host}/wisp/` }) // Replace with whatever transport and wisp server you are going to use.
      })
  }
  ```

4. In your frontend if you dont already have a button or input, etc go ahead and do so, then when your adding your click event go ahead and add something along the lines of the example below.

 - Example:

 ```js
      // Change this to whatever your input is.
      const input = document.querySelector("input")
      // Feel free to change this to a iframe src, etc
      window.location.href = "/route/" + __meteor$config.codec.encode(input.value)
 ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

© 2024 z1g Project All rights Reservced
