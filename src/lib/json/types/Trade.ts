import { IResources } from "./Resources.js"

export interface ITrade {
    id: string
    isFromOwnPlanet: boolean
    isToOwnPlanet: boolean
    delivery: IResources
    returnDelivery: IResources
    date: Date
    comment: string
    fromPlanet: string
    toPlanet: string
    concludedAt: Date | undefined
}
