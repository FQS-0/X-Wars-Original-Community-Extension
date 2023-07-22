type Constructor<T> = { new (...args: unknown[]): T }

export function as<T>(x: unknown, className: Constructor<T>): T {
    if (x === null) throw new Error("x is null")
    if (x === undefined) throw new Error("x is undefined")
    if (x instanceof className) return x
    throw new TypeError()
}
