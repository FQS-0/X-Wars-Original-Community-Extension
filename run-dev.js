import { spawn } from "child_process"

function indentLinebreak(data) {
    return data.toString().replaceAll("\n", "\n  ").trim()
}

const parcel = spawn("npx", ["parcel", "watch", "src/manifest.json", "--host", "localhost", "--config", "@parcel/config-webextension", "--no-hmr"], {stdio : 'pipe' })
const webExt = spawn("npx", ["web-ext", "run", "--devtools", "-s", "dist/"], {stdio : 'pipe' })

parcel.stdout.setEncoding('utf8')
parcel.stdout.on("data", data => console.log(`parcel: ${indentLinebreak(data)}`))
parcel.stderr.setEncoding('utf8')
parcel.stderr.on("data", data => console.log(`parcel: ${indentLinebreak(data)}`))
parcel.on("error", (error) => console.log(`parcel: error: ${error.message}`))

webExt.stdout.setEncoding('utf8')
webExt.stdout.on("data", data => console.log(`web-ext: ${indentLinebreak(data)}`))
webExt.stderr.setEncoding('utf8')
webExt.stderr.on("data", data => console.log(`web-ext: ${indentLinebreak(data)}`))
webExt.on("error", (error) => console.log(`web-ext: error: ${error.message}`))