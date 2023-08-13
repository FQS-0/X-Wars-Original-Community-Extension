import * as validations from "./json/schemas/validations.js"
import { IShipyard } from "./json/types/Shipyard.js"
import { ensureType } from "./JsonValidation.js"

export class Shipyard {
    static parse(str: string): IShipyard {
        const parsedStr = JSON.parse(str)
        const shipyard = ensureType<IShipyard>(validations.IShipyard, parsedStr)
        return shipyard
    }
    static serialize(shipyard: IShipyard): string {
        ensureType<IShipyard>(validations.IShipyard, shipyard)
        return JSON.stringify(shipyard)
    }
}
