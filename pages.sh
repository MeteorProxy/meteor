#!/bin/bash
pnpm i
pnpm run build
cp -r dist/* demo/meteor
cp node_modules/@mercuryworkshop/bare-mux/index.js demo/bare-mux.js
echo "Copied all needed files for the demo."