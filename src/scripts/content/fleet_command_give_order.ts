import { StorageArea } from "~src/lib/StorageArea.js"

function flotten__extract_koordinates(text: string) {
    const regex = /\d+x\d+x\d+/
    const match = text.match(regex)
    if (match) {
        return match[0]
    }
    return ""
}

function flotten__giveorder__repeatAttack() {
    const targetElement = document.querySelector<HTMLTableCellElement>(
        'td[colspan="4"][class="fourth"]'
    )
    const targetInput = document.querySelector<HTMLInputElement>(
        'input[name="orderdata[targetvis]"'
    )
    const attackOption = document.querySelector<HTMLInputElement>(
        'input[value="attack"'
    )

    if (targetElement && targetInput && attackOption) {
        targetInput.value = flotten__extract_koordinates(
            targetElement.innerText
        )
//        attackOption.checked = true
    } else {
        console.error("could not set repeat attack")
    }
}

async function insertButtonAndSelects() {
    try {
        // Wiederholungsangriff Button hinzufügen
        console.log("RepeatAttack button")

        const coordsInput = document.querySelector<HTMLInputElement>(
            'input[name="orderdata[targetvis]"][type="text"]'
        )

        if (!coordsInput?.parentNode)
            throw new Error("coordinate input not found")

        const button = document.createElement("input")
        button.type = "button"
        button.value = "Letzte Koords"
        button.style.fontSize = "smaller"
        button.style.backgroundColor = "darkorange"
        button.addEventListener("click", flotten__giveorder__repeatAttack)
        coordsInput.parentNode.appendChild(button)

        const favourites = await StorageArea.favourites.tryGet([])
        const favAllyFavourites = await StorageArea.favouriteFavourites.tryGet(
            []
        )
        const allFavourites = favourites.concat(
            favAllyFavourites.filter(
                (allyFav) =>
                    !favourites.find(
                        (fav) => allyFav.coordinates == fav.coordinates
                    )
            )
        )
        const allAllyFavourites = (
            await StorageArea.allianceFavourites.tryGet([])
        )
            .map((list) => list.favourites)
            .flat(1)
            .filter(
                (allyFav) =>
                    !allFavourites.find(
                        (fav) => allyFav.coordinates == fav.coordinates
                    )
            )

        const friendSelect = document.createElement("select")
        friendSelect.onchange = () => {
            coordsInput.value = friendSelect.value
        }
        ;[
            { coordinates: "", name: "Freunde", type: "FRIEND" },
            { coordinates: "", name: "- Favouriten", type: "FRIEND" },
        ]
            .concat(
                allFavourites,
                { coordinates: "", name: "- Sonstige", type: "FRIEND" },
                allAllyFavourites
            )
            .filter((fav) => fav.type == "FRIEND")
            .forEach((fav) => {
                const opt = document.createElement("option")
                opt.innerText = fav.coordinates
                    ? `${fav.coordinates} - ${fav.name}`
                    : fav.name
                opt.value = fav.coordinates
                friendSelect.add(opt)
            })
        coordsInput.parentNode.appendChild(friendSelect)

        const foeSelect = document.createElement("select")
        foeSelect.onchange = () => {
            coordsInput.value = foeSelect.value
        }
        ;[
            { coordinates: "", name: "Feinde", type: "FOE" },
            { coordinates: "", name: "- Favouriten", type: "FOE" },
        ]
            .concat(
                allFavourites,
                { coordinates: "", name: "- Sonstige", type: "FOE" },
                allAllyFavourites
            )
            .filter((fav) => fav.type == "FOE")
            .forEach((fav) => {
                const opt = document.createElement("option")
                opt.innerText = fav.coordinates
                    ? `${fav.coordinates} - ${fav.name}`
                    : fav.name
                opt.value = fav.coordinates
                foeSelect.add(opt)
            })
        coordsInput.parentNode.appendChild(foeSelect)
    } catch (e) {
        console.error(e)
    }
}

insertButtonAndSelects()
