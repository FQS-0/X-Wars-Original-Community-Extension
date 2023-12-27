import { as } from "~/src/lib/DOMHelpers.js"
import { replaceUTCWithLocal } from "~/src/lib/Date.js"
import { StorageArea } from "~src/lib/StorageArea.js"

const serverTimeElement = as(
    window.document.querySelector("#servertime"),
    HTMLElement
)
const serverTimeArray = serverTimeElement.innerHTML
    .split(":")
    .map((s) => parseInt(s))

const localTime = new Date()
const serverTime = new Date()
serverTime.setUTCHours(
    serverTimeArray[0],
    serverTimeArray[1],
    serverTimeArray[2]
)
const serverTimeDiff = serverTime.getTime() - localTime.getTime()

StorageArea.servertimeOffset.set(serverTimeDiff)

replaceUTCWithLocal(serverTimeElement)

serverTimeElement.addEventListener("DOMCharacterDataModified", () => {
    serverTimeElement.innerHTML = new Date(
        new Date().getTime() + serverTimeDiff
    ).toLocaleTimeString()
})
