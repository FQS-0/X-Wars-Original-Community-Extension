import fs from "fs/promises"

import { paths } from "./config.js"

import ChromeExtension from "crx"

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
