import { object, serializable, date } from "serializr"
import { Depot as DepotInterface } from "./json/types/Depot.js"
import { Resources as ResourcesInterface } from "./json/types/Resources.js"

export function formatResource(val: number, ceil: boolean = false): string {
    if (val > 1000000) return `${(val / 10000000).toPrecision(1)}M`
    if (val > 1000) return `${Math.round(val / 100) / 10}k`
    return ceil ? Math.ceil(val).toString() : Math.floor(val).toString()
}

export class Resources implements ResourcesInterface {
    constructor(
        public fe: number,
        public kr: number,
        public fr: number,
        public or: number,
        public fo: number,
        public go: number
    ) {}

    static fromObj({ fe, kr, fr, or, fo, go }: ResourcesInterface) {
        return new Resources(fe, kr, fr, or, fo, go)
    }
    static fromArray(res: number[]) {
        return new Resources(res[0], res[1], res[2], res[3], res[4], res[5])
    }
    toArray(): number[] {
        return [this.fe, this.kr, this.fr, this.or, this.fo, this.go]
    }

    add(o: Resources) {
        return new Resources(
            this.fe + o.fe,
            this.kr + o.kr,
            this.fr + o.fr,
            this.or + o.or,
            this.fo + o.fo,
            this.go + o.go
        )
    }

    sub(o: Resources) {
        return new Resources(
            this.fe - o.fe,
            this.kr - o.kr,
            this.fr - o.fr,
            this.or - o.or,
            this.fo - o.fo,
            this.go - o.go
        )
    }

    set(i: number, value: number) {
        switch (i) {
            case 0:
                this.fe = value
                break
            case 1:
                this.kr = value
                break
            case 2:
                this.fr = value
                break
            case 3:
                this.or = value
                break
            case 4:
                this.fo = value
                break
            case 5:
                this.go = value
                break
            default:
                throw new Error("index out of bounds")
        }
    }

    get(i: number) {
        switch (i) {
            case 0:
                return this.fe
            case 1:
                return this.kr
            case 2:
                return this.fr
            case 3:
                return this.or
            case 4:
                return this.fo
            case 5:
                return this.go
            default:
                throw new Error("index out of bounds")
        }
    }

    map(callback: (value: number, index: number) => number) {
        return Resources.fromArray(this.toArray().map(callback))
    }
}

export class Depot implements DepotInterface {
    @serializable(date()) public date: Date
    @serializable(object(Resources)) public stock: Resources
    @serializable(object(Resources)) public perHour: Resources
    @serializable(object(Resources)) public max: Resources

    constructor(
        date: Date,
        stock: Resources,
        perHour: Resources,
        max: Resources
    ) {
        this.date = date
        this.stock = stock
        this.perHour = perHour
        this.max = max
    }

    static fromObject({ date, stock, perHour, max }: DepotInterface) {
        return new Depot(
            new Date(date),
            Resources.fromObj(stock),
            Resources.fromObj(perHour),
            Resources.fromObj(max)
        )
    }

    getCurrentResources(): Resources {
        const diffInHours =
            Math.round((new Date().getTime() - this.date.getTime()) / 1000) /
            60 /
            60

        return this.stock
            .add(this.perHour.map((x) => x * diffInHours))
            .map((x) => Math.floor(x))
            .map((x, i) => (x > this.max.get(i) ? this.max.get(i) : x))
            .map((x) => (x < 0 ? 0 : x))
    }
}
