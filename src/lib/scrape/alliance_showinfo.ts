import { StorageArea } from "../StorageArea.js"
import { TPlanets } from "../json/types/Planets.js"

export async function scrapeAllianceShowInfo() {
    const id = parseInt(
        new URLSearchParams(window.location.search).get("uid") || "0"
    )
    if (!id) throw new Error("id not found")

    const coordinates = Array.from(
        window.document.body.innerText.matchAll(/\d+x\d+x\d+/g)
    )
    const planets: TPlanets = coordinates.map((coordinate) => coordinate[0])

    const list = await StorageArea.allianceMemberlist.tryGet([])
    const idx = list.findIndex((m) => (m.id = id))
    if (idx !== -1) list[idx].planets = planets

    StorageArea.allianceMemberlist.set(list)
}
