import { isResources, setResources } from "~/src/lib/storage.js"
import Browser from "webextension-polyfill"

console.log("Loaded frame top.")

document.addEventListener("xwo_access_resources", function (e) {
    if (e instanceof CustomEvent) {
        const { amount, perSecond, max } = e.detail
        const resources = {
            date: new Date().toString(),
            amount: { ...amount },
            perSecond: { ...perSecond },
            max: { ...max },
        }
        if (isResources(resources)) setResources(resources)
    }
})

const s = document.createElement("script")
s.src = Browser.runtime.getURL("scripts/access/resources.js")
;(document.head || document.documentElement).appendChild(s)
s.onload = function () {
    s.remove()
}
