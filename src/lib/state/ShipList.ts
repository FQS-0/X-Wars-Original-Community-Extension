import { useEffect, useState } from "react"
import { StorageArea } from "../StorageArea.js"
import { IShipyard } from "../json/types/Shipyard.js"

export const useShipList = () => {
    const [list, setList] = useState<IShipyard>({
        name: "",
        planets: [],
        ships: [],
    })

    const updateShipList = async () => {
        setList(
            await StorageArea.shipyard.tryGet({
                name: "",
                planets: [],
                ships: [],
            })
        )
    }

    useEffect(() => {
        updateShipList()
        const unsubscribe = StorageArea.shipyard.subscribe(updateShipList)
        return () => {
            unsubscribe()
        }
    }, [])

    return list
}
