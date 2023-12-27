import { StorageArea } from "../StorageArea.js"

export default function scrapeSubmenu() {
    const activeParams = new URLSearchParams(window.location.search)
    const activeMethod = activeParams.get("method") || ""
    const activeArt = activeParams.get("art") || ""

    const items = Array.from(
        window.document.querySelectorAll(
            'div[align="center"] > a'
        ) as NodeListOf<HTMLAnchorElement>
    ).map((a) => {
        const params = new URLSearchParams(a.href)
        const method = params.get("method") || ""
        const art = params.get("art") || ""
        const text = a.innerText
        const isActive = activeMethod == method && activeArt == art
        return { method: method, art: art, text: text, isActive: isActive }
    })

    StorageArea.currentId.subMenuList.set(items)
}
