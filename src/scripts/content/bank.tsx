import { createRoot } from "react-dom/client"
import { replaceUTCWithLocal, getDate } from "~/src/lib/Date.js"
import { Account } from "~src/lib/Account.js"
import { Bank } from "~src/lib/Bank.js"
import { Planet } from "~src/lib/Planet.js"
import { as } from "~/src/lib/DOMHelpers.js"

async function main() {
    const [transaction_table, info_table] = window.document.querySelectorAll(
        'table[cellspacing="1"][cellpadding="1"]'
    )

    if (!transaction_table || !(transaction_table instanceof HTMLTableElement))
        throw "Error: transaction table not found!"
    if (!info_table || !(info_table instanceof HTMLTableElement))
        throw "Error: transaction table not found!"

    transaction_table.width = "350px"
    info_table.width = "350px"

    const rows = Array.from(info_table.rows)

    // Convert times from UTC to local timezone
    rows.slice(8, rows.length).forEach((row) => {
        replaceUTCWithLocal(row.cells[0])
    })

    const interest_rate =
        parseFloat(transaction_table.rows[1].cells[1].innerText) / 100
    const capacity = parseInt(
        transaction_table.rows[2].cells[1].innerText.replace(".", "")
    )
    const booking_time = getDate(
        info_table.rows[info_table.rows.length - 1].innerText
    )
    if (!booking_time) throw "Error: could not parse booking time"

    const assets = [0, 0, 0, 0, 0, 0]
    const balance = [0, 0, 0, 0, 0, 0]
    const interest = [0, 0, 0, 0, 0, 0]
    const delta = [0, 0, 0, 0, 0, 0]
    const max_overbook = [0, 0, 0, 0, 0, 0]
    const transactions = new Map<Date, number[]>()

    const depot = await Planet.getDepot()
    if (!depot) throw "Error: no depot set for this planet!"
    const depot_capacity = depot.max.toArray()

    const form_elements: {
        input: HTMLInputElement
        link: HTMLAnchorElement
    }[] = []
    const resources: string[] = []
    for (let i = 0; i < 6; i++) {
        const input_elem = window.document.forms
            .namedItem("transaction")
            ?.elements.namedItem(`res[${i}]`)
        if (!input_elem || !(input_elem instanceof HTMLInputElement))
            throw "Error: input element not found!"
        const link_elem =
            input_elem.parentElement?.previousElementSibling?.children[0]
        if (!link_elem || !(link_elem instanceof HTMLAnchorElement))
            throw "Error: link element not found!"
        const resource_name = link_elem.innerText.trim()
        form_elements.push({ input: input_elem, link: link_elem })
        resources.push(resource_name)
    }

    rows.slice(1, 7).forEach((row) => {
        const textElem = row.lastElementChild?.previousElementSibling
        if (!textElem || !(textElem instanceof HTMLElement))
            throw "Error: resource text element not found!"
        const idx = resources.indexOf(textElem.innerText.trim())
        const assetElem = row.lastElementChild
        if (!assetElem || !(assetElem instanceof HTMLElement))
            throw "Error: asset element not found"
        balance[idx] = assets[idx] = parseInt(
            assetElem.innerText.replace(".", "")
        )
        interest[idx] = balance[idx] * interest_rate
    })

    let transaction_time: Date | null = null
    rows.slice(8, rows.length - 1).forEach((row) => {
        if (row.cells.length === 3) {
            transaction_time = getDate(row.cells[0].innerText)
        }
        if (!transaction_time) throw "Error: could not parse transaction time"
        const resource = as(
            row.lastElementChild?.previousElementSibling,
            HTMLElement
        ).innerText.trim()
        const idx = resources.indexOf(resource)
        const amount = parseInt(
            as(row.lastElementChild, HTMLElement).innerText.replace(".", "")
        )
        const withdraw = row.lastElementChild?.className === "red_second"

        let timedelta_in_seconds = 0
        if (withdraw) {
            timedelta_in_seconds =
                (transaction_time.getTime() - booking_time.getTime()) / 1000 +
                24 * 60 * 60
        } else {
            timedelta_in_seconds =
                (booking_time.getTime() - transaction_time.getTime()) / 1000
            balance[idx] += amount
        }

        interest[idx] += Math.floor(
            (amount * interest_rate * timedelta_in_seconds) / (24 * 60 * 60)
        )
        const transaction = transactions.get(transaction_time) ?? [
            0, 0, 0, 0, 0, 0,
        ]
        transaction[idx] = withdraw ? -amount : amount
        transactions.set(transaction_time, transaction)
    })

    const interest_partial_factor =
        (booking_time.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)

    for (const resource_idx in balance) {
        delta[resource_idx] =
            (capacity - (balance[resource_idx] + interest[resource_idx])) /
            (1 + interest_rate * interest_partial_factor)
        max_overbook[resource_idx] =
            delta[resource_idx] +
            assets[resource_idx] / (1 + interest_rate * interest_partial_factor)
    }

    const total = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < total.length; i++) total[i] = balance[i] + interest[i]

    Bank.setCapacity(capacity)
    Bank.setAssets(assets)
    Bank.setTotal(total)

    const check_transaction = async () => {
        const depot_resources = (await Planet.getDepot()).getCurrentResources()

        for (let j = 0; j < 6; j++) {
            switch (
                as(
                    window.document.forms
                        .namedItem("transaction")
                        ?.elements.namedItem("transaction_type"),
                    HTMLFormElement
                ).value
            ) {
                case "plus":
                    // Limit deposit to maximal overbook value
                    if (
                        parseInt(form_elements[j].input.value) > max_overbook[j]
                    ) {
                        form_elements[j].input.value =
                            max_overbook[j].toString()
                    }
                    // Mark input if deposit exceeds delta
                    if (parseInt(form_elements[j].input.value) > delta[j]) {
                        form_elements[j].input.style.backgroundColor = "orange"
                        continue
                    }
                    break
                case "minus":
                    // Limit withdraw to free depot capacity and available assets
                    if (
                        parseInt(form_elements[j].input.value) >
                        depot_capacity[j] - depot_resources.get(j)
                    ) {
                        form_elements[j].input.value = (
                            depot_capacity[j] - depot_resources.get(j)
                        ).toString()
                    }
                    if (parseInt(form_elements[j].input.value) > assets[j]) {
                        form_elements[j].input.value = assets[j].toString()
                    }
                    break
            }
            form_elements[j].input.style.backgroundColor = "#FFFFFF"
        }
    }

    for (let i = 0; i < 6; i++) {
        form_elements[i].link.onclick = null
        form_elements[i].link.onclick = async () => {
            const depot_resources = (
                await Planet.getDepot()
            ).getCurrentResources()

            if (form_elements[i].input.value) {
                form_elements[i].input.value = ""
                return false
            }
            switch (
                as(
                    window.document.forms
                        .namedItem("transaction")
                        ?.elements.namedItem("transaction_type"),
                    HTMLSelectElement
                ).value
            ) {
                case "plus":
                    if (delta[i] > 0) {
                        form_elements[i].input.value = Math.floor(
                            Math.min(delta[i], depot_resources.get(i))
                        ).toString()
                    } else {
                        form_elements[i].input.value = "0"
                    }
                    break
                case "minus":
                    if (delta[i] < 0) {
                        form_elements[i].input.value = Math.floor(
                            Math.min(
                                -delta[i],
                                depot_capacity[i] - depot_resources.get(i)
                            )
                        ).toString()
                    } else {
                        form_elements[i].input.value = "0"
                    }
                    break
                default:
                    break
            }
            return false
        }
        form_elements[i].input.onchange = check_transaction
    }

    as(
        window.document.forms
            .namedItem("transaction")
            ?.elements.namedItem("transaction_type"),
        HTMLSelectElement
    ).onchange = check_transaction

    const button_row = transaction_table.insertRow(
        transaction_table.rows.length - 1
    )
    const button_cell = button_row.insertCell(0)
    button_cell.colSpan = 3
    button_cell.className = "first"
    //    button_cell.innerHTML = '[ <a href="javascript:void(0);" id="bank__max">Deposit Max</a> ] - [ <a href="javascript:void(0);" id="bank__interest">Withdraw Interest</a> ] - [ <a href="javascript:void(0);" id="bank__overbook">Overbook</a> ]'
    button_cell.innerHTML =
        '<button type="button" id="bank__max">Deposit Max</button> <button type="button" id="bank__interest">Withdraw Interest</button> <button type="button" id="bank__overbook">Overbook</button>'
    button_cell.style.padding = "10px"
    const max_button = as(
        window.document.querySelector("#bank__max"),
        HTMLElement
    )
    const interest_button = as(
        window.document.querySelector("#bank__interest"),
        HTMLElement
    )
    const overbook_button = as(
        window.document.querySelector("#bank__overbook"),
        HTMLElement
    )

    max_button.style.margin = "5px"
    max_button.onclick = async () => {
        const depot_resources = (await Planet.getDepot()).getCurrentResources()
        as(
            window.document.forms
                .namedItem("transaction")
                ?.elements.namedItem("transaction_type"),
            HTMLSelectElement
        ).value = "plus"
        for (let i = 0; i < 6; i++) {
            if (delta[i] > 0) {
                form_elements[i].input.value = Math.floor(
                    Math.min(delta[i], depot_resources.get(i))
                ).toString()
            } else {
                form_elements[i].input.value = ""
            }
        }
    }

    interest_button.style.margin = "5px"
    interest_button.onclick = async () => {
        const depot_resources = (await Planet.getDepot()).getCurrentResources()

        as(
            window.document.forms
                .namedItem("transaction")
                ?.elements.namedItem("transaction_type"),
            HTMLSelectElement
        ).value = "minus"
        for (let i = 0; i < 6; i++) {
            if (delta[i] < 0) {
                form_elements[i].input.value = Math.floor(
                    Math.min(
                        -delta[i],
                        depot_capacity[i] - depot_resources.get(i)
                    )
                ).toString()
            } else {
                form_elements[i].input.value = ""
            }
        }
    }

    overbook_button.style.margin = "5px"
    overbook_button.onclick = async () => {
        const depot_resources = (await Planet.getDepot()).getCurrentResources()

        as(
            window.document.forms
                .namedItem("transaction")
                ?.elements.namedItem("transaction_type"),
            HTMLSelectElement
        ).value = "plus"
        for (let i = 0; i < 6; i++) {
            form_elements[i].input.value = Math.floor(
                Math.min(max_overbook[i], depot_resources.get(i))
            ).toString()
        }
    }

    const fmtr = new Intl.NumberFormat()

    const newInfoTableBody = (
        <tbody>
            <tr>
                <td className="first" colSpan={7} align="center">
                    <b>Bankauskunft für {await Account.getCurrentPlanet()}</b>
                </td>
            </tr>
            <tr>
                <td className="fourth"></td>
                <td className="fourth" align="center">
                    Roheisen
                </td>
                <td className="fourth" align="center">
                    Kristalle
                </td>
                <td className="fourth" align="center">
                    Frubin
                </td>
                <td className="fourth" align="center">
                    Orizin
                </td>
                <td className="fourth" align="center">
                    Frurozin
                </td>
                <td className="fourth" align="center">
                    Gold
                </td>
            </tr>

            <tr>
                <td className="second">Verfügbares Vermögen</td>
                <td className="second" align="right">
                    {fmtr.format(assets[0])}
                </td>
                <td className="second" align="right">
                    {fmtr.format(assets[1])}
                </td>
                <td className="second" align="right">
                    {fmtr.format(assets[2])}
                </td>
                <td className="second" align="right">
                    {fmtr.format(assets[3])}
                </td>
                <td className="second" align="right">
                    {fmtr.format(assets[4])}
                </td>
                <td className="second" align="right">
                    {fmtr.format(assets[5])}
                </td>
            </tr>
            {Array.from(transactions.entries()).map(([date, res], id) => (
                <tr key={id}>
                    <td className="second">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </td>
                    <td
                        className={res[0] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[0] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[0])}
                    </td>
                    <td
                        className={res[1] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[1] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[1])}
                    </td>
                    <td
                        className={res[2] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[2] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[2])}
                    </td>
                    <td
                        className={res[3] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[3] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[3])}
                    </td>
                    <td
                        className={res[4] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[4] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[4])}
                    </td>
                    <td
                        className={res[5] < 0 ? "red_second" : "second"}
                        align="right"
                        style={res[5] > 0 ? { backgroundColor: "green" } : {}}
                    >
                        {fmtr.format(res[5])}
                    </td>
                </tr>
            ))}

            <tr>
                <td className="second">Voraussichtliche Zinsen</td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[0]))}
                </td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[1]))}
                </td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[2]))}
                </td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[3]))}
                </td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[4]))}
                </td>
                <td className="second" align="right">
                    {fmtr.format(Math.floor(interest[5]))}
                </td>
            </tr>
            <tr>
                <td className="fourth">
                    <b>Gesamt</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[0]))}</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[1]))}</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[2]))}</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[3]))}</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[4]))}</b>
                </td>
                <td className="fourth" align="right">
                    <b>{fmtr.format(Math.floor(total[5]))}</b>
                </td>
            </tr>
            <tr>
                <td className="first" colSpan={7} align="center">
                    Nächste Berechnung {booking_time.toLocaleDateString()}{" "}
                    {booking_time.toLocaleTimeString()}
                </td>
            </tr>
        </tbody>
    )

    const root = createRoot(info_table)
    root.render(newInfoTableBody)
    info_table.width = "400px"
    transaction_table.width = "400px"
}

main()
