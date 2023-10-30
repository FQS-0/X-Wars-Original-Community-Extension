import { useEffect, useState } from "react"
import { TSubMenuList } from "../json/types/SubMenuList.js"
import { StorageArea } from "../StorageArea.js"

export const useSubMenuList = () => {
    const [list, setList] = useState<TSubMenuList>([])

    const updateList = async () => {
        setList(await StorageArea.currentId.subMenuList.tryGet([]))
    }

    useEffect(() => {
        updateList()
        const unsubscribe =
            StorageArea.currentId.subMenuList.subscribe(updateList)
        return () => {
            unsubscribe()
        }
    }, [])

    return list
}
