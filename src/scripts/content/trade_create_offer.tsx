import { createRoot } from "react-dom/client"
import { DOMHelpers as D } from "~/src/lib/DOMHelpers.js"
import { Planet } from "~/src/lib/Planet.js"
import { ResourcesToArray } from "~/src/lib/Planet.js"
import React from "react"

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
                D.asHTMLInputElement(
                    window.document.forms
                        .namedItem("formular")
                        ?.elements.namedItem(`tt_res[${i}]`)
                ).value
            ) > 0
        ) {
            return
        }
    }

    D.asHTMLInputElement(
        window.document.forms
            .namedItem("formular")
            ?.elements.namedItem(`tt_res[0]`)
    ).value = "1"
}

function addTimeComment() {
    const date = new Date()
    const input = D.asHTMLInputElement(
        window.document.forms
            .namedItem("formular")
            ?.elements.namedItem("trade_comment")
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
    const resources = ResourcesToArray(await Planet.getCurrentResources())
    let max_res = Math.trunc(resources[idx] / (1 + kosten)) - 2
    if (max_res < 0) {
        max_res = 0
    }
    const res = parseInt(input.value)

    if (res > max_res) {
        input.value = max_res.toString()
    }
}

for (let i = 0; i < 6; i++) {
    D.asHTMLElement(
        window.document.forms
            .namedItem("formular")
            ?.elements.namedItem(`tf_res[${i}]`)
    ).addEventListener("change", function () {
        limitRes(D.asHTMLInputElement(this), i)
    })
}

async function save() {
    const resources = ResourcesToArray(await Planet.getCurrentResources())
    for (let i = 0; i < 6; i++) {
        let max_res = Math.trunc(resources[i] / (1 + kosten)) - 2
        if (max_res < 0) {
            max_res = 0
        }
        D.asHTMLInputElement(
            window.document.forms
                .namedItem("formular")
                ?.elements.namedItem(`tf_res[${i}]`)
        ).value = max_res.toString()
    }

    D.asHTMLInputElement(
        window.document.forms
            .namedItem("formular")
            ?.elements.namedItem("tt_res[5]")
    ).value = "9999999"
    D.asHTMLInputElement(
        window.document.forms
            .namedItem("formular")
            ?.elements.namedItem("trade_comment")
    ).value = "Sicherungshandel"
}

const tableRow = D.asHTMLTableRowElement(
    window.document.querySelector(
        'form[name="formular"] > table > tbody > tr:last-child'
    )
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
