import { IResources } from "./Resources.js"

export interface IDepot {
    date: Date
    stock: IResources
    perHour: IResources
    max: IResources
}
