import Browser from "webextension-polyfill"
import { isStringArray } from "./DOMHelpers.js"

/**
 * This class is used to store and retrieve the player id, the current
 * planet and a list of all planets from the extension local storage.
 */
export class Account {
    public static async getId(): Promise<string> {
        const { currentId } = await Browser.storage.local.get("currentId")

        if (!currentId || typeof currentId !== "string")
            throw new Error("no id set")
        return currentId
    }

    public static async setId(id: string): Promise<void> {
        return Browser.storage.local.set({ currentId: id })
    }

    public static async getCurrentPlanet(): Promise<string> {
        const { currentPlanet } = await Browser.storage.local.get(
            "currentPlanet"
        )

        if (!currentPlanet || typeof currentPlanet !== "string")
            throw new Error("no current planet set")

        return currentPlanet
    }

    public static async setCurrentPlanet(currentPlanet: string): Promise<void> {
        return Browser.storage.local.set({ currentPlanet: currentPlanet })
    }

    public static async getPlanets(): Promise<string[]> {
        const key = `${await Account.getId()}#planets`
        const result = await Browser.storage.local.get(key)

        if (!result[key]) return []

        if (typeof result[key] !== "string") throw "Expected string"

        const planets = JSON.parse(result[key])

        return planets
    }

    public static async setPlanets(planets: string[]): Promise<void> {
        const value: Record<string, string> = {}
        value[`${await Account.getId()}#planets`] = JSON.stringify(planets)
        return Browser.storage.local.set(value)
    }

    public static async getResourceNames(): Promise<string[]> {
        const { resourceNames } = await Browser.storage.local.get(
            "resourceNames"
        )
        const names = JSON.parse(resourceNames)

        if (isStringArray(names)) return names

        throw new Error("resource names not set")
    }

    public static async setResourceNames(names: string[]): Promise<void> {
        return Browser.storage.local.set({
            resourceNames: JSON.stringify(names),
        })
    }
}
