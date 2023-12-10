import { StorageArea } from "../StorageArea.js"
import { IAllianceMember } from "../json/types/AllianceMember.js"
import { TAllianceMemberList } from "../json/types/AllianceMemberList.js"

export async function scrapeAllianceMemberlist() {
    const oldList = await StorageArea.allianceMemberlist.tryGet([])
    const newList: TAllianceMemberList = []

    const memberTable =
        window.document.querySelector<HTMLTableElement>("form > table")

    if (!memberTable) throw new Error("member table not found")

    const rows = Array.from(memberTable.rows).slice(1, -2)

    rows.forEach((row) => {
        if (row.cells.length != 7) {
            console.error("name or info not found")
            return
        }

        const name = row.cells[0]
            .querySelector<HTMLAnchorElement>("a")
            ?.innerText.trim()
        const race = row.cells[2].innerText.trim()
        const fraction = row.cells[3].innerText.trim()
        const points = parseInt(row.cells[4].innerText.replace(".", ""))
        const [, id] = row.cells[6]
            .querySelector<HTMLAnchorElement>("a")
            ?.href.match(/uid=(\d+)/) || [null, null]

        if (!name || !race || !fraction || !points || !id) {
            console.error("could not extract data for " + name + " / " + id)
            return
        }
        const planets =
            oldList.find((member) => (member.id = parseInt(id)))?.planets || []
        const member: IAllianceMember = {
            name: name,
            race: race,
            fraction: fraction,
            points: points,
            id: parseInt(id),
            planets: planets,
        }
        newList.push(member)
    })

    StorageArea.allianceMemberlist.set(newList)
    console.log("old list: ", oldList)
    console.log("new list: ", newList)
}
