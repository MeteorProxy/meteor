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

1. Adding meteor to your frontend is incredibly easy to do, First go ahead and // TODO

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

© 2024 z1g Project All rights Reservced
