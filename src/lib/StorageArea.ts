import Browser from "webextension-polyfill"
import * as validations from "./json/schemas/validations.js"
import { ensureType } from "./JsonValidation.js"
import { Shipyards } from "./json/types/Shipyards.js"

class ShipyardsStorage {
    static key = "shipyards"
    static handleOnChanged = async (
        callback: () => void,
        changes: Record<string, Browser.Storage.StorageChange>,
        areaName: string
    ) => {
        if (areaName !== "local") return
        if (Object.keys(changes).includes(this.key)) {
            callback()
        }
    }

    public static async get(): Promise<Shipyards> {
        const result = await Browser.storage.local.get(this.key)

        if (!result[this.key]) return []

        const shipyards = ensureType<Shipyards>(
            validations.Shipyards,
            JSON.parse(result[this.key])
        )

        return shipyards
    }

    public static async set(shipyards: Shipyards) {
        ensureType<Shipyards>(validations.Shipyards, shipyards)
        const value: Record<string, string> = {}
        value[this.key] = JSON.stringify(shipyards)
        return Browser.storage.local.set(value)
    }

    public static subscribe(callback: () => void) {
        Browser.storage.onChanged.addListener(
            this.handleOnChanged.bind(this, callback)
        )
    }

    public static unsubscribe(callback: () => void) {
        Browser.storage.onChanged.removeListener(
            this.handleOnChanged.bind(this, callback)
        )
    }
}

export class StorageArea {
    static get shipyards(): typeof ShipyardsStorage {
        return ShipyardsStorage
    }
}
