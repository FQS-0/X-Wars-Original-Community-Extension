import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { StorageArea } from "../StorageArea.js"
import { TFavourites } from "../json/types/Favourites.js"
import { IFavourite } from "../json/types/Favourite.js"

const FavouriteFavouritesContext = createContext<TFavourites>([])

export const FavouriteFavouritesProvider = ({
    children,
}: PropsWithChildren) => {
    const [favourites, setFavourites] = useState<TFavourites>([])

    useFavouriteFavouritesFromStorage(setFavourites)

    return (
        <FavouriteFavouritesContext.Provider value={favourites}>
            {children}
        </FavouriteFavouritesContext.Provider>
    )
}

export const useFavouriteFavourites = () => {
    return useContext(FavouriteFavouritesContext)
}

const useFavouriteFavouritesFromStorage = (
    setFavourites: Dispatch<SetStateAction<TFavourites>>
) => {
    const updateFavourites = async () => {
        setFavourites(await StorageArea.favouriteFavourites.tryGet([]))
    }
    useEffect(() => {
        updateFavourites()
        const unsubscribe =
            StorageArea.favouriteFavourites.subscribe(updateFavourites)
        return () => {
            unsubscribe()
        }
    }, [])
}

export const addFavouriteFavourite = async (fav: IFavourite) => {
    const favs = await StorageArea.favouriteFavourites.tryGet([])
    const idx = favs.findIndex((f) => f.coordinates == fav.coordinates)
    if (idx == -1) {
        favs.push(fav)
        await StorageArea.favouriteFavourites.set(favs)
    }
}

export const removeFavouriteFavourite = async (fav: IFavourite) => {
    const favs = await StorageArea.favouriteFavourites.tryGet([])
    const idx = favs.findIndex((f) => f.coordinates == fav.coordinates)
    if (idx > -1) {
        favs.splice(idx, 1)
        await StorageArea.favouriteFavourites.set(favs)
    }
}
