import { TPlanets } from "./Planets.js"

export interface IAllianceMember {
    name: string
    race: string
    fraction: string
    points: number
    id: number
    planets: TPlanets
}
