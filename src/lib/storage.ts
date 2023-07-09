import Browser from "webextension-polyfill"

export interface Resource {
    0: number
    1: number
    2: number
    3: number
    4: number
    5: number
}
export interface Resources {
    date: Date
    amount: Resource
    perSecond: Resource
    max: Resource
}

export function isResource(r: object): r is Resource {
    return (
        "0" in r &&
        typeof r[0] === "number" &&
        "1" in r &&
        typeof r[1] === "number" &&
        "2" in r &&
        typeof r[2] === "number" &&
        "3" in r &&
        typeof r[3] === "number" &&
        "4" in r &&
        typeof r[4] === "number" &&
        "5" in r &&
        typeof r[5] === "number"
    )
}

export function isResources(r: object): r is Resources {
    return (
        "date" in r &&
        r.date instanceof Date &&
        "amount" in r &&
        typeof r.amount === "object" &&
        r.amount !== null &&
        isResource(r.amount) &&
        "perSecond" in r &&
        typeof r.perSecond === "object" &&
        r.perSecond !== null &&
        isResource(r.perSecond) &&
        "max" in r &&
        typeof r.max === "object" &&
        r.max !== null &&
        isResource(r.max)
    )
}
export async function getResources(): Promise<Resources | undefined> {
    const { resources } = await Browser.storage.local.get("resources")

    if (isResources(resources)) return resources
}

export async function setResources(resources: Resources) {
    return Browser.storage.local.set({ resources: resources })
}
