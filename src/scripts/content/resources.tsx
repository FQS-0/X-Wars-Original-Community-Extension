import { Account } from "~/src/lib/Account.js"
import { Planet } from "~/src/lib/Planet.js"
import { createRoot } from "react-dom/client"

async function main() {
    const resTable = window.document.querySelector('table[cellspacing="1"')
        ?.parentElement?.parentElement?.parentElement?.parentElement

    if (!resTable) throw "resources.ts: table not found"

    if (!(resTable instanceof HTMLTableElement))
        throw "resources.ts: table is no table"

    const total = [0, 0, 0, 0, 0, 0]
    const formatter = new Intl.NumberFormat()

    const planets = await Account.getPlanets()

    const planetHTML = await Promise.all(
        planets.map(async (planet, index) => {
            const resPerHour = (await Planet.getDepot(planet))?.perHour
            const resourceHTML = resPerHour ? (
                <>
                    {resPerHour.toArray().map((resource, index) => {
                        total[index] += resource * 24
                        return (
                            <td
                                key={index}
                                className={index % 2 ? "first" : "second"}
                                align="right"
                            >
                                {formatter.format(resource * 24)}
                            </td>
                        )
                    })}
                </>
            ) : (
                <>
                    <td className="second" align="right">
                        ?
                    </td>
                    <td className="first" align="right">
                        ?
                    </td>
                    <td className="second" align="right">
                        ?
                    </td>
                    <td className="first" align="right">
                        ?
                    </td>
                    <td className="second" align="right">
                        ?
                    </td>
                    <td className="first" align="right">
                        ?
                    </td>
                </>
            )
            return (
                <tr key={index}>
                    <td className="first">{planet}</td>
                    {resourceHTML}
                </tr>
            )
        })
    )

    const totalHTML = (
        <tr>
            <td className="first">
                <b>Total</b>
            </td>
            {total.map((resource, index) => {
                return (
                    <td
                        key={index}
                        align="right"
                        className={`fourth ${index % 2 ? "second" : "first"}`}
                    >
                        <b>{formatter.format(resource)}</b>
                    </td>
                )
            })}
        </tr>
    )

    const tableHTML = (
        <td colSpan={8}>
            <table width="100%" cellPadding={1} cellSpacing={1} border={0}>
                <tbody>
                    <tr>
                        <td colSpan={7} className="second" align="center">
                            <b>Resources per day</b>
                        </td>
                    </tr>
                    {planetHTML}
                    {totalHTML}
                </tbody>
            </table>
        </td>
    )

    const domNode = createRoot(resTable.insertRow(0))
    domNode.render(tableHTML)
}

main()
