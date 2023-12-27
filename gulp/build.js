import esbuild from "esbuild"
import process from "process"
import { polyfillNode } from "esbuild-plugin-polyfill-node"
import { promises as fs } from "fs"

import { entryPoints } from "./config.js"

export async function transpileProduction() {
    await build()
}
export async function transpileDebug() {
    await build(true)
}

async function build(dev = false) {
    const meta = await esbuild.build({
        entryPoints: entryPoints,
        bundle: true,
        minify: dev ? false : true,
        splitting: false,
        sourcemap: dev ? "inline" : false,
        target: ["chrome89", "firefox89"],
        outdir: "./build",
        outbase: "src",
        metafile: dev ? false : true,
        define: {
            "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
            "process.env.NODE_DEBUG": "false",
        },
        format: "esm",
        plugins: [
            polyfillNode({
                globals: { process: false },
            }),
        ],
    })
    if (!dev) await fs.writeFile("meta.json", JSON.stringify(meta.metafile))
}
