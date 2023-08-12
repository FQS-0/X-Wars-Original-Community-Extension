import { Resources } from "./Resources.js"

export interface Depot {
    date: Date
    stock: Resources
    perHour: Resources
    max: Resources
}
