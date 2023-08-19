import { useEffect, useState } from "react"
import { IFavourite } from "../json/types/Favourite.js"
import { StorageArea } from "../StorageArea.js"

export const useFavourites = () => {
    const [list, setList] = useState<IFavourite[]>([])

    const updateFavouriteList = async () => {
        const favList = await StorageArea.favourites.tryGet([])
        setList(favList)
    }
    useEffect(() => {
        updateFavouriteList()

        const unsubscribe =
            StorageArea.favourites.subscribe(updateFavouriteList)

        return () => {
            unsubscribe()
        }
    }, [])

    return list
}

export const addFavourite = async (favourite: IFavourite) => {
    const favourites = await StorageArea.favourites.tryGet([])
    const idx = favourites.findIndex(
        (f) => f.coordinates === favourite.coordinates
    )
    if (idx > -1) {
        favourites[idx] = favourite
    } else {
        favourites.push(favourite)
    }

    await StorageArea.favourites.set(favourites)
}

export const removeFavourite = async (favourite: IFavourite) => {
    const favourites = await StorageArea.favourites.tryGet([])
    const idx = favourites.findIndex(
        (f) => f.coordinates === favourite.coordinates
    )
    if (idx > -1) favourites.splice(idx, 1)
    StorageArea.favourites.set(favourites)
}
