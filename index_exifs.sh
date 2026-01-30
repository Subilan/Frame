SCRIPT=$(readlink -f "$0")
BASEPATH=$(dirname "$SCRIPT")
DATAPATH="$BASEPATH/app/data"
vite-node "$DATAPATH/indexExifs.js"
cp "$DATAPATH/exifs_indexed.json" "$BASEPATH/public"