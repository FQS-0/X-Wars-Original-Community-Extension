import Browser from "webextension-polyfill"
import { Account } from "./Account.js"

/**
 * This class is used to store and retrieve the player id, the current
 * planet and a list of all planets from the extension local storage.
 */
export class Bank {
    public static async getCapacity(
        planet?: string | undefined
    ): Promise<number | undefined> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankCapacity`

        const capacityJSON = (await Browser.storage.local.get(key))[key]

        if (!capacityJSON) return undefined

        const capacity = JSON.parse(capacityJSON)

        if (!capacity || typeof capacity !== "number") return undefined

        return capacity
    }

    public static async setCapacity(
        capacity: number,
        planet?: string | undefined
    ): Promise<void> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankCapacity`
        const r: Record<string, string> = {}
        r[key] = JSON.stringify(capacity)

        return Browser.storage.local.set(r)
    }

    public static async getAssets(
        planet?: string | undefined
    ): Promise<number[] | undefined> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankAssets`

        const assetsJSON = (await Browser.storage.local.get(key))[key]

        if (!assetsJSON) return undefined

        const assets = JSON.parse(assetsJSON)

        if (!assets || assets instanceof Array) return undefined

        return assets
    }

    public static async setAssets(
        assets: number[],
        planet?: string | undefined
    ): Promise<void> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankAssets`

        const r: Record<string, string> = {}
        r[key] = JSON.stringify(assets)

        return Browser.storage.local.set(r)
    }

    public static async getTotal(
        planet?: string | undefined
    ): Promise<number[] | undefined> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankTotal`

        const totalJSON = (await Browser.storage.local.get(key))[key]

        if (!totalJSON) return undefined

        const total = JSON.parse(totalJSON)

        if (!total || total instanceof Array) return undefined

        return total
    }

    public static async setTotal(
        total: number[],
        planet?: string | undefined
    ): Promise<void> {
        const currentId = await Account.getId()
        const currentPlanet = planet ? planet : await Account.getCurrentPlanet()
        if (!currentPlanet) throw "Error: current planet not set!"

        const key = `${currentId}#${currentPlanet}#bankTotal`

        const r: Record<string, string> = {}
        r[key] = JSON.stringify(total)

        return Browser.storage.local.set(r)
    }
}
