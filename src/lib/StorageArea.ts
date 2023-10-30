import Browser from "webextension-polyfill"
import * as validations from "./json/schemas/validations.js"
import { ensureType } from "./JsonValidation.js"
import { TShipyards } from "./json/types/Shipyards.js"
import { TFavourites } from "./json/types/Favourites.js"
import { TPlanets } from "./json/types/Planets.js"
import { TResourceNames } from "./json/types/ResourceNames.js"
import { IResources } from "./json/types/Resources.js"
import { TAllianceFavouritesList } from "./json/types/AllianceFavouritesList.js"
import { TFavouriteShips } from "./json/types/FavouriteShips.js"
import { TTrades } from "./json/types/Trades.js"
import { TSubMenuList } from "./json/types/SubMenuList.js"
import { IDepot } from "./json/types/Depot.js"

interface ChildStorage {
    needsResolving: boolean
    getKey(): Promise<string>
    getCompleteKey(): Promise<string>
}

interface Storage<T> {
    get(): Promise<T | null>
    tryGet(def?: T): Promise<T>
    set(val: T): Promise<void>
}

class StorageBase implements ChildStorage {
    private handleOnChanged = async (
        callback: () => void,
        changes: Record<string, Browser.Storage.StorageChange>,
        areaName: string
    ) => {
        if (areaName !== "local") return
        const key = await this.getKey()
        if (Object.keys(changes).includes(key)) {
            callback()
        }
    }

    constructor(
        private key: string,
        private parent?: ChildStorage,
        public needsResolving = false
    ) {}

    public async getCompleteKey(): Promise<string> {
        const instanceKey =
            this instanceof SimpleStorage && this.needsResolving
                ? await (this as SimpleStorage<string>).get()
                : this.key
        if (!instanceKey) throw new Error("key value not found")

        const key = this.parent
            ? `${await this.parent.getCompleteKey()}#${instanceKey}`
            : instanceKey

        return key
    }

    public async getKey(): Promise<string> {
        const key = this.parent
            ? `${await this.parent.getCompleteKey()}#${this.key}`
            : this.key

        return key
    }

    public subscribe(callback: () => void) {
        const cb = this.handleOnChanged.bind(null, callback)
        Browser.storage.onChanged.addListener(cb)
        return () => {
            Browser.storage.onChanged.removeListener(cb)
        }
    }
}

class JsonStorage<T> extends StorageBase implements Storage<T> {
    constructor(
        key: string,
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
        ) => boolean,
        parent?: ChildStorage,
        private reviverFunc?: (obj: T) => T
    ) {
        super(key, parent)
    }

    public async get(): Promise<T | null> {
        const key = await this.getKey()
        try {
            const result = await Browser.storage.local.get(key)

            if (!result[key]) return null

            const val = ensureType<T>(
                this.validateFunc,
                JSON.parse(result[key])
            )

            return this.reviverFunc ? this.reviverFunc(val) : val
        } catch (e) {
            if (e instanceof TypeError) {
                const value: Record<string, string> = {}
                value[key] = ""
                Browser.storage.local.set(value)
            }
            throw e
        }
    }

    public async tryGet(def?: T): Promise<T> {
        const val = await this.get()
        if (val !== null) return val
        if (def) return def
        throw new Error(
            "get returned null and default was not set - key=" +
                (await this.getKey())
        )
    }

    public async set(val: T) {
        ensureType<T>(this.validateFunc, val)
        const value: Record<string, string> = {}
        const key = await this.getKey()
        value[key] = JSON.stringify(val)
        return Browser.storage.local.set(value)
    }
}

class SimpleStorage<T> extends StorageBase implements Storage<T> {
    public async get(): Promise<T | null> {
        const key = await this.getKey()
        const result = await Browser.storage.local.get(key)
        if (!result[key]) return null
        return result[key]
    }

    public async tryGet(def?: T): Promise<T> {
        const val = await this.get()
        if (val !== null) return val
        if (def !== undefined) return def
        throw new Error(
            "get returned null and default was not set - key=" +
                (await this.getKey())
        )
    }

    public async set(val: T) {
        const key = await this.getKey()
        const value: Record<string, T> = {}
        value[key] = val

        return Browser.storage.local.set(value)
    }
}

class CurrentIdStorage<T> extends SimpleStorage<T> {
    public get currentPlanet(): PlanetStorage<string> {
        return new PlanetStorage<string>("currentPlanet", this, true)
    }
    public get planets(): JsonStorage<TPlanets> {
        return new JsonStorage<TPlanets>("planets", validations.TPlanets, this)
    }
    public get resourceNames(): JsonStorage<TResourceNames> {
        return new JsonStorage<TResourceNames>(
            "resourceNames",
            validations.TResourceNames,
            this
        )
    }
    public planet(coordinates: string): PlanetStorage<string> {
        return new PlanetStorage<string>(coordinates, this)
    }
    public get trades(): JsonStorage<TTrades> {
        return new JsonStorage<TTrades>("trades", validations.TTrades, this)
    }
    public get subMenuList(): JsonStorage<TSubMenuList> {
        return new JsonStorage<TSubMenuList>(
            "subMenuList",
            validations.TSubMenuList,
            this
        )
    }
}

class PlanetStorage<T> extends SimpleStorage<T> {
    public get depot(): JsonStorage<IDepot> {
        return new JsonStorage<IDepot>("depot", validations.IDepot, this)
    }
    public get bankCapacity(): SimpleStorage<number> {
        return new SimpleStorage<number>("bankCapacity", this)
    }
    public get bankAssets(): JsonStorage<IResources> {
        return new JsonStorage<IResources>(
            "bankAssets",
            validations.IResources,
            this
        )
    }
    public get bankTotal(): JsonStorage<IResources> {
        return new JsonStorage<IResources>(
            "bankTotal",
            validations.IResources,
            this
        )
    }
}

export class StorageArea {
    static get shipyards(): JsonStorage<TShipyards> {
        return new JsonStorage<TShipyards>("shipyards", validations.TShipyards)
    }

    static get favourites(): JsonStorage<TFavourites> {
        return new JsonStorage<TFavourites>(
            "favourites",
            validations.TFavourites
        )
    }

    static get allianceFavourites(): JsonStorage<TAllianceFavouritesList> {
        return new JsonStorage<TAllianceFavouritesList>(
            "allianceFavourites",
            validations.TAllianceFavouritesList
        )
    }

    static get favouriteFavourites(): JsonStorage<TFavourites> {
        return new JsonStorage<TFavourites>(
            "favouriteFavourites",
            validations.TFavourites
        )
    }

    static get favouriteShips(): JsonStorage<TFavouriteShips> {
        return new JsonStorage<TFavouriteShips>(
            "favouriteShips",
            validations.TFavouriteShips
        )
    }

    static get currentId(): CurrentIdStorage<string> {
        return new CurrentIdStorage<string>("currentId", undefined, true)
    }

    static get servertimeOffset(): SimpleStorage<number> {
        return new SimpleStorage<number>("servertimeOffset")
    }

    static get sessionId(): SimpleStorage<string> {
        return new SimpleStorage<string>("sessionId")
    }
}
