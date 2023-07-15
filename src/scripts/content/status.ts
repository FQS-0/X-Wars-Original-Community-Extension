import Browser from "webextension-polyfill"
import { DOMHelpers as D } from "~/src/lib/DOMHelpers.js"
import { replaceUTCWithLocal } from "~/src/lib/Date.js"

const serverTimeElement = D.asHTMLElement(
    window.document.querySelector("#servertime")
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

Browser.storage.local.set({ serverTimeDiff: serverTimeDiff })

replaceUTCWithLocal(serverTimeElement)

serverTimeElement.addEventListener("DOMCharacterDataModified", () => {
    serverTimeElement.innerHTML = new Date(
        new Date().getTime() + serverTimeDiff
    ).toLocaleTimeString()
})
