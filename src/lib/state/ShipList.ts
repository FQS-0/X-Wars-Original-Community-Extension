import { useEffect, useState } from "react"
import { TShips } from "../json/types/Ships.js"
import { StorageArea } from "../StorageArea.js"

export const useShipList = () => {
    const [list, setList] = useState<TShips>([])

    const updateShipList = async () => {
        setList(await StorageArea.shipList.tryGet([]))
    }

    useEffect(() => {
        updateShipList()
        const unsubscribe = StorageArea.shipList.subscribe(updateShipList)
        return () => {
            unsubscribe()
        }
    }, [])

    return list
}
