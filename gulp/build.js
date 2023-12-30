import esbuild from "esbuild"
import process from "process"
import { polyfillNode } from "esbuild-plugin-polyfill-node"
import { promises as fs } from "fs"
import gulp from "gulp"

import { entryPoints } from "./config.js"

import { cleanBuildDir } from "./cleanDir.js"

export const buildProduction = gulp.series(cleanBuildDir, transpileProduction)
export const buildDebug = gulp.series(cleanBuildDir, transpileDebug)

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
