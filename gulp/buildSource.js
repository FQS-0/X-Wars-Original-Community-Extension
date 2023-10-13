import { build } from "./build.js"

export async function buildSource() {
    await build(false)
}
