import { readFile, writeFile } from "fs/promises"
import { paths } from "./config.js"

async function updateManifest(manifestPath) {
    const manifest = JSON.parse(await readFile(manifestPath))

    manifest.version = process.env.npm_package_version

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
}

async function updateFirefoxManifest(manifestPath) {
    const manifest = JSON.parse(await readFile(manifestPath))

    manifest.browser_specific_settings = {
        gecko: { id: "xwo-com-ext@oorgle.de" },
    }

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
}

async function updateChromeManifest(manifestPath) {
    const manifest = JSON.parse(await readFile(manifestPath))

    manifest.permissions = [...manifest.permissions, "sidePanel"]
    manifest.side_panel = {
        default_path: manifest.sidebar_action.default_panel,
    }
    delete manifest.sidebar_action

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
}

export async function updateManifestAtFirefox() {
    const manifestPath = new URL("manifest.json", paths.firefoxPackDir).pathname
    await updateManifest(manifestPath)
    await updateFirefoxManifest(manifestPath)
}

export async function updateManifestAtFirefoxRun() {
    const manifestPath = new URL("manifest.json", paths.firefoxRunPackDir)
        .pathname
    await updateManifest(manifestPath)
    await updateFirefoxManifest(manifestPath)
}

export async function updateManifestAtChrome() {
    const manifestPath = new URL("manifest.json", paths.chromePackDir).pathname
    await updateManifest(manifestPath)
    await updateChromeManifest(manifestPath)
}

export async function updateManifestAtChromeRun() {
    const manifestPath = new URL("manifest.json", paths.chromeRunPackDir)
        .pathname
    await updateManifest(manifestPath)
    await updateChromeManifest(manifestPath)
}
