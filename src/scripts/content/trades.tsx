import { createRoot } from "react-dom/client"
import { as } from "~/src/lib/DOMHelpers.js"
import { Depot, Resources } from "~src/lib/Resource.js"
import { Trade } from "~src/lib/Trade.js"
import { StorageArea } from "~src/lib/StorageArea.js"
;(async () => {
    const currentPlanet = await StorageArea.currentId.currentPlanet.tryGet()
    const ownPlanets = await StorageArea.currentId.planets.tryGet()
    const resourceNames = await StorageArea.currentId.resourceNames.tryGet()
    const depot = Depot.fromObject(
        await StorageArea.currentId.currentPlanet.depot.tryGet()
    )

    const trades = Array.from(window.document.querySelectorAll("tr[trade-id"))
        .map((row) => as(row, HTMLTableRowElement))
        .map((row) => {
            const id = row.attributes.getNamedItem("trade-id")?.value
            if (!id) throw new Error("trade-id not found")
            if (row.cells.length != 6)
                throw new Error("unexpected count of cells")

            const from = row.cells[0].innerText.trim()
            const to = row.cells[2].innerText.trim()
            const comment =
                row.nextElementSibling &&
                row.nextElementSibling instanceof HTMLTableRowElement &&
                row.nextElementSibling.cells.length == 2
                    ? row.nextElementSibling.cells[1].innerText.trim()
                    : ""

            const delivery = Resources.fromArray([0, 0, 0, 0, 0, 0])
            Array.from(
                row.cells[1].innerText.matchAll(
                    /(?<resource>\S+):\s*(?<value>\d+)/g
                )
            ).forEach((m) => {
                if (!m.groups) throw new Error("no match groups found")
                const idx = resourceNames.indexOf(m.groups["resource"])
                if (idx == -1)
                    throw new Error("could not translate resource name")
                const value = parseInt(m.groups["value"])
                delivery.set(idx, value)
            })

            const returnDelivery = Resources.fromArray([0, 0, 0, 0, 0, 0])
            Array.from(
                row.cells[3].innerText.matchAll(
                    /(?<resource>\S+):\s*(?<value>\d+)/g
                )
            ).forEach((m) => {
                if (!m.groups) throw new Error("no match groups found")
                const idx = resourceNames.indexOf(m.groups["resource"])
                if (idx == -1)
                    throw new Error("could not translate resource name")
                const value = parseInt(m.groups["value"])
                returnDelivery.set(idx, value)
            })

            const fromOwnPlanet = from == currentPlanet
            const toOwnPlanet = ownPlanets.indexOf(to) != -1

            const timeMatch = row.cells[5].innerText.match(
                /(?<hours>[0-9]|0[0-9]|1[0-9]|2[0-3]):(?<minutes>[0-5][0-9]):(?<seconds>[0-5][0-9])/
            )
            let concludedAt: Date | undefined
            if (timeMatch) {
                concludedAt = new Date()
                if (!timeMatch.groups) throw new Error("no match groups")
                const hours =
                    concludedAt.getHours() +
                    parseInt(
                        timeMatch.groups["hours"]
                            ? timeMatch.groups["hours"]
                            : "0"
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

            return new Trade(
                id,
                from,
                to,
                delivery,
                returnDelivery,
                comment,
                fromOwnPlanet,
                toOwnPlanet,
                concludedAt
            )
        })

    trades.sort((a, b) => {
        if (a.isRunning && !b.isRunning) return 1
        if (!a.isRunning && b.isRunning) return -1
        if (a.isRunning && b.isRunning)
            return (
                (a.concludedAt?.getTime() ?? 0) -
                (b.concludedAt?.getTime() ?? 0)
            )
        if (!a.date && !b.date) return 0
        if (!a.date) return -1
        if (!b.date) return 1
        return a.date.getTime() - b.date.getTime()
    })

    const runningTrades = trades.filter((trade) => trade.isRunning)
    let resourcesInTransfer = new Resources(0, 0, 0, 0, 0, 0)
    runningTrades.forEach((trade) => {
        if (currentPlanet == trade.fromPlanet)
            resourcesInTransfer = resourcesInTransfer.add(trade.returnDelivery)
        if (currentPlanet == trade.toPlanet)
            resourcesInTransfer = resourcesInTransfer.add(trade.delivery)
    })

    const id = new URLSearchParams(
        as(window.document.querySelector("a"), HTMLAnchorElement).search
    ).get("id")
    if (!id) throw new Error("id not found")

    const tradeTable = as(
        window.document.querySelector(
            'table[cellspacing="1"][cellpadding="1"]'
        ),
        HTMLTableElement
    )

    const root = createRoot(tradeTable)
    // const rootTable = window.document.querySelector("#tradeTable")

    // const root = createRoot(
    //     rootTable
    //         ? rootTable
    //         : (() => {
    //               const newTable = window.document.createElement("table")
    //               newTable.cellPadding = "1"
    //               newTable.cellSpacing = "1"
    //               newTable.border = "0"
    //               //newTable.width = "400px"
    //               newTable.id = "tradeTable"
    //               tradeTable.parentElement?.insertBefore(newTable, null)
    //               return newTable
    //           })()
    // )

    function renderTable() {
        const fmtr = new Intl.NumberFormat()
        const now = new Date()

        const rows = []
        const resources = depot.getCurrentResources().add(resourcesInTransfer)

        function fmtTimeSpan(ms: number) {
            return `${("00" + Math.floor(ms / 1000 / 60 / 60)).slice(-2)}:${(
                "00" + Math.floor((ms / 1000 / 60) % 60)
            ).slice(-2)}:${("00" + Math.floor((ms / 1000) % 60)).slice(-2)}`
        }
        rows.push(
            <tr key="header">
                <td colSpan={9} className="first" align="center">
                    <b>Transaktionen für Planet {currentPlanet}</b>
                </td>
            </tr>
        )

        trades.map((trade) => {
            rows.push(
                <tr key={trade.id + "#spacer"}>
                    <td colSpan={9} height={4}></td>
                </tr>
            )
            rows.push(
                <tr key={trade.id + "#from"}>
                    <td className="first">From</td>
                    <td
                        className="second"
                        style={
                            ownPlanets.indexOf(trade.fromPlanet) != -1
                                ? { backgroundColor: "green" }
                                : {}
                        }
                    >
                        {trade.fromPlanet == currentPlanet ? (
                            <b>{trade.fromPlanet}</b>
                        ) : (
                            trade.fromPlanet
                        )}
                    </td>
                    <td
                        className={
                            resources.get(0) + trade.delivery.get(0) >
                                depot.max.get(0) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(0))}
                    </td>
                    <td
                        className={
                            resources.get(1) + trade.delivery.get(1) >
                                depot.max.get(1) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(1))}
                    </td>
                    <td
                        className={
                            resources.get(2) + trade.delivery.get(2) >
                                depot.max.get(2) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(2))}
                    </td>
                    <td
                        className={
                            resources.get(3) + trade.delivery.get(3) >
                                depot.max.get(3) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(3))}
                    </td>
                    <td
                        className={
                            resources.get(4) + trade.delivery.get(4) >
                                depot.max.get(4) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(4))}
                    </td>
                    <td
                        className={
                            resources.get(5) + trade.delivery.get(5) >
                                depot.max.get(5) && !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                        width={45}
                    >
                        {fmtr.format(trade.delivery.get(5))}
                    </td>
                    <td
                        className="second"
                        align="left"
                        valign="top"
                        rowSpan={3}
                        width={75}
                    >
                        {trade.comment}
                    </td>
                </tr>
            )
            rows.push(
                <tr key={trade.id + "#to"}>
                    <td className="first">To</td>
                    <td
                        className="second"
                        style={
                            ownPlanets.indexOf(trade.toPlanet) != -1
                                ? { backgroundColor: "green" }
                                : {}
                        }
                    >
                        {trade.toPlanet == currentPlanet ? (
                            <b>{trade.toPlanet}</b>
                        ) : (
                            trade.toPlanet
                        )}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(0) + trade.returnDelivery.get(0) >
                                depot.max.get(0) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(0))}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(1) + trade.returnDelivery.get(1) >
                                depot.max.get(1) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(1))}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(2) + trade.returnDelivery.get(2) >
                                depot.max.get(2) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(2))}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(3) + trade.returnDelivery.get(3) >
                                depot.max.get(3) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(3))}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(4) + trade.returnDelivery.get(4) >
                                depot.max.get(4) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(4))}
                    </td>
                    <td
                        className={
                            currentPlanet == trade.fromPlanet &&
                            resources.get(5) + trade.returnDelivery.get(5) >
                                depot.max.get(5) &&
                            !trade.isRunning
                                ? "red_second"
                                : "second"
                        }
                        align="right"
                    >
                        {fmtr.format(trade.returnDelivery.get(5))}
                    </td>
                </tr>
            )
            rows.push(
                <tr key={trade.id + "#action"}>
                    <td colSpan={2} className="second" align="center">
                        {trade.isRunning && trade.concludedAt
                            ? trade.concludedAt.getTime() - now.getTime() <= 0
                                ? "Abgeschlossen"
                                : fmtTimeSpan(
                                      trade.concludedAt.getTime() -
                                          now.getTime()
                                  )
                            : trade.date?.toLocaleTimeString()}
                    </td>
                    <td colSpan={3} className="first" align="center">
                        {trade.isRunning ? (
                            "Transfer läuft"
                        ) : ownPlanets.indexOf(trade.toPlanet) != -1 ? (
                            <button
                                onClick={() =>
                                    (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=accept&tid=${trade.id}`)
                                }
                            >
                                Annehmen
                            </button>
                        ) : (
                            ""
                        )}
                    </td>
                    <td colSpan={3} className="first" align="center">
                        {trade.isRunning ? (
                            ""
                        ) : currentPlanet == trade.fromPlanet ? (
                            <button
                                onClick={() =>
                                    (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=cancel&tid=${trade.id}`)
                                }
                            >
                                Abbrechen
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=cancel&tid=${trade.id}`)
                                }
                            >
                                Ablehnen
                            </button>
                        )}
                    </td>
                </tr>
            )
        })

        const tradeTableBody = <tbody>{rows}</tbody>

        root.render(tradeTableBody)
    }

    renderTable()
    window.setInterval(renderTable, 1000)
})()
