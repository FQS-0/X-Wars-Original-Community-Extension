import Browser from "webextension-polyfill"
import { Account } from "./Account.js"

export interface Resources {
    0: number
    1: number
    2: number
    3: number
    4: number
    5: number
}
export interface Depot {
    date: Date
    stock: Resources
    perHour: Resources
    max: Resources
}

export function isResources(r: object): r is Resources {
    return (
        "0" in r &&
        typeof r[0] === "number" &&
        "1" in r &&
        typeof r[1] === "number" &&
        "2" in r &&
        typeof r[2] === "number" &&
        "3" in r &&
        typeof r[3] === "number" &&
        "4" in r &&
        typeof r[4] === "number" &&
        "5" in r &&
        typeof r[5] === "number"
    )
}

export function isDepot(r: object): r is Depot {
    return (
        "date" in r &&
        r.date !== null &&
        r.date instanceof Date &&
        "stock" in r &&
        typeof r.stock === "object" &&
        r.stock !== null &&
        isResources(r.stock) &&
        "perHour" in r &&
        typeof r.perHour === "object" &&
        r.perHour !== null &&
        isResources(r.perHour) &&
        "max" in r &&
        typeof r.max === "object" &&
        r.max !== null &&
        isResources(r.max)
    )
}

/**
 * This class is used to store and retrieve resource stock, production
 * per hour and max capacity from the extension local storage
 */
export class Planet {
    public static async getDepot(
        planet: string | undefined = undefined
    ): Promise<Depot | undefined> {
        if (!planet) planet = await Account.getCurrentPlanet()
        if (!planet) throw "currentPlanet not set"
        const key = `${Account.getId()}#${planet}#depot`
        const result = await Browser.storage.local.get(key)
        if (result[key] && typeof result[key] === "string") {
            const depot = JSON.parse(result[key])
            if (depot.date) depot.date = new Date(depot.date)
            if (isDepot(depot)) return depot
        }
        return undefined
    }

    public static async setDepot(
        depot: Depot,
        planet: string | undefined = undefined
    ): Promise<void> {
        if (!planet) planet = await Account.getCurrentPlanet()
        if (!planet) throw "currentPlanet not set"
        const key = `${Account.getId()}#${planet}#depot`
        const value: Record<string, string> = {}
        value[key] = JSON.stringify(depot)
        return Browser.storage.local.set(value)
    }
}
