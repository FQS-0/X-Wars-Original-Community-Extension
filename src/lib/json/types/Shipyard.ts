import { Planet } from "./Planet.js"
import { Ship } from "./Ship.js"

export type Shipyard = {
    name: string
    planets: Planet[]
    ships: Ship[]
}
