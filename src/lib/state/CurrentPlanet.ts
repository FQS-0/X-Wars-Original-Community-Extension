import { useEffect, useState } from "react"
import { StorageArea } from "../StorageArea.js"

export const useCurrentPlanet = () => {
    const [currentPlanet, setCurrentPlanet] = useState("")

    const updateCurrentPlanet = async () => {
        setCurrentPlanet(await StorageArea.currentId.currentPlanet.tryGet())
    }

    useEffect(() => {
        updateCurrentPlanet()
        const unsubscribe =
            StorageArea.currentId.currentPlanet.subscribe(updateCurrentPlanet)
        return () => {
            unsubscribe()
        }
    }, [])

    return currentPlanet
}
