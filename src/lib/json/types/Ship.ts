import { IRequirement } from "./Requirement.js"
import { IResources } from "./Resources.js"

export interface IShip {
    att: number
    def: number
    engine: string
    speed: number
    lkom: boolean
    tt: boolean
    resources: IResources
    cargo: number
    carrier: number
    troups: number
    requirements: IRequirement[]
    name: string
    shipClass: string
}
