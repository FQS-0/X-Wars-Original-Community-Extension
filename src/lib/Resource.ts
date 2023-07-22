import { list, object, primitive, serializable, date } from "serializr"

export class Resources {
    @serializable(list(primitive()))
    private res: number[] = [-1, -1, -1, -1, -1, -1]

    constructor(
        fe: number,
        kr: number,
        fr: number,
        or: number,
        fo: number,
        go: number
    ) {
        this.res = [fe, kr, fr, or, fo, go]
    }

    static fromArray(res: number[]) {
        return new Resources(res[0], res[1], res[2], res[3], res[4], res[5])
    }
    toArray(): number[] {
        return this.res
    }

    get fe() {
        return this.res[0]
    }
    get kr() {
        return this.res[1]
    }
    get fr() {
        return this.res[2]
    }
    get or() {
        return this.res[3]
    }
    get fo() {
        return this.res[4]
    }
    get go() {
        return this.res[5]
    }

    add(other: Resources) {
        return Resources.fromArray(this.res.map((x, i) => x + other.get(i)))
    }

    sub(other: Resources) {
        return Resources.fromArray(this.res.map((x, i) => x - other.get(i)))
    }

    get(i: number) {
        return this.res[i]
    }

    map(callback: (value: number, index: number) => number) {
        return Resources.fromArray(this.res.map(callback))
    }
}

export class Depot {
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
