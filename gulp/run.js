import gulp from "gulp"

import { paths } from "./config.js"

import { buildDebug, transpileDebug } from "./build.js"
import { generateValidation } from "./validation.js"
import {
    assembleFirefoxRun,
    assembleChromeRun,
    copyScriptsToFirefoxRunDir,
    copyScriptsTochromeRunDir,
} from "./package.js"

import { spawn } from "child_process"
import {
    updateManifestAtChromeRun,
    updateManifestAtFirefoxRun,
} from "./manifest.js"

function indentLinebreak(data) {
    return data.toString().replaceAll("\n", "\n  ").trim()
}

export const prepareFirefoxRunDir = gulp.series(
    generateValidation,
    buildDebug,
    assembleFirefoxRun,
    updateManifestAtFirefoxRun
)

export const prepareChromeRunDir = gulp.series(
    generateValidation,
    buildDebug,
    assembleChromeRun,
    updateManifestAtChromeRun
)

export const startFirefox = async () => {
    const srcWatcher = gulp.watch(
        ["src/**/*.{js,ts,tsx}", "!src/lib/json/**"],
        gulp.series(transpileDebug, copyScriptsToFirefoxRunDir)
    )
    const valWatcher = gulp.watch(
        "src/lib/json/types/*.ts",
        gulp.series(
            generateValidation,
            transpileDebug,
            copyScriptsToFirefoxRunDir
        )
    )

    const webextParameters = [
        "web-ext",
        "run",
        "-s",
        paths.firefoxRunPackDir.pathname,
    ]

    if (process.env.PATH_TO_FF_PROFILE)
        webextParameters.push(
            ...[
                "--firefox-profile",
                process.env.PATH_TO_FF_PROFILE,
                "--keep-profile-changes",
                "--pref=signon.rememberSignons=true",
                "--pref=browser.startup.homepage=https://original.xwars.net/login.php?",
            ]
        )

    const webExt = spawn("npx", webextParameters, {
        stdio: "pipe",
    })

    webExt.stdout.setEncoding("utf8")
    webExt.stdout.on("data", (data) =>
        console.log(`web-ext: ${indentLinebreak(data)}`)
    )
    webExt.stderr.setEncoding("utf8")
    webExt.stderr.on("data", (data) =>
        console.log(`web-ext: ${indentLinebreak(data)}`)
    )
    webExt.on("error", (error) =>
        console.log(`web-ext: error: ${error.message}`)
    )
    webExt.on("close", () => {
        srcWatcher.close()
        valWatcher.close()
    })
}

export const startChrome = async () => {
    const srcWatcher = gulp.watch(
        ["src/**/*.{js,ts,tsx}", "!src/lib/json/**"],
        gulp.series(transpileDebug, copyScriptsTochromeRunDir)
    )
    const valWatcher = gulp.watch(
        "src/lib/json/types/*.ts",
        gulp.series(
            generateValidation,
            transpileDebug,
            copyScriptsTochromeRunDir
        )
    )

    const webextParameters = [
        "web-ext",
        "run",
        "--devtools",
        "-s",
        paths.chromeRunPackDir.pathname,
        "--target",
        "chromium",
    ]

    if (process.env.PATH_TO_CHROME_PROFILE)
        webextParameters.push(
            ...["--chromium-profile", process.env.PATH_TO_CHROME_PROFILE]
        )

    const webExt = spawn("npx", webextParameters, {
        stdio: "pipe",
    })

    webExt.stdout.setEncoding("utf8")
    webExt.stdout.on("data", (data) =>
        console.log(`web-ext: ${indentLinebreak(data)}`)
    )
    webExt.stderr.setEncoding("utf8")
    webExt.stderr.on("data", (data) =>
        console.log(`web-ext: ${indentLinebreak(data)}`)
    )
    webExt.on("error", (error) =>
        console.log(`web-ext: error: ${error.message}`)
    )
    webExt.on("close", () => {
        srcWatcher.close()
        valWatcher.close()
    })
}

export const runFirefox = gulp.series(prepareFirefoxRunDir, startFirefox)
export const runChrome = gulp.series(prepareChromeRunDir, startChrome)
