#!/bin/bash
pnpm i
pnpm run build
echo "Built meteor, copying stuff now..."
mkdir app
cp -r demo/* app/
cp -r dist/* app/meteor
cp -r node_modules/@mercuryworkshop/bare-mux/* app/baremux/
echo "Copied all needed files for the demo."