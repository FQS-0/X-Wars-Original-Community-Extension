import { StorageArea } from "../StorageArea.js"
import { IConstruction } from "../json/types/Construction.js"

export function scrapeConstruction() {
    const anchors = Array.from(window.document.querySelectorAll("a"))

    const construction: IConstruction = {
        hq: 0,
        bz: 0,
        fz: 0,
        sp: 0,
        fe: 0,
        kr: 0,
        fr: 0,
        or: 0,
        fo: 0,
        go: 0,
        fel: 0,
        krl: 0,
        frl: 0,
        orl: 0,
        fol: 0,
        gol: 0,
        kkw: 0,
        fkw: 0,
        rsf: 0,
        vst: 0,
        spa: 0,
        fwa: 0,
        ha: 0,
        ah: 0,
        hp: 0,
        hz: 0,
        ba: 0,
        ki: 0,
        gdz: 0,
        ws: 0,
    }

    anchors
        .filter((anchor) => anchor.href.startsWith("javascript:open_window"))
        .forEach((anchor) => {
            const mId = anchor.href.match(/building_id=(?<id>\d+)/)
            if (!mId || !mId.groups)
                throw new Error("could not find building id: " + anchor.href)
            const id = parseInt(mId.groups["id"])

            const mLevel =
                anchor.nextSibling?.textContent?.match(/(?<level>\d+)/)
            if (!mLevel || !mLevel.groups) {
                console.error(
                    "could not find building level: " +
                        anchor.nextSibling?.textContent
                )
                return
            }
            const level = parseInt(mLevel.groups["level"])

            switch (id) {
                case 1:
                    construction.hq = level
                    break
                case 2:
                    construction.bz = level
                    break
                case 3:
                    construction.fz = level
                    break
                case 4:
                    construction.sp = level
                    break
                case 5:
                    construction.fe = level
                    break
                case 6:
                    construction.kr = level
                    break
                case 7:
                    construction.fr = level
                    break
                case 8:
                    construction.or = level
                    break
                case 9:
                    construction.fo = level
                    break
                case 10:
                    construction.go = level
                    break
                case 11:
                    construction.fel = level
                    break
                case 12:
                    construction.krl = level
                    break
                case 13:
                    construction.frl = level
                    break
                case 14:
                    construction.orl = level
                    break
                case 15:
                    construction.fol = level
                    break
                case 16:
                    construction.gol = level
                    break
                case 17:
                    construction.kkw = level
                    break
                case 18:
                    construction.fkw = level
                    break
                case 19:
                    construction.rsf = level
                    break
                case 20:
                    construction.hz = level
                    break
                case 21:
                    construction.ki = level
                    break
                case 22:
                    construction.spa = level
                    break
                case 23:
                    construction.fwa = level
                    break
                case 24:
                    construction.vst = level
                    break
                case 25:
                    construction.ha = level
                    break
                case 26:
                    construction.ah = level
                    break
                case 30:
                    construction.hp = level
                    break
                case 31:
                    construction.ba = level
                    break
            }
        })

    StorageArea.currentId.currentPlanet.construction.set(construction)
}
