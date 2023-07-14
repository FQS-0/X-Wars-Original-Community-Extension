import { Planet } from "~/src/lib/Planet.js"

/**
 * Add a button that retrieves resources from extension storage and
 * logs it to console for demonstration purposes.
 */

const button = document.createElement("button")
button.type = "button"
button.innerText = "Get resources"
button.onclick = async () => console.log(await Planet.getDepot())

const td = document.querySelector("#servertime")?.parentElement?.parentElement
if (td) {
    td.appendChild(button)
}
