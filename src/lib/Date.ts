const dateRegex =
    /(?<date>(?<day>0?[1-9]|1[0-9]|2[0-9]|3[01])\.(?<month>0?[1-9]|1[012])\.(?<year>19[0-9]{2}|2[0-9]{3})?)?\s*?(?<hours>[0-9]|0[0-9]|1[0-9]|2[0-3]):(?<minutes>[0-5][0-9])(?::(?<seconds>[0-5][0-9]))?/

function matchDate(s: string) {
    return s.match(dateRegex)?.groups
}

function constructDate(groups: { [key: string]: string }, utc?: boolean) {
    const now = new Date()

    const year = groups.year ? parseInt(groups.year) : now.getFullYear()
    const month = groups.month ? parseInt(groups.month) - 1 : now.getMonth()
    const day = groups.day ? parseInt(groups.day) : now.getDate()
    const hours = groups.hours ? parseInt(groups.hours) : 0
    const minutes = groups.minutes ? parseInt(groups.minutes) : 0
    const seconds = groups.seconds ? parseInt(groups.seconds) : 0

    if (utc) {
        return new Date(Date.UTC(year, month, day, hours, minutes, seconds))
    } else {
        return new Date(year, month, day, hours, minutes, seconds)
    }
}

export function getDate(s: string, utc?: boolean) {
    const groups = matchDate(s)

    if (!groups) return null

    const date = constructDate(groups, utc)

    return date
}

function UTCToLocal(s: string) {
    const groups = matchDate(s)

    if (!groups) {
        console.error(`Date.ts: no match found in s = "${s}"`)
        return s
    }

    const date = constructDate(groups, true)

    let dateString = ""
    if (groups.year) {
        dateString = `${date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })} `
    } else if (groups.month) {
        dateString = `${date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
        })} `
    }

    if (groups.seconds) {
        dateString += date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    } else {
        dateString += date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return dateString
}

export function replaceUTCWithLocal(element: HTMLElement) {
    element.innerHTML = element.innerHTML.replace(dateRegex, (s) =>
        UTCToLocal(s)
    )
}

export function formatSeconds(s: number) {
    return `${("00" + Math.floor(s / 60 / 60)).slice(-2)}:${(
        "00" + Math.floor((s / 60) % 60)
    ).slice(-2)}:${("00" + Math.floor(s % 60)).slice(-2)}`
}
