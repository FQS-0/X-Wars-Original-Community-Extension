import { Account } from "~/src/lib/Account.js"
import { Planet } from "~/src/lib/Planet.js"

async function main() {
    const resTable = window.document.querySelector('table[cellspacing="1"')
        ?.parentElement?.parentElement?.parentElement?.parentElement

    if (!resTable) throw "resources.ts: table not found"
    console.log(resTable)
    if (!(resTable instanceof HTMLTableElement))
        throw "resources.ts: table is no table"

    const resCell = resTable.insertRow(0).insertCell(0)
    resCell.colSpan = 8
    const table = window.document.createElement("table")
    table.width = "100%"
    table.cellSpacing = "1"
    table.cellPadding = "1"
    table.border = "0"
    const caption = table.insertRow(0).insertCell(0)
    caption.colSpan = 7
    caption.align = "center"
    caption.className = "second"
    caption.innerHTML = "<b>Resources per day</b>"

    const total = [0, 0, 0, 0, 0, 0]
    const formatter = new Intl.NumberFormat()

    const planets = await Account.getPlanets()
    for (const planet of planets) {
        const row = table.insertRow(-1)
        const firstCell = row.insertCell(0)
        firstCell.className = "first"
        firstCell.innerText = planet
        const resPerHour = (await Planet.getDepot(planet))?.perHour
        if (resPerHour) {
            for (const [index, resource] of Object.entries(resPerHour)) {
                const i = parseInt(index)
                const cell = row.insertCell(-1)
                cell.className = i % 2 ? "second" : "first"
                cell.align = "right"
                cell.innerText = formatter.format(resource * 24)
                total[i] += resource
            }
        } else {
            for (let i = 0; i < 6; i++) {
                const cell = row.insertCell(-1)
                cell.className = i % 2 ? "second" : "first"
                cell.align = "right"
                cell.innerText = "?"
            }
        }
    }
    const row = table.insertRow(-1)
    const firstCell = row.insertCell(0)
    firstCell.className = "first"
    firstCell.innerHTML = "<b>Total</b>"
    for (let i = 0; i < 6; i++) {
        const cell = row.insertCell(-1)
        cell.className = i % 2 ? "second" : "first"
        cell.className = "fourth"
        cell.align = "right"
        cell.innerHTML = `<b>${formatter.format(total[i])}</b>`
    }

    resCell.appendChild(table)
}

main()
