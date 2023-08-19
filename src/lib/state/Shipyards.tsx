import { useEffect, useState } from "react"
import { IShipyard } from "../json/types/Shipyard.js"
import { StorageArea } from "../StorageArea.js"
import { Shipyard } from "../Shipyard.js"

export const useShipyards = () => {
    const [shipyards, setShipyards] = useState<IShipyard[]>([])

    const updateShipyards = async () => {
        setShipyards(await StorageArea.shipyards.tryGet([]))
    }

    useEffect(() => {
        updateShipyards()
        fetchShipyardsUpdates()
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

export const fetchShipyard = async (url: URL) => {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
        console.error("HTTP status: ", response.status)
        throw new Error("Die angegebene URL konnte nicht abgerufen werden!")
    }

    const shipyard = Shipyard.parse(await response.text())
    shipyard.url = url.toString()
    shipyard.lastUpdate = new Date()
    return addShipyard(shipyard)
}

export const fetchShipyardsUpdates = async () => {
    const shipyards = await StorageArea.shipyards.tryGet([])
    const today = new Date()
    shipyards.forEach((shipyard) => {
        if (shipyard.url && shipyard.lastUpdate) {
            const lastUpdate = new Date(shipyard.lastUpdate)
            if (today.getTime() - lastUpdate.getTime() > 24 * 60 * 60 * 1000) {
                console.log(`updating shipyard ${shipyard.url}`)
                fetchShipyard(new URL(shipyard.url))
            }
        }
    })
}
