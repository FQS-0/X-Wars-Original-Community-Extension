type Constructor<T> = { new (...args: unknown[]): T }

export function as<T>(x: unknown, className: Constructor<T>): T {
    if (x === null) throw new Error("x is null")
    if (x === undefined) throw new Error("x is undefined")
    if (x instanceof className) return x
    throw new TypeError()
}

export function isStringArray(array: unknown): array is string[] {
    if (!Array.isArray(array)) return false

    if (array.some((v) => typeof v !== "string")) return false

    return true
}

export function getContentDiv(): HTMLElement {
    let div = window.document.querySelector(
        "div#xwo-ext-content"
    ) as HTMLElement | null

    if (!div) {
        div = window.document.createElement("DIV")
        div.id = "xwo-ext-content"
        window.document.body.insertBefore(div, window.document.body.firstChild)
    }

    return div
}
