import { StorageArea } from "../StorageArea.js"
import { IShip } from "../json/types/Ship.js"
import { IShipyard } from "../json/types/Shipyard.js"

export async function scrapeProduction() {
    const forms = Array.from(window.document.querySelectorAll("form"))
    const ships: IShip[] = []
    forms.map((form) => {
        const row = form.nextElementSibling
        if (!(row instanceof HTMLTableRowElement)) {
            console.error("expected table row")
            return
        }
        if (row.cells.length !== 3) {
            console.error("wrong cell count")
            return
        }

        const name = row.cells[0].innerText.replace(/-[^-]+$/, "")

        const [, engine, speed] = row.cells[1].innerText.match(
            /(\S{3})\s*(\d+)\s*%/
        ) || [undefined, "UNK", "-1"]

        const [, att, def] = (
            row.cells[1].innerText.match(/(\d+)\s*\/\s*(\d+)/) || [
                "",
                "-1",
                "-1",
            ]
        ).map((m) => parseInt(m))

        const [, fe, kr, fr, or, fo, go] = (
            row.cells[1].innerText.match(
                /([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*$/
            ) || ["", "-1", "-1", "-1", "-1", "-1", "-1"]
        ).map((m) => {
            const r = parseInt(m)
            if (isNaN(r)) return 0
            return r
        })

        const [, freight] = (
            row.cells[1].innerText.match(/:\s([.\d]+)/) || ["0", "0"]
        ).map((m) => parseInt(m.replaceAll(".", "")))

        const components = Array.from(row.cells[1].querySelectorAll("a")).map(
            (anchor) =>
                (anchor.href.match(/component_id=(\d+)/) || ["0", "-1"]).map(
                    (m) => parseInt(m)
                )[1]
        )

        ships.push({
            shipClass: "unknown",
            requirements: [],
            carrier: -1,
            troups: -1,
            name: name,
            engine: engine,
            speed: parseInt(speed),
            att: att,
            def: def,
            cargo: freight,
            tt: components.includes(90),
            lkom: components.includes(93),
            resources: {
                fe: fe,
                kr: kr,
                fr: fr,
                or: or,
                fo: fo,
                go: go,
            },
        })
    })
    const name = await StorageArea.currentId.playerName.tryGet()
    const planets = (await StorageArea.currentId.planets.tryGet()).map(
        (planet) => {
            return { coordinates: planet }
        }
    )
    const shipyard: IShipyard = { name: name, planets: planets, ships: ships }

    StorageArea.shipyard.set(shipyard)
}
