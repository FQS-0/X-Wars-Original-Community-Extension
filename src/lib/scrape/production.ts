import { StorageArea } from "../StorageArea.js"
import { IRequirement } from "../json/types/Requirement.js"
import { IShip } from "../json/types/Ship.js"
import { IShipyard } from "../json/types/Shipyard.js"
import { decode } from "he"

const usageRequirements = [
    { moduleId: 23, requirements: [{ specialisation: "Metall", value: 80 }] },
    { moduleId: 26, requirements: [{ specialisation: "Carbon", value: 20 }] },
    { moduleId: 27, requirements: [{ specialisation: "Carbon", value: 60 }] },
    { moduleId: 31, requirements: [{ specialisation: "Schild", value: 40 }] },
    { moduleId: 32, requirements: [{ specialisation: "Schild", value: 80 }] },
    { moduleId: 35, requirements: [{ specialisation: "Teleport", value: 5 }] },
    { moduleId: 36, requirements: [{ specialisation: "Teleport", value: 20 }] },
    { moduleId: 37, requirements: [{ specialisation: "Teleport", value: 40 }] },
    { moduleId: 43, requirements: [{ specialisation: "Strahlen", value: 40 }] },
    { moduleId: 51, requirements: [{ specialisation: "Plasma", value: 40 }] },
    {
        moduleId: 46,
        requirements: [{ specialisation: "Biologisch", value: 10 }],
    },
    {
        moduleId: 47,
        requirements: [{ specialisation: "Hochexplosiv", value: 30 }],
    },
    {
        moduleId: 48,
        requirements: [{ specialisation: "Biologisch", value: 40 }],
    },
    { moduleId: 49, requirements: [{ specialisation: "Strahlen", value: 80 }] },
    { moduleId: 52, requirements: [{ specialisation: "Plasma", value: 70 }] },
    { moduleId: 50, requirements: [{ specialisation: "Raketen", value: 80 }] },
    { moduleId: 74, requirements: [{ specialisation: "Raketen", value: 80 }] },
    { moduleId: 83, requirements: [{ specialisation: "Fracht", value: 20 }] },
    { moduleId: 84, requirements: [{ specialisation: "Fracht", value: 30 }] },
]

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

        const anchor = row.cells[0].querySelector("a")
        if (!anchor) {
            console.error("ship link not found!")
            return
        }
        const bi = new URLSearchParams(anchor.href).get("bi")
        if (!bi) {
            console.error("bi parameter not found")
            return
        }
        const biArray = atob(bi).split("|")
        const name = decode(biArray[0].slice(3))
        console.log(name)
        const componentsWithCount = biArray
            .slice(1, -1)
            .map((encodedComponent) => {
                const match = encodedComponent.match(/id(\d+)\$(\d+)/)
                if (!match) return { id: -1, count: -1 }
                return {
                    id: parseInt(match[1] || "-2"),
                    count: parseInt(match[2] || "-2"),
                }
            })
        const components = componentsWithCount.map((comp) => comp.id)
        const shipClass = components.includes(2)
            ? "Drohne"
            : components.includes(3)
            ? "Taktische Waffe"
            : components.includes(4)
            ? "Leicht"
            : components.includes(5)
            ? "Mittel"
            : components.includes(6)
            ? "Schwer"
            : "Unbekannt"

        const requirements: IRequirement[] = []
        components.forEach((component) => {
            const componentReq = usageRequirements.find(
                (req) => req.moduleId == component
            )
            if (!componentReq) return
            componentReq.requirements.forEach((requirment) => {
                const idx = requirements.findIndex(
                    (req) => req.specialisation == requirment.specialisation
                )
                if (idx < 0) requirements.push(requirment)
                else
                    requirements[idx].value = Math.max(
                        requirements[idx].value,
                        requirment.value
                    )
            })
        })
        const [, engine, speed] = row.cells[1].innerText.match(
            /(\S{3})\s*(\d+)\s*%/
        ) || [undefined, "UNK", "-1"]

        const [, att, def] = (
            row.cells[1].innerText.match(/(\d+)\s*\/\s*(\d+)/) || [
                "",
                "-1",
                "-1",
            ]
        ).map((m) => parseInt(m.replaceAll(".", "")))

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

        ships.push({
            shipClass: shipClass,
            requirements: [],
            carrier:
                (
                    componentsWithCount.find(
                        (component) => component.id == 85
                    ) || { id: 85, count: 0 }
                ).count * 30000,
            troups:
                (
                    componentsWithCount.find(
                        (component) => component.id == 85
                    ) || { id: 85, count: 0 }
                ).count * 50,
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
