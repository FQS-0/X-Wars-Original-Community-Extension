import { PropsWithChildren, createContext, useContext } from "react"
import { useCurrentPlanet as useCurrentPlanetState } from "../state/CurrentPlanet.js"

const CurrentPlanetContext = createContext("")

export const CurrentPlanetProvider = ({ children }: PropsWithChildren) => {
    const currentPlanet = useCurrentPlanetState()

    return (
        <CurrentPlanetContext.Provider value={currentPlanet}>
            {children}
        </CurrentPlanetContext.Provider>
    )
}

export const useCurrentPlanet = () => {
    return useContext(CurrentPlanetContext)
}
