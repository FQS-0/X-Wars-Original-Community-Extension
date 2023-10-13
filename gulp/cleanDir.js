import { deleteAsync } from "del"

export async function cleanDir(dir) {
    await deleteAsync(dir + "**", "!" + dir)
}
