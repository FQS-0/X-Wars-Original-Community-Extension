import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { TFavouriteShips } from "../json/types/FavouriteShips.js"
import { StorageArea } from "../StorageArea.js"
import { IFavouriteShip } from "../json/types/FavouriteShip.js"

const FavouriteShipsContext = createContext<TFavouriteShips>([])

export const FavouriteShipsProvider = ({ children }: PropsWithChildren) => {
    const [favouriteShips, setFavouriteShips] = useState<TFavouriteShips>([])

    useFavouriteShipsFromStorage(setFavouriteShips)

    return (
        <FavouriteShipsContext.Provider value={favouriteShips}>
            {children}
        </FavouriteShipsContext.Provider>
    )
}

export const useFavouriteShips = () => {
    return useContext(FavouriteShipsContext)
}

const useFavouriteShipsFromStorage = (
    setFavouriteShips: Dispatch<SetStateAction<TFavouriteShips>>
) => {
    const updateFavouriteShips = async () => {
        setFavouriteShips(await StorageArea.favouriteShips.tryGet([]))
    }
    useEffect(() => {
        updateFavouriteShips()
        const unsubscribe =
            StorageArea.favouriteShips.subscribe(updateFavouriteShips)
        return () => {
            unsubscribe()
        }
    }, [])
}

export const addFavouriteShip = async (ship: IFavouriteShip) => {
    const ships = await StorageArea.favouriteShips.tryGet([])
    const idx = ships.findIndex(
        (s) =>
            s.shipyardName == ship.shipyardName && s.shipName == ship.shipName
    )
    if (idx == -1) {
        ships.push(ship)
        await StorageArea.favouriteShips.set(ships)
    }
}

export const removeFavouriteShip = async (ship: IFavouriteShip) => {
    const ships = await StorageArea.favouriteShips.tryGet([])
    const idx = ships.findIndex(
        (s) =>
            s.shipyardName == ship.shipyardName && s.shipName == ship.shipName
    )
    if (idx > -1) {
        ships.splice(idx, 1)
        await StorageArea.favouriteShips.set(ships)
    }
}
