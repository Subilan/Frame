SCRIPT=$(readlink -f "$0")
BASEPATH=$(dirname "$SCRIPT")
DATAPATH="$BASEPATH/app/data"
vite-node "$DATAPATH/syncCollections.js"
vite-node "$DATAPATH/syncImageExif.js"
vite-node "$DATAPATH/mergeExifAndFiletree.js"