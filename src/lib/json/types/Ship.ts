import { Requirement } from "./Requirement.js"
import { Resources } from "./Resources.js"

export type Ship = {
    att: number
    def: number
    engine: string
    speed: number
    lkom: boolean
    tt: boolean
    resources: Resources
    cargo: number
    carrier: number
    troups: number
    requirements: Requirement[]
    name: string
    shipClass: string
}
