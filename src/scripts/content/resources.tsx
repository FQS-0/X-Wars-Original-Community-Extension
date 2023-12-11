import { createRoot } from "react-dom/client"
import { StorageArea } from "~src/lib/StorageArea.js"
import { Depot } from "~src/lib/Resource.js"

async function main() {
    const resTable = window.document.querySelector('table[cellspacing="1"')
        ?.parentElement?.parentElement?.parentElement?.parentElement

    if (!resTable) throw "resources.ts: table not found"

    if (!(resTable instanceof HTMLTableElement))
        throw "resources.ts: table is no table"

    const total = [0, 0, 0, 0, 0, 0]
    let totalBZ = 0;
    const formatter = new Intl.NumberFormat()

    const planets = await StorageArea.currentId.planets.tryGet()

    const planetHTML = await Promise.all(
        planets.map(async (planet, index) => {
            const depotData = await StorageArea.currentId
                .planet(planet)
                .depot.get()
            const constructionData = await StorageArea.currentId
                .planet(planet)
                .construction.get()
            const resPerHour = depotData
                ? Depot.fromObject(depotData).perHour
                : null
            let resPerDayPerPlanet = 0;
            totalBZ += constructionData?.bz ?? 0
            const resourceHTML = resPerHour ? (
                <>
                    {resPerHour.toArray().map((resource, index) => {
                        total[index] += resource * 24
                        resPerDayPerPlanet += resource * 24
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
                    <td className="second" align="right">
                        <b>{formatter.format(resPerDayPerPlanet)}</b>
                    </td>
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
                    <td className="second" align="right">
                        ?
                    </td>
                </>
            )
            return (
                <tr key={index}>
                    <td className="second">{planet}</td>
                    <td className="first" align="right">{constructionData?.bz}</td>
                    {resourceHTML}
                </tr>
            )
        })
    )

    const sumTotal = total.reduce((sumTotal, current) => sumTotal + current,0)

    const totalHTML = (
        <tr>
            <td className="second">
                <b>Total</b>
            </td>
            <td className="first" align="right">
                <b>{totalBZ}</b>
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
            <td className="first" align="right">
                <b>{formatter.format(sumTotal)}</b>
            </td>
        </tr>
    )

    const tableHTML = (
        <td colSpan={9}>
            <table width="100%" cellPadding={1} cellSpacing={1} border={0}>
                <tbody>
                    <tr>
                        <td colSpan={9} className="second" align="center">
                            <b>Resources per day</b>
                        </td>
                    </tr>
                    <tr>
                        <td className="second">
                            Planet
                        </td>
                        <td className="first" align="right">
                            BZ
                        </td>
                        <td className="second" align="right">
                            Fe
                        </td>
                        <td className="first" align="right">
                            Kris
                        </td>
                        <td className="second" align="right">
                            Frub
                        </td>
                        <td className="first" align="right">
                            Ori
                        </td>
                        <td className="second" align="right">
                            Fruz
                        </td>
                        <td className="first" align="right">
                            Gold
                        </td>
                        <td className="first" align="right">
                            <b>Summe</b>
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
