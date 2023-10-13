import { paths } from "./config.js"
import { cleanDir } from "./cleanDir.js"

export async function cleanSchemaDir() {
    await cleanDir(paths.schemaDir.pathname)
}
