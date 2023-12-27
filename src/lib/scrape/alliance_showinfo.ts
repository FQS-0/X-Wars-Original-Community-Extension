import { StorageArea } from "../StorageArea.js"
import { TPlanets } from "../json/types/Planets.js"

export async function scrapeAllianceShowInfo() {
    const id = parseInt(
        new URLSearchParams(window.location.search).get("uid") || "-1"
    )
    if (id === -1) throw new Error("id not found")

    const coordinates = Array.from(
        window.document.body.innerText.matchAll(/\d+x\d+x\d+/g)
    )
    const planets: TPlanets = coordinates.map((coordinate) => coordinate[0])

    const list = await StorageArea.allianceMemberlist.tryGet([])
    const member = list.find((m) => m.id == id)
    if (member) member.planets = planets

    StorageArea.allianceMemberlist.set(list)
}
