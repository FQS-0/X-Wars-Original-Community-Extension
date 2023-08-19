import { IFavourite } from "./Favourite.js"

export interface IAllianceFavourites {
    url?: string
    lastUpdate?: Date
    favourites: IFavourite[]
}
