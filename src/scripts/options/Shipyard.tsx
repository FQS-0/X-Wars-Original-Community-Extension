import { Alert, Button, Grid, TextField, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import { LoadingButton } from "@mui/lab"
import Shipyard from "~src/lib/Shipyard.js"
import { Shipyard as SY } from "~src/lib/json/types/Shipyard.js"
import { StorageArea } from "~src/lib/StorageArea.js"
import { Shipyards } from "~src/lib/json/types/Shipyards.js"

export const ShipyardAddForm = ({
    addShipyard,
}: {
    addShipyard: (sy: SY) => Promise<boolean>
}) => {
    const [isWorking, setisWorking] = useState(false)
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const [url, setUrl] = useState("")

    const handleChangeUrl = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setUrl(event.target.value)

    const handleSubmit = () => {
        setError("")
        setMsg("")

        if (url === "") {
            setError("Bitte eine URL angeben.")
            return
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
            setError("Bitte eine gültige URL angeben.")
            return
        }

        setisWorking(true)
        fetch(url, { cache: "no-store" })
            .then((response) => handleResponse(response))
            .catch((reason) => {
                setError("Die angegebene URL konnte nicht abgerufen werden")
                console.error(reason)
            })
            .finally(() => {
                setisWorking(false)
            })
    }

    const handleResponse = async (response: Response) => {
        if (!response.ok) {
            setError("Die angegebene URL konnte nicht abgerufen werden")
            console.error("HTTP status: ", response.status)
            return
        }

        const sy = Shipyard.parse(await response.text())
        const res = await addShipyard(sy)
        setUrl("")
        if (res) setMsg("Werft hinzugefügt")
        else setMsg("Werft aktualisiert")
    }

    return (
        <>
            {error != "" && (
                <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                </Grid>
            )}{" "}
            {msg != "" && (
                <Grid item xs={12}>
                    <Alert severity="success">{msg}</Alert>
                </Grid>
            )}
            <Grid container item spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="URL"
                        fullWidth
                        value={url}
                        disabled={isWorking}
                        onChange={handleChangeUrl}
                    />
                </Grid>
                <Grid item xs={2}>
                    <LoadingButton
                        variant="outlined"
                        loading={isWorking}
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                    >
                        Hinzufügen
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    )
}

export const ShipyardElement = ({
    shipyard,
    removeShipyard,
}: {
    shipyard: SY
    removeShipyard: (sy: SY) => void
}) => {
    return (
        <>
            <Grid item xs={10}>
                <Typography variant="h5" sx={{ my: 1 }}>
                    Werft {shipyard.name}
                </Typography>
            </Grid>{" "}
            <Grid item xs={2}>
                <Button
                    variant="outlined"
                    onClick={() => removeShipyard(shipyard)}
                >
                    Entfernen
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Planeten
                </Typography>
            </Grid>
            {shipyard.planets.map((planet) => (
                <Grid item xs={2} key={planet.coordinates}>
                    {planet.coordinates}
                </Grid>
            ))}
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Schiffe
                </Typography>
            </Grid>
            {shipyard.ships.map((ship) => (
                <Grid item xs={2} key={ship.name}>
                    {ship.name}
                </Grid>
            ))}
        </>
    )
}

export const ShipyardOptions = () => {
    const [shipyards, setShipyards] = useState(null as SY[] | null)

    const updateShipyards = async () => {
        const storesShipyards = await StorageArea.shipyards.get()
        setShipyards(storesShipyards)
    }

    const addShipyard = async (sy: SY): Promise<boolean> => {
        let rval = false
        const storedShipyards =
            (await StorageArea.shipyards.get()) ?? ([] as Shipyards)

        const idx = storedShipyards.findIndex(
            (shipyard) => shipyard.name == sy.name
        )
        if (idx === -1) {
            rval = true
            storedShipyards.push(sy)
        } else {
            storedShipyards[idx] = sy
        }
        await StorageArea.shipyards.set(storedShipyards)

        return rval
    }

    const removeShipyard = async (sy: SY) => {
        const storedShipyards =
            (await StorageArea.shipyards.get()) ?? ([] as Shipyards)

        const idx = storedShipyards.findIndex(
            (shipyard) => shipyard.name === sy.name
        )
        if (idx > -1) {
            storedShipyards.splice(idx, 1)
        }
        await StorageArea.shipyards.set(storedShipyards)
    }

    useEffect(() => {
        updateShipyards()
        StorageArea.shipyards.subscribe(updateShipyards)
        return () => {
            StorageArea.shipyards.unsubscribe()
        }
    }, [])

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h4" sx={{ my: 3 }}>
                    Werften
                </Typography>
            </Grid>
            <ShipyardAddForm addShipyard={addShipyard} />
            {shipyards?.map((sy) => (
                <ShipyardElement
                    key={sy.name}
                    shipyard={sy}
                    removeShipyard={removeShipyard}
                />
            ))}
        </>
    )
}
