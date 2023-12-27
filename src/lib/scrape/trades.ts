import { Resources } from "~src/lib/Resource.js"
import { StorageArea } from "~src/lib/StorageArea.js"
import { getDate } from "~src/lib/Date.js"

export async function scrapeTrades() {
    const currentPlanet = await StorageArea.currentId.currentPlanet.tryGet()
    const ownPlanets = await StorageArea.currentId.planets.tryGet()
    const resourceNames = await StorageArea.currentId.resourceNames.tryGet()

    const trades = (await StorageArea.currentId.trades.tryGet([])).filter(
        (trade) =>
            trade.toPlanet != currentPlanet && trade.fromPlanet != currentPlanet
    )

    Array.from(
        window.document.querySelectorAll(
            "tr[trade-id]"
        ) as NodeListOf<HTMLTableRowElement>
    ).forEach((row) => {
        const id = row.attributes.getNamedItem("trade-id")?.value
        if (!id) throw new Error("trade-id not found")

        if (row.cells.length != 7) throw new Error("unexpected count of cells")

        const date = getDate(row.cells[0].innerText, true)
        if (!date) throw new Error("could not parse date")

        const from = row.cells[1].innerText.trim()
        const to = row.cells[3].innerText.trim()
        const comment =
            row.nextElementSibling &&
            row.nextElementSibling instanceof HTMLTableRowElement &&
            row.nextElementSibling.cells.length == 2
                ? row.nextElementSibling.cells[1].innerText.trim()
                : ""

        const delivery = Resources.fromArray([0, 0, 0, 0, 0, 0])
        Array.from(
            row.cells[2].innerText.matchAll(
                /(?<resource>\S+):\s*(?<value>\d+)/g
            )
        ).forEach((m) => {
            if (!m.groups) throw new Error("no match groups found")
            const idx = resourceNames.indexOf(m.groups["resource"])
            if (idx == -1) throw new Error("could not translate resource name")
            const value = parseInt(m.groups["value"])
            delivery.set(idx, value)
        })

        const returnDelivery = Resources.fromArray([0, 0, 0, 0, 0, 0])
        Array.from(
            row.cells[4].innerText.matchAll(
                /(?<resource>\S+):\s*(?<value>\d+)/g
            )
        ).forEach((m) => {
            if (!m.groups) throw new Error("no match groups found")
            const idx = resourceNames.indexOf(m.groups["resource"])
            if (idx == -1) throw new Error("could not translate resource name")
            const value = parseInt(m.groups["value"])
            returnDelivery.set(idx, value)
        })

        const fromOwnPlanet = from == currentPlanet
        const toOwnPlanet = ownPlanets.indexOf(to) != -1

        const timeMatch = row.cells[6].innerText.match(
            /(?<hours>[0-9]|0[0-9]|1[0-9]|2[0-3]):(?<minutes>[0-5][0-9]):(?<seconds>[0-5][0-9])/
        )
        let concludedAt: Date | undefined
        if (timeMatch) {
            concludedAt = new Date()
            if (!timeMatch.groups) throw new Error("no match groups")
            const hours =
                concludedAt.getHours() +
                parseInt(
                    timeMatch.groups["hours"] ? timeMatch.groups["hours"] : "0"
                )
            const minutes =
                concludedAt.getMinutes() +
                parseInt(
                    timeMatch.groups["minutes"]
                        ? timeMatch.groups["minutes"]
                        : "0"
                )
            const seconds =
                concludedAt.getSeconds() +
                parseInt(
                    timeMatch.groups["seconds"]
                        ? timeMatch.groups["seconds"]
                        : "0"
                )

            concludedAt.setHours(hours, minutes, seconds)
        }
        trades.push({
            id: id,
            date: date,
            fromPlanet: from,
            toPlanet: to,
            delivery: delivery,
            returnDelivery: returnDelivery,
            comment: comment,
            isFromOwnPlanet: fromOwnPlanet,
            isToOwnPlanet: toOwnPlanet,
            concludedAt: concludedAt,
        })
    })

    StorageArea.currentId.trades.set(trades)
}
