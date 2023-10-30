import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { ResourceBalance } from "../ResourceBalance.js"
import { StorageArea } from "../StorageArea.js"
import { Depot, Resources } from "../Resource.js"
import { useCurrentPlanet as useCurrentPlanetState } from "../state/CurrentPlanet.js"
import { useTrades } from "../state/trades.js"

const defaultResourceBalance: ResourceBalance = {
    depotNow: new Resources(0, 0, 0, 0, 0, 0),
    depot3h: new Resources(0, 0, 0, 0, 0, 0),
    saveTrades: new Resources(0, 0, 0, 0, 0, 0),
    outgoingTrades: {
        send: new Resources(0, 0, 0, 0, 0, 0),
        receive: new Resources(0, 0, 0, 0, 0, 0),
    },
    incomingTrades: {
        send: new Resources(0, 0, 0, 0, 0, 0),
        receive: new Resources(0, 0, 0, 0, 0, 0),
    },
    runningTrades: new Resources(0, 0, 0, 0, 0, 0),
}

const ResourceBalanceContext = createContext<ResourceBalance>(
    defaultResourceBalance
)

export const ResourceBalanceProvider = ({ children }: PropsWithChildren) => {
    const [balance, setBalance] = useState<ResourceBalance>(
        defaultResourceBalance
    )
    const currentPlanet = useCurrentPlanetState()
    const trades = useTrades()

    const updateResourceBalance = async () => {
        const depot = Depot.fromObject(
            await StorageArea.currentId.currentPlanet.depot.tryGet()
        )
        const now = new Date()
        const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000)

        const depotNow = depot.getCurrentResources()
        const depot3Hours = depot.getResources(in3Hours)
        const saveTrades = new Resources(0, 0, 0, 0, 0, 0)
        const outgoingTrades = {
            send: new Resources(0, 0, 0, 0, 0, 0),
            receive: new Resources(0, 0, 0, 0, 0, 0),
        }
        const incomingTrades = {
            send: new Resources(0, 0, 0, 0, 0, 0),
            receive: new Resources(0, 0, 0, 0, 0, 0),
        }
        const runningTrades = new Resources(0, 0, 0, 0, 0, 0)

        trades.forEach((trade) => {
            // Running Trade
            if (trade.concludedAt) {
                if (trade.fromPlanet == currentPlanet) {
                    runningTrades.addi(Resources.fromObj(trade.returnDelivery))
                } else if (trade.toPlanet == currentPlanet) {
                    runningTrades.addi(Resources.fromObj(trade.delivery))
                }
            } else if (trade.toPlanet == currentPlanet) {
                if (
                    !trade.comment.toLowerCase().includes("save") &&
                    trade.returnDelivery.go <= 1000000
                ) {
                    incomingTrades.receive.addi(
                        Resources.fromObj(trade.delivery)
                    )
                    incomingTrades.send.addi(
                        Resources.fromObj(trade.returnDelivery)
                    )
                }
            } else if (trade.fromPlanet == currentPlanet) {
                if (
                    trade.comment.toLowerCase().includes("save") ||
                    trade.returnDelivery.go > 1000000
                ) {
                    saveTrades.addi(Resources.fromObj(trade.delivery))
                } else {
                    outgoingTrades.receive.addi(
                        Resources.fromObj(trade.returnDelivery)
                    )
                    outgoingTrades.send.addi(Resources.fromObj(trade.delivery))
                }
            }
        })

        setBalance({
            depotNow: depotNow,
            depot3h: depot3Hours.add(runningTrades),
            saveTrades: saveTrades,
            outgoingTrades: outgoingTrades,
            incomingTrades: incomingTrades,
            runningTrades: runningTrades,
        })
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
