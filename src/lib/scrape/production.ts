export async function scrapeProduction() {
    const forms = Array.from(window.document.querySelectorAll("form"))
    const ships = forms.map((form) => {
        const [, id] = (form.name.match(/formular(\d+)/) || ["", "-1"]).map(
            (m) => parseInt(m)
        )
        const row = form.nextElementSibling
        if (!(row instanceof HTMLTableRowElement)) {
            console.error("expected table row")
            return
        }
        if (row.cells.length !== 3) {
            console.error("wrong cell count")
            return
        }
        const name = row.cells[0].innerText.replace(/-[^-]+$/, "")

        const [, engine, speed] = row.cells[1].innerText.match(
            /(\S{3})\s*(\d+)\s*%/
        ) || [undefined, "UNK", "-1"]
        const [, att, def] = (
            row.cells[1].innerText.match(/(\d+)\s*\/\s*(\d+)/) || [
                "",
                "-1",
                "-1",
            ]
        ).map((m) => parseInt(m))
        const [, fe, kr, fr, or, fo, go] = (
            row.cells[1].innerText.match(
                /([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*([-\d]+)\s*$/
            ) || ["", "-1", "-1", "-1", "-1", "-1", "-1"]
        ).map((m) => {
            const r = parseInt(m)
            if (isNaN(r)) return 0
            return r
        })

        return {
            name: name,
            id: id,
            engine: engine,
            speed: parseInt(speed),
            att: att,
            def: def,
            resources: {
                fe: fe,
                kr: kr,
                fr: fr,
                or: or,
                fo: fo,
                go: go,
            },
        }
    })

    console.log(ships)
}
