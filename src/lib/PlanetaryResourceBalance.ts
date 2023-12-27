import { Depot, Resources } from "./Resource.js"
import { TTrades } from "./json/types/Trades.js"

function computeDelivery(trades: TTrades): Resources {
    return trades.reduce(
        (resource, trade) => resource.add(Resources.fromObj(trade.delivery)),
        new Resources(0, 0, 0, 0, 0, 0)
    )
}

function computeReturnDelivery(trades: TTrades): Resources {
    return trades.reduce(
        (resource, trade) =>
            resource.add(Resources.fromObj(trade.returnDelivery)),
        new Resources(0, 0, 0, 0, 0, 0)
    )
}

function computeReceivedResources(planet: string, trades: TTrades) {
    return trades.reduce(
        (resources, trade) =>
            resources.add(
                trade.toPlanet == planet
                    ? Resources.fromObj(trade.delivery)
                    : Resources.fromObj(trade.returnDelivery)
            ),
        new Resources(0, 0, 0, 0, 0, 0)
    )
}

export class PlanetaryResourceBalance {
    public saveTrades: TTrades = []
    public outgoingTrades: TTrades = []
    public incomingTrades: TTrades = []
    public runningTrades: TTrades = []

    constructor(
        public planet: string = "",
        public depot: Depot = new Depot(),
        trades: TTrades = []
    ) {
        trades.forEach((trade) => {
            if (
                trade.concludedAt &&
                (trade.fromPlanet == planet || trade.toPlanet == planet)
            ) {
                this.runningTrades.push(trade)
            } else if (trade.toPlanet == planet) {
                if (
                    !trade.comment.toLowerCase().includes("save") &&
                    trade.returnDelivery.go <= 1000000
                ) {
                    this.incomingTrades.push(trade)
                }
            } else if (trade.fromPlanet == planet) {
                if (
                    trade.comment.toLowerCase().includes("save") ||
                    trade.returnDelivery.go > 1000000
                ) {
                    this.saveTrades.push(trade)
                } else {
                    this.outgoingTrades.push(trade)
                }
            }
        })
    }

    public getResources(at: number | Date = 0) {
        const date =
            typeof at === "number"
                ? new Date(new Date().getTime() + at * 1000)
                : at
        const resources = this.depot.getResources(date)

        resources.addi(
            computeReceivedResources(
                this.planet,
                this.runningTrades.filter(
                    (trade) => trade.concludedAt && trade.concludedAt <= date
                )
            )
        )
        resources.addi(
            computeDelivery(
                this.saveTrades.filter(
                    (trade) =>
                        new Date(trade.date.getTime() + 12 * 60 * 60 * 1000) <=
                        date
                )
            )
        )

        return resources
    }

    public get currentResources(): Resources {
        return this.depot.getCurrentResources()
    }

    public get resourcesIn3Hours(): Resources {
        return this.getResources(3 * 60 * 60)
    }

    public get sentResourcesFromSaveTrades(): Resources {
        return computeDelivery(this.saveTrades)
    }

    public get receivedResourcesFromRunningTrades(): Resources {
        return computeReceivedResources(this.planet, this.runningTrades)
    }

    public get sentResourcesFromOutgoingTrades(): Resources {
        return computeDelivery(this.outgoingTrades)
    }

    public get receivedResourcesFromOutgoingTrades(): Resources {
        return computeReturnDelivery(this.outgoingTrades)
    }

    public get sentResourcesFromIncomingTrades(): Resources {
        return computeReturnDelivery(this.incomingTrades)
    }

    public get receivedResourcesFromIncomingTrades(): Resources {
        return computeDelivery(this.incomingTrades)
    }
}
