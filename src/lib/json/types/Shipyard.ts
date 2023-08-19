import { IPlanet } from "./Planet.js"
import { IShip } from "./Ship.js"

export interface IShipyard {
    name: string
    planets: IPlanet[]
    ships: IShip[]
    url?: string
    lastUpdate?: Date
}
