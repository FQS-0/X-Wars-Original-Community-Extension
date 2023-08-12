import { unserialize } from "php-serialize"
import { Depot, Resources } from "~src/lib/Resource.js"
import { StorageArea } from "~src/lib/StorageArea.js"

/** Extract resource stock, production per hour and max capacity from
 * the search parameter q and store those values in the local extension
 * storage
 */

const qEncoded = new URLSearchParams(window.location.search).get("q")

if (qEncoded) {
    const qDecoded = atob(qEncoded)
    const qUnserialized = unserialize(qDecoded)
    if (qUnserialized.r && qUnserialized.rm && qUnserialized.rp) {
        const depot = new Depot(
            new Date(),
            Resources.fromArray(qUnserialized.r),
            Resources.fromArray(qUnserialized.rp),
            Resources.fromArray(qUnserialized.rm)
        )
        StorageArea.currentId.currentPlanet.depot.set(depot)
    } else {
        console.error("no resources in q")
    }
} else {
    console.error("q not found")
}

const fontElements = window.document.querySelectorAll("font")
if (fontElements) {
    const resourceNames = Array.from(fontElements).map(
        (e) => e.childNodes[0].textContent ?? "-1"
    )
    StorageArea.currentId.resourceNames.set(resourceNames)
}
