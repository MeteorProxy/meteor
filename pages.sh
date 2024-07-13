#!/bin/bash
pnpm i
pnpm run build
cp -r dist/* demo/meteor
cp -r node_modules/@mercuryworkshop/bare-mux/* demo/baremux/
echo "Copied all needed files for the demo."