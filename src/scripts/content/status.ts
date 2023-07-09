import { getResources } from "../../lib/storage.js"

console.log("Loaded frame status.")

const button = document.createElement("button")
button.type = "button"
button.innerText = "Get resources"
button.onclick = async () => console.log(await getResources())

const td = document.querySelector("#servertime")?.parentElement?.parentElement
if (td) {
    td.appendChild(button)
}
