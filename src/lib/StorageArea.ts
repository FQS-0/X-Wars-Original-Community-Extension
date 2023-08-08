import Browser from "webextension-polyfill"
import * as validations from "./json/schemas/validations.js"
import { ensureType } from "./JsonValidation.js"
import { Shipyards } from "./json/types/Shipyards.js"
import { Favourites } from "./json/types/Favourites.js"

class JsonStorage<T> {
    private callback: (() => void) | null = null

    private handleOnChanged = async (
        changes: Record<string, Browser.Storage.StorageChange>,
        areaName: string
    ) => {
        if (areaName !== "local") return
        if (Object.keys(changes).includes(this.key)) {
            if (this.callback !== null) this.callback()
        }
    }

    constructor(
        private key: string,
        private validateFunc: (
            data: unknown,
            instanceData?:
                | {
                      instancePath?: string
                      parentData: unknown
                      parentDataProperty: unknown
                      rootData?: unknown
                  }
                | undefined
        ) => boolean
    ) {}

    public subscribe(callback: () => void) {
        this.callback = callback
        Browser.storage.onChanged.addListener(this.handleOnChanged)
    }

    public unsubscribe() {
        Browser.storage.onChanged.removeListener(this.handleOnChanged)
    }

    public async get(): Promise<T | null> {
        const result = await Browser.storage.local.get(this.key)

        if (!result[this.key]) return null

        const val = ensureType<T>(
            this.validateFunc,
            JSON.parse(result[this.key])
        )

        return val
    }

    public async set(val: T) {
        ensureType<T>(this.validateFunc, val)
        const value: Record<string, string> = {}
        value[this.key] = JSON.stringify(val)
        return Browser.storage.local.set(value)
    }
}

export class StorageArea {
    static get shipyards(): JsonStorage<Shipyards> {
        return new JsonStorage<Shipyards>("shipyards", validations.Shipyards)
    }

    static get favourites(): JsonStorage<Favourites> {
        return new JsonStorage<Favourites>("favourites", validations.Favourites)
    }
}
