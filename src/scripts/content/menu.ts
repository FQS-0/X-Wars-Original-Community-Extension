import { Account } from "~/src/lib/Account.js"

/**
 * Extract player id and current planet from search parameter query,
 * extract list of planets from select element 'pid' and store those
 * values in the extension local storage.
 */

const query = new URLSearchParams(window.location.search).get("query")

if (query) {
    const queryString = atob(query)
    const queryArray = queryString.split("#")
    Account.setCurrentPlanet(queryArray[2])
    if (queryArray.length == 5) {
        Account.setId(queryArray[3])
    }
    const select = window.document.forms
        .namedItem("change_planet")
        ?.elements.namedItem("pid")
    if (select && select instanceof HTMLSelectElement) {
        const planets = Array.from(select.options).map(
            (option) => option.innerText
        )
        Account.setPlanets(planets)
    }
} else {
    console.error("menu.ts: query not found")
}
