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
import { ChangeEvent, useState } from "react"
import { LoadingButton } from "@mui/lab"
import { IShipyard } from "~src/lib/json/types/Shipyard.js"
import { FavouriteRow } from "./Favourites.js"
import { EFavouriteType } from "~src/lib/json/types/FavouriteType.js"
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
import { FavouriteFavouritesProvider } from "~src/lib/context/FavouriteFavourites.js"
import {
    fetchShipyard,
    removeShipyard,
    useShipyards,
} from "~src/lib/state/Shipyards.js"

const fmt = new Intl.NumberFormat()

export const ShipyardAddForm = () => {
    const [isWorking, setisWorking] = useState(false)
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const [url, setUrl] = useState("")

    const handleChangeUrl = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setUrl(event.target.value)

    const handleSubmit = async () => {
        setError("")
        setMsg("")

        try {
            setisWorking(true)
            if (url === "") {
                throw "Bitte eine URL angeben."
            }
            const u = new URL(url)
            if (u.protocol !== "https:" && u.protocol !== "http:") {
                throw "Bitte eine gültige URL angeben."
            }
            const isNewShipyard = await fetchShipyard(u)
            if (isNewShipyard) setMsg("Werft hinzugefügt")
            else setMsg("Werft aktualisiert")
            setUrl("")
        } catch (e) {
            if (typeof e === "string") {
                setMsg(e)
            } else if (e instanceof TypeError) {
                setMsg("Bitte eine gültige URL angeben.")
                console.error(e)
            } else if (e instanceof Error) {
                setMsg(e.message)
            }
        } finally {
            setisWorking(false)
        }
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

export const ShipyardElement = ({ shipyard }: { shipyard: IShipyard }) => {
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
                <Typography variant="subtitle2">
                    {shipyard.url}
                    {shipyard.lastUpdate &&
                        ` - ${new Date(
                            shipyard.lastUpdate
                        ).toLocaleDateString()} ${new Date(
                            shipyard.lastUpdate
                        ).toLocaleTimeString()}`}
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
    const shipyards = useShipyards()

    return (
        <FavouriteShipsProvider>
            <FavouriteFavouritesProvider>
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ my: 3 }}>
                        Werften
                    </Typography>
                </Grid>
                <ShipyardAddForm />
                {shipyards?.map((sy) => (
                    <ShipyardElement key={sy.name} shipyard={sy} />
                ))}
            </FavouriteFavouritesProvider>
        </FavouriteShipsProvider>
    )
}
