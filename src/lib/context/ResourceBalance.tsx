import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { StorageArea } from "../StorageArea.js"
import { Depot } from "../Resource.js"
import { useCurrentPlanet as useCurrentPlanetState } from "../state/CurrentPlanet.js"
import { useTrades } from "../state/trades.js"
import { PlanetaryResourceBalance } from "../PlanetaryResourceBalance.js"

const ResourceBalanceContext = createContext<PlanetaryResourceBalance>(
    new PlanetaryResourceBalance()
)

export const ResourceBalanceProvider = ({ children }: PropsWithChildren) => {
    const [balance, setBalance] = useState<PlanetaryResourceBalance>(
        new PlanetaryResourceBalance()
    )
    const currentPlanet = useCurrentPlanetState()
    const trades = useTrades()

    const updateResourceBalance = async () => {
        const depot = Depot.fromObject(
            await StorageArea.currentId.currentPlanet.depot.tryGet()
        )

        setBalance(new PlanetaryResourceBalance(currentPlanet, depot, trades))
    }

    useEffect(() => {
        const unsubscribe = StorageArea.currentId.currentPlanet.depot.subscribe(
            updateResourceBalance
        )
        return () => {
            unsubscribe()
        }
    }, [currentPlanet])

    useEffect(() => {
        updateResourceBalance()
    }, [currentPlanet, trades])

    return (
        <ResourceBalanceContext.Provider value={balance}>
            {children}
        </ResourceBalanceContext.Provider>
    )
}

export const useResourceBalance = () => {
    return useContext(ResourceBalanceContext)
}
