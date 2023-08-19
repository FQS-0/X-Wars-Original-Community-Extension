import { useEffect, useState } from "react"
import { IShipyard } from "../json/types/Shipyard.js"
import { StorageArea } from "../StorageArea.js"

export const useShipyards = () => {
    const [shipyards, setShipyards] = useState<IShipyard[]>([])

    const updateShipyards = async () => {
        setShipyards(await StorageArea.shipyards.tryGet([]))
    }

    useEffect(() => {
        updateShipyards()
        const unsubscribe = StorageArea.shipyards.subscribe(updateShipyards)
        return () => {
            unsubscribe()
        }
    }, [])

    return shipyards
}

export const addShipyard = async (shipyard: IShipyard) => {
    const storedShipyards = await StorageArea.shipyards.tryGet([])

    const idx = storedShipyards.findIndex((sy) => shipyard.name == sy.name)
    if (idx === -1) {
        storedShipyards.push(shipyard)
    } else {
        storedShipyards[idx] = shipyard
    }
    await StorageArea.shipyards.set(storedShipyards)

    return idx === -1
}

export const removeShipyard = async (shipyard: IShipyard) => {
    const storedShipyards = await StorageArea.shipyards.tryGet([])

    const idx = storedShipyards.findIndex((sy) => shipyard.name === sy.name)
    if (idx > -1) {
        storedShipyards.splice(idx, 1)
    }
    await StorageArea.shipyards.set(storedShipyards)
}
