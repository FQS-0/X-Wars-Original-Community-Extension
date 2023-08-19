import { useEffect, useState } from "react"
import { StorageArea } from "../StorageArea.js"
import { IAllianceFavourites } from "../json/types/AllianceFavourites.js"

export const useAllianceFavouritesList = () => {
    const [allianceFavsList, setAllianceFavsList] = useState<
        IAllianceFavourites[]
    >([])

    const updateAllianceFavouritesList = async () => {
        const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
        setAllianceFavsList(allyFavsList)
    }

    useEffect(() => {
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
    return idx
}
export const removeAllianceFavourites = async (
    allianceFavs: IAllianceFavourites
) => {
    const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
    const idx = allyFavsList.findIndex((afl) => afl.url == allianceFavs.url)
    if (idx > -1) allyFavsList.splice(idx, 1)
    StorageArea.allianceFavourites.set(allyFavsList)
}
