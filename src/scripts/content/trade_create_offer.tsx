import { createRoot } from "react-dom/client"
import { as } from "~/src/lib/DOMHelpers.js"
import { Planet } from "~/src/lib/Planet.js"
import { Favourite, FavouriteType } from "~src/lib/Favourite.js"
;(async () => {
    const kostenMatch = window.document
        .querySelector(
            'form[name="formular"] > table > tbody > tr:nth-child(2) > td:nth-child(3)'
        )
        ?.textContent?.match(/[\d]+(\.\d+)?/)
    if (!kostenMatch) throw "Error: transport cost not found"
    const kosten = parseFloat(kostenMatch[0]) / 100.0

    function addReturn() {
        for (let i = 0; i < 6; i++) {
            if (
                parseInt(
                    as(
                        window.document.forms
                            .namedItem("formular")
                            ?.elements.namedItem(`tt_res[${i}]`),
                        HTMLInputElement
                    ).value
                ) > 0
            ) {
                return
            }
        }

        as(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem(`tt_res[0]`),
            HTMLInputElement
        ).value = "1"
    }

    function addTimeComment() {
        const date = new Date()
        const input = as(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem("trade_comment"),
            HTMLInputElement
        )
        input.value = input.value.replace(/## \d+:\d+:\d+/, "")
        input.value += "## " + date.toLocaleTimeString("de-DE")
    }

    window.document
        .querySelector(
            'form[name="formular"] > table > tbody > tr:last-child > td > a'
        )
        ?.addEventListener("click", () => {
            addReturn()
            addTimeComment()
        })

    async function limitRes(input: HTMLInputElement, idx: number) {
        const resources = (await Planet.getDepot()).getCurrentResources()
        let max_res = Math.trunc(resources.get(idx) / (1 + kosten)) - 2
        if (max_res < 0) {
            max_res = 0
        }
        const res = parseInt(input.value)

        if (res > max_res) {
            input.value = max_res.toString()
        }
    }

    for (let i = 0; i < 6; i++) {
        as(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem(`tf_res[${i}]`),
            HTMLElement
        ).addEventListener("change", function () {
            limitRes(as(this, HTMLInputElement), i)
        })
    }

    async function save() {
        const resources = (await Planet.getDepot()).getCurrentResources()
        for (let i = 0; i < 6; i++) {
            let max_res = Math.trunc(resources.get(i) / (1 + kosten)) - 2
            if (max_res < 0) {
                max_res = 0
            }
            as(
                window.document.forms
                    .namedItem("formular")
                    ?.elements.namedItem(`tf_res[${i}]`),
                HTMLInputElement
            ).value = max_res.toString()
        }

        as(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem("tt_res[5]"),
            HTMLInputElement
        ).value = "9999999"
        as(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem("trade_comment"),
            HTMLInputElement
        ).value = "Sicherungshandel"
    }

    const tableRow = as(
        window.document.querySelector(
            'form[name="formular"] > table > tbody > tr:last-child'
        ),
        HTMLTableRowElement
    )
    const cell = tableRow.insertCell(0)
    cell.colSpan = 2
    cell.className = "first"
    cell.align = "center"

    const newCell = (
        <>
            [{" "}
            <a id="hz__save" href="#" onClick={save}>
                Sicherungshandel
            </a>{" "}
            ]
        </>
    )

    const root = createRoot(cell)
    root.render(newCell)

    /** Add favourites to select */

    const select = window.document.querySelector(
        'select[name="changeTarget"]'
    ) as HTMLSelectElement
    if (select) {
        const option = window.document.createElement("option")
        option.text = "---- Favouriten"
        select.add(option)
        const favourites = await Favourite.getList()
        favourites
            .filter((fav) => fav.type == FavouriteType.FRIEND)
            .forEach((fav) => {
                const option = window.document.createElement("option")
                option.text = `${fav.name} - ${fav.coordinates}`
                option.value = fav.coordinates
                select.add(option)
            })
    }
})()
