import { StorageArea } from "~src/lib/StorageArea.js"

async function addSpyObsTradeButtons() {
    const resultTable = window.document.querySelector<HTMLTableElement>(
        'table[cellspacing="1"]:nth-of-type(2)'
    )

    if (resultTable) {
        const id = await StorageArea.sessionId.tryGet()

        resultTable.rows[0].cells[0].colSpan = 4
        resultTable.rows[1].cells[2].colSpan = 2

        Array.from(resultTable.rows)
            .slice(2)
            .forEach((row) => {
                const coordinates = row.cells[0].innerText
                const [, galaxy, system, planet] = (
                    coordinates.match(/(\d+)x(\d+)x(\d+)/) || [
                        "-1",
                        "-1",
                        "-1",
                        "-1",
                    ]
                ).map((x) => parseInt(x))

                const newCell = row.insertCell()
                newCell.width = "60px"
                newCell.align = "center"
                newCell.className = "second"

                const spyAnchor = window.document.createElement(
                    "A"
                ) as HTMLAnchorElement
                spyAnchor.href = `index.php?id=${id}&method=c3B5LmNvcmU=&art=c2hvcnRvcmRlcg==&extern=&kogal=${galaxy}&kosys=${system}&kopl=${planet}`
                const spyImg = window.document.createElement(
                    "IMG"
                ) as HTMLImageElement
                spyImg.src = "/extern/images/terraner/spy.jpg"
                spyImg.border = "0"
                spyImg.width = 15
                spyImg.height = 15
                spyAnchor.append(spyImg)

                const tradeAnchor = window.document.createElement(
                    "A"
                ) as HTMLAnchorElement
                tradeAnchor.href = `index.php?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&galaxy=${galaxy}&system=${system}&planet=${planet}`
                const tradeImg = window.document.createElement(
                    "IMG"
                ) as HTMLImageElement
                tradeImg.src = "/extern/images/terraner/trade.jpg"
                tradeImg.border = "0"
                tradeImg.width = 15
                tradeImg.height = 15
                tradeAnchor.append(tradeImg)

                const obsAnchor = window.document.createElement(
                    "A"
                ) as HTMLAnchorElement
                obsAnchor.href = `index.php?id=${id}&method=c3B5LmNvcmU=&art=c2hvcnRvcmRlcg==&extern=&type=observer&kogal=${galaxy}&kosys=${system}&kopl=${planet}`
                const obsImg = window.document.createElement(
                    "IMG"
                ) as HTMLImageElement
                obsImg.src = "/extern/images/terraner/observe.jpg"
                obsImg.border = "0"
                obsImg.width = 15
                obsImg.height = 15
                obsAnchor.append(obsImg)

                const space1 = window.document.createTextNode(" ")
                const space2 = window.document.createTextNode(" ")

                newCell.append(spyAnchor)
                newCell.append(space1)
                newCell.append(tradeAnchor)
                newCell.append(space2)
                newCell.append(obsAnchor)
            })
    }
}

addSpyObsTradeButtons()
