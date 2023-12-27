import { StorageArea } from "~src/lib/StorageArea.js"

/**
 * Extract player id and current planet from search parameter query,
 * extract list of planets from select element 'pid' and store those
 * values in the extension local storage.
 */

const urlParams = new URLSearchParams(window.location.search)

const sessionId = urlParams.get("id")
if (!sessionId) {
    throw new Error("session id not found")
}
StorageArea.sessionId.set(sessionId)

const query = urlParams.get("query")

if (query) {
    const queryString = atob(query)
    const queryArray = queryString.split("#")
    if (queryArray.length == 5) {
        StorageArea.currentId.playerName.set(queryArray[1])
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
    } else {
        const select = window.document.querySelector("font[size] > b")
        if (select && select instanceof HTMLElement) {
            const planet = select.innerText
            StorageArea.currentId.planets.set([planet])
        }
    }
    StorageArea.currentId.currentPlanet.set(queryArray[2])
} else {
    console.error("menu.ts: query not found")
}
