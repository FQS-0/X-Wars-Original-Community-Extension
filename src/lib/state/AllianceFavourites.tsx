import { useEffect, useState } from "react"
import { StorageArea } from "../StorageArea.js"
import { IAllianceFavourites } from "../json/types/AllianceFavourites.js"
import { ensureType } from "../JsonValidation.js"
import * as validations from "~src/lib/json/schemas/validations.js"

export const useAllianceFavouritesList = () => {
    const [allianceFavsList, setAllianceFavsList] = useState<
        IAllianceFavourites[]
    >([])

    const updateAllianceFavouritesList = async () => {
        const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
        setAllianceFavsList(allyFavsList)
    }

    useEffect(() => {
        fetchAllianceFavouritesUpdates()
        updateAllianceFavouritesList()

        const unsubscribe = StorageArea.allianceFavourites.subscribe(
            updateAllianceFavouritesList
        )
        return () => {
            unsubscribe()
        }
    }, [])

    return allianceFavsList
}

export const addAllianceFavourites = async (
    allianceFavs: IAllianceFavourites
) => {
    const favList = await StorageArea.allianceFavourites.tryGet([])
    const idx = favList.findIndex((fav) => fav.url == allianceFavs.url)

    if (idx > -1) {
        favList[idx] = allianceFavs
    } else {
        favList.push(allianceFavs)
    }
    await StorageArea.allianceFavourites.set(favList)
    return idx == -1
}

export const removeAllianceFavourites = async (
    allianceFavs: IAllianceFavourites
) => {
    const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
    const idx = allyFavsList.findIndex((afl) => afl.url == allianceFavs.url)
    if (idx > -1) allyFavsList.splice(idx, 1)
    StorageArea.allianceFavourites.set(allyFavsList)
}

export const fetchAllianceFavourites = async (url: URL) => {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
        console.error("HTTP status: ", response.status)
        throw new Error("Die angegebene URL konnte nicht abgerufen werden!")
    }

    const allianceFavs = ensureType<IAllianceFavourites>(
        validations.IAllianceFavourites,
        JSON.parse(await response.text())
    )
    allianceFavs.url = url.toString()
    allianceFavs.lastUpdate = new Date()
    return addAllianceFavourites(allianceFavs)
}

export const fetchAllianceFavouritesUpdates = async (force = false) => {
    const allianceFavs = await StorageArea.allianceFavourites.tryGet([])
    const today = new Date()
    allianceFavs.forEach((fav) => {
        if (fav.url && fav.lastUpdate) {
            const lastUpdate = new Date(fav.lastUpdate)
            if (
                force ||
                today.getTime() - lastUpdate.getTime() > 60 * 60 * 1000
            ) {
                console.log(`updating alliance favourites ${fav.url}`)
                fetchAllianceFavourites(new URL(fav.url))
            }
        }
    })
}
