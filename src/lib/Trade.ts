import { Resources } from "./Resource.js"
import { ITrade } from "./json/types/Trade.js"

export class Trade implements ITrade {
    date: Date | undefined

    constructor(
        public id: string,
        public fromPlanet: string,
        public toPlanet: string,
        public delivery: Resources,
        public returnDelivery: Resources,
        public comment: string,
        public isFromOwnPlanet: boolean,
        public isToOwnPlanet: boolean,
        public concludedAt: Date | undefined
    ) {
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
