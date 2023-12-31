import fs from "fs/promises"
import ChromeExtension from "crx"
import webext from "web-ext"
import { globby } from "globby"

import { paths } from "./config.js"

export async function signChromeExtension() {
    const builder = new ChromeExtension({
        privateKey: process.env.CHROME_EXT_KEY,
    })

    const extension = await builder.load(paths.chromePackDir.pathname)
    const crxBuffer = await extension.pack()
    await fs.writeFile(
        `${paths.distDir.pathname}xwo-com-ext-${process.env.npm_package_version}-chrome.crx`,
        crxBuffer
    )
}

export async function signFirefoxExtension() {
    webext.cmd.sign({
        artifactsDir: paths.distDir.pathname,
        sourceDir: paths.firefoxPackDir.pathname,
        apiKey: process.env.WEBEXT_API_KEY,
        apiSecret: process.env.WEBEXT_API_SECRET,
        channel: "unlisted",
    })
}

export async function renameFirefoxExtension() {
    const files = await globby(`*-${process.env.npm_package_version}.xpi`, {
        cwd: paths.distDir,
    })

    if (files.length != 1)
        throw new Error("expected one file, got " + files.length)

    const xpiPath = new URL(files[0], paths.distDir)
    const newXpiPath = new URL(
        `xwo-com-ext-${process.env.npm_package_version}-firefox.xpi`,
        paths.distDir
    )

    await fs.rename(xpiPath, newXpiPath)
}
