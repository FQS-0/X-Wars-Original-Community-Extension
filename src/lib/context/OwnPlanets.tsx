import { PropsWithChildren, createContext, useContext } from "react"
import { TPlanets } from "../json/types/Planets.js"
import { useOwnPlanets as useOwnPlanetsState } from "../state/OwnPlanets.js"

const OwnPlanetsContext = createContext<TPlanets>([])

export const OwnPlanetsProvider = ({ children }: PropsWithChildren) => {
    const ownPlanets = useOwnPlanetsState()

    return (
        <OwnPlanetsContext.Provider value={ownPlanets}>
            {children}
        </OwnPlanetsContext.Provider>
    )
}

export const useOwnPlanets = () => {
    return useContext(OwnPlanetsContext)
}
