import { isResources, setResources } from "../../lib/storage.js"
import Browser from "webextension-polyfill"

console.log("Loaded frame top.")

const s = document.createElement("script")
s.src = Browser.runtime.getURL("scripts/access/resources.js")
;(document.head || document.documentElement).appendChild(s)
s.onload = function () {
    s.remove()
}

document.addEventListener("xwo_access_resources", function (e) {
    if (e instanceof CustomEvent) {
        const { amount, perSecond, max } = e.detail
        const resources = {
            date: new Date(),
            amount: { ...amount },
            perSecond: { ...perSecond },
            max: { ...max },
        }
        if (isResources(resources)) setResources(resources)
    }
})
