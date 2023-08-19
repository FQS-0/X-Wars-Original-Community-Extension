import {
    Alert,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import { LoadingButton } from "@mui/lab"
import { IShipyard } from "~src/lib/json/types/Shipyard.js"
import { StorageArea } from "~src/lib/StorageArea.js"
import { TShipyards } from "~src/lib/json/types/Shipyards.js"
import { Shipyard } from "~src/lib/Shipyard.js"
import { FavouriteRow } from "./Favourites.js"
import { EFavouriteType } from "~src/lib/json/types/FavouriteType.js"
import { TFavourites } from "~src/lib/json/types/Favourites.js"
import {
    Delete,
    ExpandLess,
    ExpandMore,
    LocalShipping,
    RocketLaunch,
    SettingsRemote,
    Star,
    StarOutline,
    VisibilityOff,
} from "@mui/icons-material"
import { IShip } from "~src/lib/json/types/Ship.js"
import {
    CrystalIcon,
    FrubinIcon,
    FrurozinIcon,
    GoldIcon,
    OrizinIcon,
    PigironICon,
} from "~src/lib/Icons.js"
import {
    FavouriteShipsProvider,
    addFavouriteShip,
    removeFavouriteShip,
    useFavouriteShips,
} from "~src/lib/context/FavouriteShips.js"

const fmt = new Intl.NumberFormat()

export const ShipyardAddForm = ({
    addShipyard,
}: {
    addShipyard: (sy: IShipyard) => Promise<boolean>
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
                <Grid item xs={12}>
                    <LoadingButton
                        variant="outlined"
                        loading={isWorking}
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
    planetFavs,
}: {
    shipyard: IShipyard
    removeShipyard: (sy: IShipyard) => void
    planetFavs: TFavourites
}) => {
    const favouriteShips = useFavouriteShips()

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h5" sx={{ my: 1 }}>
                    Werft {shipyard.name}
                    <IconButton onClick={() => removeShipyard(shipyard)}>
                        <Delete />
                    </IconButton>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Planeten
                </Typography>
            </Grid>
            {shipyard.planets.map((planet) => (
                <FavouriteRow
                    key={planet.coordinates}
                    owned={false}
                    favourite={{
                        name: shipyard.name,
                        coordinates: planet.coordinates,
                        type: EFavouriteType.FRIEND,
                    }}
                    isfavourite={
                        planetFavs.findIndex(
                            (f) => f.coordinates == planet.coordinates
                        ) > -1
                    }
                />
            ))}
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Schiffe
                </Typography>
            </Grid>
            {shipyard.ships.map((ship) => (
                <ShipElement
                    ship={ship}
                    shipyardName={shipyard.name}
                    key={ship.name}
                    isFavourite={
                        favouriteShips.findIndex(
                            (s) =>
                                s.shipyardName == shipyard.name &&
                                s.shipName == ship.name
                        ) > -1
                    }
                />
            ))}
        </>
    )
}

const ShipElement = ({
    ship,
    shipyardName,
    isFavourite,
}: {
    ship: IShip
    shipyardName: string
    isFavourite?: boolean
}) => {
    const [isExpanded, setExpanded] = useState(false)

    const handleTaggleExpanded = () => {
        setExpanded(!isExpanded)
    }

    const handleToggleIsFavourite = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation()
        if (isFavourite) {
            removeFavouriteShip({
                shipName: ship.name,
                shipyardName: shipyardName,
            })
        } else {
            addFavouriteShip({
                shipName: ship.name,
                shipyardName: shipyardName,
            })
        }
    }

    return (
        <Grid item xs={12} md={isExpanded ? 12 : 4}>
            <Card onClick={handleTaggleExpanded}>
                <CardHeader
                    action={
                        <Stack>
                            <IconButton onClick={handleToggleIsFavourite}>
                                {isFavourite ? <Star /> : <StarOutline />}
                            </IconButton>
                            <IconButton onClick={handleTaggleExpanded}>
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Stack>
                    }
                    title={
                        <Typography>
                            {ship.name}{" "}
                            {ship.tt && <VisibilityOff fontSize="inherit" />}{" "}
                            {ship.lkom && <SettingsRemote fontSize="inherit" />}{" "}
                            {ship.carrier > 0 ? (
                                <RocketLaunch fontSize="inherit" />
                            ) : (
                                ship.cargo > 0 && (
                                    <LocalShipping fontSize="inherit" />
                                )
                            )}
                        </Typography>
                    }
                    subheader={`${ship.att} / ${ship.def} ${ship.speed}% ${ship.engine}`}
                />
                {isExpanded && (
                    <CardContent>
                        <Stack sx={{ mb: 2 }}>
                            {ship.lkom && (
                                <Typography>
                                    Langstreckenkommunikation
                                </Typography>
                            )}
                            {ship.tt && (
                                <Typography>Tarnvorrichtung</Typography>
                            )}
                            {ship.cargo > 0 && (
                                <Typography>
                                    Fracht {fmt.format(ship.cargo)}
                                </Typography>
                            )}
                            {ship.carrier > 0 && (
                                <Typography>
                                    Trägerdeck {fmt.format(ship.carrier)}
                                </Typography>
                            )}
                            {ship.troups > 0 && (
                                <Typography>
                                    Truppen {fmt.format(ship.troups)}
                                </Typography>
                            )}
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <PigironICon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.fe)}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <CrystalIcon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.kr)}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <FrubinIcon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.fr)}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <OrizinIcon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.or)}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <FrurozinIcon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.fo)}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                md={2}
                                justifyContent="space-between"
                            >
                                <GoldIcon />
                                <Typography align="right">
                                    {fmt.format(ship.resources.go)}
                                </Typography>
                            </Grid>
                            {ship.requirements.map((req) => (
                                <Grid
                                    container
                                    item
                                    xs={6}
                                    md={3}
                                    justifyContent="space-between"
                                    key={req.specialisation}
                                >
                                    <Typography>
                                        {req.specialisation}
                                    </Typography>
                                    <Typography>{req.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                )}
            </Card>
        </Grid>
    )
}

export const ShipyardOptions = () => {
    const [shipyards, setShipyards] = useState(null as IShipyard[] | null)
    const [planetFavs, setPlanetFavs] = useState<TFavourites | null>(null)

    const updateShipyards = async () => {
        const storesShipyards = await StorageArea.shipyards.get()
        setShipyards(storesShipyards)
    }

    const updatePlanetFavs = async () => {
        setPlanetFavs(await StorageArea.favouriteFavourites.tryGet([]))
    }

    const addShipyard = async (sy: IShipyard): Promise<boolean> => {
        let rval = false
        const storedShipyards =
            (await StorageArea.shipyards.get()) ?? ([] as TShipyards)

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

    const removeShipyard = async (sy: IShipyard) => {
        const storedShipyards =
            (await StorageArea.shipyards.get()) ?? ([] as TShipyards)

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
        updatePlanetFavs()
        const unsubscribe = StorageArea.shipyards.subscribe(updateShipyards)
        const unsubscribePlanetFavs =
            StorageArea.favouriteFavourites.subscribe(updatePlanetFavs)
        return () => {
            unsubscribe()
            unsubscribePlanetFavs()
        }
    }, [])

    return (
        <FavouriteShipsProvider>
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
                    planetFavs={planetFavs || []}
                />
            ))}
        </FavouriteShipsProvider>
    )
}
