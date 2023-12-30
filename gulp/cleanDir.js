import { deleteAsync } from "del"
import { paths } from "./config.js"

async function cleanDir(dir) {
    await deleteAsync(dir + "**", "!" + dir)
}

export async function cleanSchemaDir() {
    await cleanDir(paths.schemaDir.pathname)
}

export async function cleanBuildDir() {
    await cleanDir(paths.buildDir.pathname)
}

export async function cleanFirefoxPackDir() {
    await cleanDir(paths.firefoxPackDir.pathname)
}

export async function cleanChromePackDir() {
    await cleanDir(paths.chromePackDir.pathname)
}

export async function cleanFirefoxRunPackDir() {
    await cleanDir(paths.firefoxRunPackDir.pathname)
}

export async function cleanChromeRunPackDir() {
    await cleanDir(paths.chromeRunPackDir.pathname)
}
