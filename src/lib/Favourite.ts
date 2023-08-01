import { serializable } from "serializr"
import { v4 as uuidv4 } from "uuid"
import { Account } from "./Account.js"
import Browser from "webextension-polyfill"
import { serialize, deserialize } from "serializr"
import { immerable } from "immer"

export enum FavouriteType {
    FRIEND = "FRIEND",
    FOE = "FOE",
    NONE = "NONE",
}

export class Favourite {
    [immerable] = true
    @serializable uuid: string
    @serializable name: string
    @serializable coordinates: string
    @serializable type: FavouriteType

    constructor(
        name: string,
        coordinates: string,
        type: FavouriteType,
        uuid?: string
    ) {
        this.uuid = uuid ? uuid : uuidv4()
        this.name = name
        this.coordinates = coordinates
        this.type = type
    }

    static async setList(favourites: Favourite[]): Promise<void> {
        const key = `${await Account.getId()}#favourites`
        const value: Record<string, string> = {}
        value[key] = serialize(Favourite, favourites)
        return Browser.storage.local.set(value)
    }

    static async getList(): Promise<Favourite[]> {
        const key = `${await Account.getId()}#favourites`
        const result = await Browser.storage.local.get(key)
        if (!result[key]) return []

        const planets = deserialize(Favourite, result[key])

        return planets
    }
}
