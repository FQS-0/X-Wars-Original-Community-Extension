import esbuild from "esbuild"
import process from "process"
import { watch } from "chokidar"
import { polyfillNode } from "esbuild-plugin-polyfill-node"

async function build() {
    try {
        await esbuild.build({
            entryPoints: [
                "./src/scripts/content/menu.ts",
                "./src/scripts/content/resources.tsx",
                "./src/scripts/content/status.ts",
                "./src/scripts/content/top.ts",
                "./src/scripts/content/bank.tsx",
                "./src/scripts/content/overview.ts",
                "./src/scripts/content/production_list.ts",
                "./src/scripts/content/fleet_movement.ts",
                "./src/scripts/content/trade_create_offer.tsx",
                "./src/scripts/content/trades.tsx",
                "./src/scripts/options/options.tsx",
            ],
            bundle: true,
            minify: false,
            sourcemap: "inline",
            target: ["chrome89", "firefox89"],
            outdir: "./build",
            outbase: "src",
            define: {
                "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
                "process.env.NODE_DEBUG": "false",
            },
            format: "esm",
            plugins: [
                polyfillNode({
                    "globals.process": false,
                }),
            ],
        })
        console.log(`${new Date()} Build successful.`)
    } catch (e) {
        console.log(`${new Date()} Build error: ${e}`)
    }
}

build()

if (process.argv.includes("--watch")) {
    const watcher = watch(["src/**/*"])
    console.log("Watching files")
    watcher.on("change", () => build())
}
