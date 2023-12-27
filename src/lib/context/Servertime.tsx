import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { StorageArea } from "../StorageArea.js"

const ServertimeContext = createContext<Date>(new Date())

export const ServertimeProvider = ({ children }: PropsWithChildren) => {
    const [servertime, setServertime] = useState<Date>(new Date())

    const updateServertime = async () => {
        const offset = await StorageArea.servertimeOffset.tryGet(0)
        const servertime = new Date(new Date().getTime() + offset)
        setServertime(servertime)
    }

    useEffect(() => {
        updateServertime()

        const unsubscribe =
            StorageArea.servertimeOffset.subscribe(updateServertime)
        const timer = setInterval(updateServertime, 1000)

        return () => {
            unsubscribe()
            clearInterval(timer)
        }
    }, [])

    return (
        <ServertimeContext.Provider value={servertime}>
            {children}
        </ServertimeContext.Provider>
    )
}

export const useServertime = () => {
    return useContext(ServertimeContext)
}
