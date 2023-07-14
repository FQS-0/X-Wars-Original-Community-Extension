import { unserialize } from "php-serialize"
import { Depot, Planet } from "~/src/lib/Planet.js"

/** Extract resource stock, production per hour and max capacity from
 * the search parameter q and store those values in the local extension
 * storage
 */

const qEncoded = new URLSearchParams(window.location.search).get("q")

if (qEncoded) {
    const qDecoded = atob(qEncoded)
    const qUnserialized = unserialize(qDecoded)
    if (qUnserialized.r && qUnserialized.rm && qUnserialized.rp) {
        const depot: Depot = {
            date: new Date(),
            stock: { ...qUnserialized.r },
            perHour: { ...qUnserialized.rp },
            max: { ...qUnserialized.rm },
        }
        Planet.setDepot(depot)
    } else {
        console.error("no resources in q")
    }
} else {
    console.error("q not found")
}