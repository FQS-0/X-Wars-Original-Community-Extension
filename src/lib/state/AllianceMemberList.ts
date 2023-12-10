import { useEffect, useState } from "react"
import { TAllianceMemberList } from "../json/types/AllianceMemberList.js"
import { StorageArea } from "../StorageArea.js"

export const useAllianceMemberList = () => {
    const [list, setList] = useState<TAllianceMemberList>([])

    const updateAllianceMemberList = async () => {
        setList(await StorageArea.allianceMemberlist.tryGet([]))
    }

    useEffect(() => {
        updateAllianceMemberList()
        const unsubscribe = StorageArea.allianceMemberlist.subscribe(
            updateAllianceMemberList
        )
        return () => {
            unsubscribe()
        }
    }, [])

    return list
}
