import { useEffect, useState } from "react"
import { TPlanets } from "../json/types/Planets.js"
import { StorageArea } from "../StorageArea.js"

export const useOwnPlanets = () => {
    const [ownPlanets, setOwnPlanets] = useState<TPlanets>([])

    const updateOwnPlanets = async () => {
        setOwnPlanets(await StorageArea.currentId.planets.tryGet([]))
    }

    useEffect(() => {
        updateOwnPlanets()
        const unsubscribe =
            StorageArea.currentId.planets.subscribe(updateOwnPlanets)
        return () => {
            unsubscribe()
        }
    }, [])

    return ownPlanets
}
