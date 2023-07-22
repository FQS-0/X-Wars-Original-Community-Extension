import Browser from "webextension-polyfill"
import { serialize, deserialize } from "serializr"
import { Account } from "./Account.js"
import { Depot } from "./Resource.js"

/**
 * This class is used to store and retrieve resource stock, production
 * per hour and max capacity from the extension local storage
 */
export class Planet {
    public static async getDepot(
        planet: string | undefined = undefined
    ): Promise<Depot> {
        if (!planet) planet = await Account.getCurrentPlanet()
        if (!planet) throw new Error("current planet is not set")
        const key = `${await Account.getId()}#${planet}#depot`
        const result = await Browser.storage.local.get(key)

        console.log(result)
        if (result[key]) {
            const depot = deserialize(Depot, result[key])
            if (depot instanceof Depot) return depot
        }
        throw new Error("depot not set for planet" + planet)
    }

    public static async setDepot(
        depot: Depot,
        planet: string | undefined = undefined
    ): Promise<void> {
        if (!planet) planet = await Account.getCurrentPlanet()
        if (!planet) throw "currentPlanet not set"
        const key = `${await Account.getId()}#${planet}#depot`
        const value: Record<string, string> = {}
        value[key] = serialize(depot)
        return Browser.storage.local.set(value)
    }
}
