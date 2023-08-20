import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { Depot } from "../Resource.js"
import { StorageArea } from "../StorageArea.js"

const DepotContext = createContext<Depot>(
    Depot.fromObject({
        date: new Date(),
        stock: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
        perHour: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
        max: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
    })
)

export const DepotProvider = ({ children }: PropsWithChildren) => {
    const [depot, setDepot] = useState<Depot>(
        Depot.fromObject({
            date: new Date(),
            stock: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
            perHour: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
            max: { fe: 0, kr: 0, fr: 0, or: 0, fo: 0, go: 0 },
        })
    )

    useDepotFromStorage(setDepot)

    return (
        <DepotContext.Provider value={depot}>{children}</DepotContext.Provider>
    )
}

export const useDepot = () => {
    return useContext(DepotContext)
}

const useDepotFromStorage = (setDepot: Dispatch<SetStateAction<Depot>>) => {
    const updateDepot = async () => {
        setDepot(
            Depot.fromObject(
                await StorageArea.currentId.currentPlanet.depot.tryGet()
            )
        )
    }
    useEffect(() => {
        updateDepot()
        const unsubscribe =
            StorageArea.currentId.currentPlanet.depot.subscribe(updateDepot)
        return () => {
            unsubscribe()
        }
    }, [])
}
