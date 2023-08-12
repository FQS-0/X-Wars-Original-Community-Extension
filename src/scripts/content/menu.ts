import { StorageArea } from "~src/lib/StorageArea.js"

/**
 * Extract player id and current planet from search parameter query,
 * extract list of planets from select element 'pid' and store those
 * values in the extension local storage.
 */

const query = new URLSearchParams(window.location.search).get("query")

if (query) {
    const queryString = atob(query)
    const queryArray = queryString.split("#")
    if (queryArray.length == 5) {
        StorageArea.currentId.set(queryArray[3])
    }
    const select = window.document.forms
        .namedItem("change_planet")
        ?.elements.namedItem("pid")
    if (select && select instanceof HTMLSelectElement) {
        const planets = Array.from(select.options).map(
            (option) => option.innerText
        )
        StorageArea.currentId.planets.set(planets)
    }
    StorageArea.currentId.currentPlanet.set(queryArray[2])
} else {
    console.error("menu.ts: query not found")
}
