import * as validations from "./json/schemas/validations.js"
import { Shipyard as SY } from "./json/types/Shipyard.js"
import { ensureType } from "./JsonValidation.js"

export default class Shipyard {
    static parse(str: string): SY {
        const parsedStr = JSON.parse(str)
        const shipyard = ensureType<SY>(validations.Shipyard, parsedStr)
        return shipyard
    }
    static serialize(shipyard: SY): string {
        ensureType<SY>(validations.Shipyard, shipyard)
        return JSON.stringify(shipyard)
    }
}
