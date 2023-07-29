import { date, object, serializable } from "serializr"

import { Resources } from "./Resource.js"

export class Trade {
    @serializable
    id: string
    @serializable
    isFromOwnPlanet: boolean
    @serializable
    isToOwnPlanet: boolean
    @serializable(object(Resources))
    delivery: Resources
    @serializable(object(Resources))
    returnDelivery: Resources
    @serializable(date())
    date: Date | undefined
    @serializable
    comment: string
    @serializable
    fromPlanet: string
    @serializable
    toPlanet: string
    @serializable(date())
    concludedAt: Date | undefined

    constructor(
        id: string,
        from: string,
        to: string,
        delivery: Resources,
        returnDelivery: Resources,
        comment: string,
        isFromOwnPlanet: boolean,
        isToOwnPlanet: boolean,
        concludedAt: Date | undefined
    ) {
        this.id = id
        this.fromPlanet = from
        this.toPlanet = to
        this.delivery = delivery
        this.returnDelivery = returnDelivery
        this.comment = comment
        this.isFromOwnPlanet = isFromOwnPlanet
        this.isToOwnPlanet = isToOwnPlanet
        this.concludedAt = concludedAt

        const match = comment.match(
            /(?<hours>[0-9]|0[0-9]|1[0-9]|2[0-3]):(?<minutes>[0-5][0-9])(?::(?<seconds>[0-5][0-9]))/
        )
        if (match) {
            if (!match.groups) throw new Error("no match groups")
            const hours = parseInt(
                match.groups["hours"] ? match.groups["hours"] : "-1"
            )
            const minutes = parseInt(
                match.groups["minutes"] ? match.groups["minutes"] : "-1"
            )
            const seconds = parseInt(
                match.groups["seconds"] ? match.groups["seconds"] : "0"
            )

            this.date = new Date()
            this.date.setHours(hours, minutes, seconds)
            const now = new Date()
            if (now.getTime() - this.date.getTime() < 0)
                this.date.setTime(this.date.getTime() - 24 * 60 * 60 * 1000)
        }
    }

    get isRunning() {
        return this.concludedAt != undefined
    }
}
