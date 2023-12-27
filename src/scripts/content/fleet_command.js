function onload_flotten__giveorder() {
    console.log("Flotten::Befehle")

    const hinflugElement = document.querySelector(
        'form[name="formular"] table table tr:nth-child(7) td:nth-child(2)'
    )
    const rueckflugElement = document.querySelector(
        'form[name="formular"] table table tr:nth-child(8) td:nth-child(2)'
    )

    if (hinflugElement && rueckflugElement) {
        console.log("Flotten::Befehle !!!")

        const ankunftElement = document.createElement("td")
        ankunftElement.style.textAlign = "right"
        ankunftElement.style.whiteSpace = "nowrap"
        ankunftElement.style.paddingRight = "1em"
        hinflugElement.parentNode.insertBefore(
            ankunftElement,
            hinflugElement.nextSibling
        )

        const rueckkehrElement = document.createElement("td")
        rueckkehrElement.style.textAlign = "right"
        rueckkehrElement.whiteSpace = "nowrap"
        rueckkehrElement.style.paddingRight = "1em"
        rueckflugElement.parentNode.insertBefore(
            rueckkehrElement,
            rueckflugElement.nextSibling
        )

        const updateZeit = function () {
            console.log("update")

            const hinflugMatch = hinflugElement.textContent.match(
                /(?<stunden>\d+):(?<minuten>\d+):(?<sekunden>\d+)/
            )
            const ankunft = new Date(Date.now())

            if (hinflugMatch) {
                ankunft.setHours(
                    ankunft.getHours() + parseInt(hinflugMatch.groups.stunden)
                )
                ankunft.setMinutes(
                    ankunft.getMinutes() + parseInt(hinflugMatch.groups.minuten)
                )
                ankunft.setSeconds(
                    ankunft.getSeconds() +
                        parseInt(hinflugMatch.groups.sekunden)
                )
                ankunftElement.innerText = `${ankunft.toLocaleTimeString()}`
            }

            const rueckflugMatch = rueckflugElement.textContent.match(
                /(?<stunden>\d+):(?<minuten>\d+):(?<sekunden>\d+)/
            )
            if (rueckflugMatch) {
                const rueckkehr = ankunft
                rueckkehr.setHours(
                    rueckkehr.getHours() +
                        parseInt(rueckflugMatch.groups.stunden)
                )
                rueckkehr.setMinutes(
                    rueckkehr.getMinutes() +
                        parseInt(rueckflugMatch.groups.minuten)
                )
                rueckkehr.setSeconds(
                    rueckkehr.getSeconds() +
                        parseInt(rueckflugMatch.groups.sekunden)
                )
                rueckkehrElement.innerText = `${rueckkehr.toLocaleTimeString()}`
            }
        }

        updateZeit()

        window.setInterval(updateZeit, 1000) // Alle 1000 Millisekunden (1 Sekunde) aktualisieren
    }
}

onload_flotten__giveorder()
