import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { StorageArea } from "../StorageArea.js"

const SessionIdContext = createContext<string>("")

export const SessionIdProvider = ({ children }: PropsWithChildren) => {
    const [sessionId, setSessionId] = useState<string>("")

    const updateSessionId = async () => {
        const id = await StorageArea.sessionId.tryGet()
        setSessionId(id)
    }

    useEffect(() => {
        updateSessionId()

        const unsubscribe = StorageArea.sessionId.subscribe(updateSessionId)

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <SessionIdContext.Provider value={sessionId}>
            {children}
        </SessionIdContext.Provider>
    )
}

export const useSessionId = () => {
    return useContext(SessionIdContext)
}
