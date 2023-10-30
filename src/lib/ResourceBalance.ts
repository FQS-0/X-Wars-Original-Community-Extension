import { Resources } from "./Resource.js"

export interface ResourceBalance {
    depotNow: Resources
    depot3h: Resources
    saveTrades: Resources
    runningTrades: Resources
    outgoingTrades: { send: Resources; receive: Resources }
    incomingTrades: { send: Resources; receive: Resources }
}
