import { as } from "~/src/lib/DOMHelpers.js"
import { replaceUTCWithLocal } from "~/src/lib/Date.js"

const table = as(
    window.document.querySelector('table[cellspacing="1"][cellpadding="1"]'),
    HTMLTableElement
)

for (let i = 1; i < table.rows.length; i++) {
    const td = table.rows[i].cells[3]

    replaceUTCWithLocal(td)
}
