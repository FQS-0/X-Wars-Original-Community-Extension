import { DOMHelpers as D } from "~/src/lib/DOMHelpers.js"
import { replaceUTCWithLocal } from "~/src/lib/Date.js"

window.document.querySelectorAll('td[width="90px"]').forEach(function (node) {
    replaceUTCWithLocal(D.asHTMLElement(node))
})
