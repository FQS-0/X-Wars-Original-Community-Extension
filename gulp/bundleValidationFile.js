import esbuild from "esbuild"

import { paths } from "./config.js"

async function esBuildCommonToEsm(validationFile) {
    await esbuild.build({
        // minify: true,
        bundle: true,
        target: ["chrome89", "firefox89"],
        keepNames: true,
        platform: "browser",
        format: "esm",
        entryPoints: [validationFile.pathname],
        outfile: validationFile.pathname,
        allowOverwrite: true,
    })
}

export async function bundleValidationFile() {
    await esBuildCommonToEsm(paths.validationFile)
}
