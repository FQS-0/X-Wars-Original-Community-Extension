import {
    Box,
    Button,
    Container,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    Link,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material"
import { createRoot } from "react-dom/client"
import { EFavouriteType } from "~src/lib/json/types/FavouriteType.js"
import theme from "./theme.js"
import { ChangeEvent, useEffect, useState } from "react"
import { IResources } from "~src/lib/json/types/Resources.js"
import { Updater, useImmer } from "use-immer"
import { formatResource } from "~src/lib/Resource.js"
import { StorageArea } from "~src/lib/StorageArea.js"
import { IShip } from "~src/lib/json/types/Ship.js"
import { useShipyards } from "~src/lib/state/Shipyards.js"
import { ArrowCircleUp, ExpandLess, ExpandMore } from "@mui/icons-material"
import { IShipyard } from "~src/lib/json/types/Shipyard.js"
import {
    FavouriteShipsProvider,
    useFavouriteShips,
} from "~src/lib/context/FavouriteShips.js"
import { DepotProvider, useDepot } from "~src/lib/context/Depot.js"
import { useFavourites } from "~src/lib/state/Favourites.js"
import { useAllianceFavouritesList } from "~src/lib/state/AllianceFavourites.js"
import {
    FavouriteFavouritesProvider,
    useFavouriteFavourites,
} from "~src/lib/context/FavouriteFavourites.js"

const TradePage = ({ links }: { links: { name: string; href: string }[] }) => {
    return (
        <Container maxWidth="md" style={{ marginTop: 20 }}>
            <Grid container spacing={0} rowSpacing={1}>
                <Grid item xs={12}>
                    <Box
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h4">Handel</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {links.map((link) => (
                            <Link
                                href={link.href}
                                key={link.name}
                                style={{ marginRight: 10 }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </Box>
                </Grid>
                <DepotProvider>
                    <FavouriteFavouritesProvider>
                        <TradeForm />
                    </FavouriteFavouritesProvider>
                </DepotProvider>
            </Grid>
        </Container>
    )
}

const ShipyardElement = ({
    shipyard,
    shipcount,
    handleShipSet,
    transportFee,
}: {
    shipyard: IShipyard
    shipcount: number
    handleShipSet: (ship: IShip, shipCount: number) => void
    transportFee: number
}) => {
    const depot = useDepot()
    const [isExpanded, setExpanded] = useState(false)
    const favouriteShips = useFavouriteShips()

    const handleToggleIsExpanded = () => {
        setExpanded(!isExpanded)
    }

    return (
        <Grid item xs={12} key={shipyard.name}>
            <Typography variant="h6" style={{ marginTop: 20 }}>
                {shipyard.name}{" "}
                <IconButton onClick={handleToggleIsExpanded}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Typography>
            <Table size="small">
                <TableBody>
                    {shipyard.ships
                        .filter(
                            (ship) =>
                                isExpanded ||
                                favouriteShips.findIndex(
                                    (fav) =>
                                        fav.shipyardName == shipyard.name &&
                                        fav.shipName == ship.name
                                ) > -1
                        )
                        .map((ship) => (
                            <TableRow key={ship.name}>
                                <TableCell>
                                    <Typography>{ship.name}</Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.fe *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().fe ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.fe * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.kr *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().kr ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.kr * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.fr *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().fr ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.fr * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.or *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().or ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.or * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.fo *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().fo ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.fo * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"} align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            ship.resources.go *
                                                shipcount *
                                                (1 + transportFee) >
                                            (depot?.getCurrentResources().go ??
                                                0)
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {formatResource(
                                            ship.resources.go * shipcount
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell width={"10%"}>
                                    <IconButton
                                        onClick={handleShipSet.bind(
                                            null,
                                            ship,
                                            shipcount
                                        )}
                                    >
                                        <ArrowCircleUp />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Grid>
    )
}

const ShipyardsElement = ({
    handleShipSet,
    transportFee,
}: {
    handleShipSet: (ship: IShip, shipCount: number) => void
    transportFee: number
}) => {
    const shipyards = useShipyards()
    const [shipcount, setShipcount] = useState(1)

    const handleShipCountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setShipcount(parseFloat(event.target.value))
    }

    return (
        <>
            <Grid item xs={12} sx={{ mt: "15px" }}>
                <Typography variant="h5">Werften</Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <FormLabel>Anzahl Schiffe</FormLabel>
                    <RadioGroup
                        row
                        value={shipcount}
                        onChange={handleShipCountChange}
                    >
                        <FormControlLabel
                            value="0.25"
                            control={<Radio />}
                            label="1/4"
                        />
                        <FormControlLabel
                            value="0.5"
                            control={<Radio />}
                            label="1/2"
                        />
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="1"
                        />
                        <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="2"
                        />
                        <FormControlLabel
                            value="5"
                            control={<Radio />}
                            label="5"
                        />
                        <FormControlLabel
                            value="10"
                            control={<Radio />}
                            label="10"
                        />
                        <FormControlLabel
                            value="20"
                            control={<Radio />}
                            label="20"
                        />
                        <FormControlLabel
                            value="50"
                            control={<Radio />}
                            label="50"
                        />
                        <FormControlLabel
                            value="100"
                            control={<Radio />}
                            label="100"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <FavouriteShipsProvider>
                {shipyards.map((shipyard) => (
                    <ShipyardElement
                        key={shipyard.name}
                        shipyard={shipyard}
                        shipcount={shipcount}
                        handleShipSet={handleShipSet}
                        transportFee={transportFee}
                    />
                ))}
            </FavouriteShipsProvider>
        </>
    )
}

type DestinationOption = {
    name: string
    value: string
}

const TradeForm = () => {
    const [destination, setDestination] = useState("")
    const [comment, setComment] = useState("")
    const [commentWithTime, setCommentWithTime] = useState("")
    const [sendResources, setSendResources] = useImmer({
        fe: 0,
        kr: 0,
        fr: 0,
        or: 0,
        fo: 0,
        go: 0,
    } as IResources)
    const [demandResources, setDemandResources] = useImmer({
        fe: 0,
        kr: 0,
        fr: 0,
        or: 0,
        fo: 0,
        go: 0,
    } as IResources)
    const depot = useDepot()
    const favourites = useFavourites()
    const allianceFavourites = useAllianceFavouritesList()
    const favouriteFavourites = useFavouriteFavourites()
    const shipyards = useShipyards()
    const [destOptions, setDestOptions] = useState<DestinationOption[]>([])

    const populateOptions = async () => {
        const options: DestinationOption[] = []

        options.push({ name: "--- Eigene Planeten", value: "" })
        const planets = await StorageArea.currentId.planets.get()
        const currentPlanet = await StorageArea.currentId.currentPlanet.get()
        planets
            ?.filter((planet) => planet != currentPlanet)
            .map((planet) => {
                return { name: planet, value: planet }
            })
            .sort((a, b) => parseInt(a.value) - parseInt(b.value))
            .forEach((option) => {
                options.push(option)
            })

        const all: DestinationOption[] = []
        allianceFavourites.forEach((list) => {
            all.push(
                ...list.favourites.map((fav) => {
                    return {
                        name: `${fav.coordinates} - ${fav.name}`,
                        value: fav.coordinates,
                    }
                })
            )
        })
        shipyards.forEach((shipyard) => {
            all.push(
                ...shipyard.planets.map((planet) => {
                    return {
                        name: `${planet.coordinates} - ${shipyard.name}`,
                        value: planet.coordinates,
                    }
                })
            )
        })

        options.push({ name: "--- Favoriten", value: "" })

        options.push(
            ...all
                .filter(
                    (option) =>
                        favouriteFavourites.findIndex(
                            (fav) => fav.coordinates == option.value
                        ) > -1
                )
                .concat(
                    favourites
                        .filter((fav) => fav.type == EFavouriteType.FRIEND)
                        .map((fav) => {
                            return {
                                name: `${fav.coordinates} - ${fav.name}`,
                                value: fav.coordinates,
                            }
                        })
                )
                .sort((a, b) => parseInt(a.value) - parseInt(b.value))
        )

        options.push({ name: "--- Sonstige", value: "" })

        options.push(
            ...all
                .filter(
                    (option) =>
                        options.findIndex((o) => o.value == option.value) == -1
                )
                .sort((a, b) => parseInt(a.value) - parseInt(b.value))
        )

        setDestOptions(options)
    }
    useEffect(() => {
        populateOptions()
    }, [favourites, allianceFavourites, shipyards, favouriteFavourites])

    const transportFeeMatch = window.document
        .querySelector(
            'form[name="formular"] > table > tbody > tr:nth-child(2) > td:nth-child(3)'
        )
        ?.textContent?.match(/[\d]+(\.\d+)?/)
    if (!transportFeeMatch) throw "Error: transport cost not found"
    const transportFee = parseFloat(transportFeeMatch[0]) / 100.0

    const formAction = window.document.forms.namedItem("formular")?.action
    if (!formAction) throw new Error("Formular not found")

    const handleChangeDestination = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setDestination(e.target.value)
    }

    const handleChangeComment = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setComment(e.target.value)
    }
    const handleResChange = (
        key: keyof IResources,
        updater: Updater<IResources>,
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        updater((res) => {
            if (e.target.value === "") res[key] = 0
            else res[key] = parseInt(e.target.value)
            if (res[key] < 0) res[key] = 0
        })
    }

    const handleSendFeChange = handleResChange.bind(
        null,
        "fe",
        setSendResources
    )
    const handleSendKrChange = handleResChange.bind(
        null,
        "kr",
        setSendResources
    )
    const handleSendFrChange = handleResChange.bind(
        null,
        "fr",
        setSendResources
    )
    const handleSendOrChange = handleResChange.bind(
        null,
        "or",
        setSendResources
    )
    const handleSendFoChange = handleResChange.bind(
        null,
        "fo",
        setSendResources
    )
    const handleSendGoChange = handleResChange.bind(
        null,
        "go",
        setSendResources
    )

    const handleDemandFeChange = handleResChange.bind(
        null,
        "fe",
        setDemandResources
    )
    const handleDemandKrChange = handleResChange.bind(
        null,
        "kr",
        setDemandResources
    )
    const handleDemandFrChange = handleResChange.bind(
        null,
        "fr",
        setDemandResources
    )
    const handleDemandOrChange = handleResChange.bind(
        null,
        "or",
        setDemandResources
    )
    const handleDemandFoChange = handleResChange.bind(
        null,
        "fo",
        setDemandResources
    )
    const handleDemandGoChange = handleResChange.bind(
        null,
        "go",
        setDemandResources
    )

    const handlePreSubmit = () => {
        if (
            demandResources.fe +
                demandResources.kr +
                demandResources.fr +
                demandResources.or +
                demandResources.fo +
                demandResources.go ==
            0
        )
            setDemandResources((res) => {
                res.fe = 1
            })
        setCommentWithTime(`${comment} ## ${new Date().toLocaleTimeString()}`)
    }

    // const handleCheck = async () => {
    //     const result = await fetchTradeTradeCheck({
    //         url: formAction,
    //         data: {
    //             target: destination,
    //             trade_comment: commentWithTime,
    //             tf_res: sendResources,
    //             tt_res: demandResources,
    //         },
    //     })
    //     console.log(result)
    // }

    const handleDemandGoMaxMin = () => {
        if (demandResources.go == 0)
            setDemandResources((res) => {
                res.go = 99999999
            })
        else
            setDemandResources((res) => {
                res.go = 0
            })
    }

    const handleSendMaxMin = (key: keyof IResources) => {
        setSendResources((res) => {
            if (res[key] == 0 && depot != null)
                res[key] = Math.floor(
                    depot.getCurrentResources()[key] / (1 + transportFee)
                )
            else res[key] = 0
        })
    }
    const handleSendFeMaxMin = handleSendMaxMin.bind(null, "fe")
    const handleSendKrMaxMin = handleSendMaxMin.bind(null, "kr")
    const handleSendFrMaxMin = handleSendMaxMin.bind(null, "fr")
    const handleSendOrMaxMin = handleSendMaxMin.bind(null, "or")
    const handleSendFoMaxMin = handleSendMaxMin.bind(null, "fo")
    const handleSendGoMaxMin = handleSendMaxMin.bind(null, "go")

    const handleFavChange = (event: SelectChangeEvent<string>) => {
        setDestination(event.target.value)
    }

    const handleAllResources = () => {
        if (depot)
            setSendResources((r) => {
                r.fe = Math.floor(
                    depot.getCurrentResources()["fe"] / (1 + transportFee)
                )
                r.kr = Math.floor(
                    depot.getCurrentResources()["kr"] / (1 + transportFee)
                )
                r.fr = Math.floor(
                    depot.getCurrentResources()["fr"] / (1 + transportFee)
                )
                r.or = Math.floor(
                    depot.getCurrentResources()["or"] / (1 + transportFee)
                )
                r.fo = Math.floor(
                    depot.getCurrentResources()["fo"] / (1 + transportFee)
                )
                r.go = Math.floor(
                    depot.getCurrentResources()["go"] / (1 + transportFee)
                )
            })
    }

    const handleSaveTrade = () => {
        handleAllResources()
        setDemandResources((r) => {
            r.go = 99999999
        })
        setComment("Sicherungshandel")
    }

    const handleShipSet = (ship: IShip, shipCount: number) => {
        setComment(`${ship.name} ${shipCount}x`)
        setSendResources((r) => {
            r.fe = Math.ceil(ship.resources.fe * shipCount)
            r.kr = Math.ceil(ship.resources.kr * shipCount)
            r.fr = Math.ceil(ship.resources.fr * shipCount)
            r.or = Math.ceil(ship.resources.or * shipCount)
            r.fo = Math.ceil(ship.resources.fo * shipCount)
            r.go = Math.ceil(ship.resources.go * shipCount)
        })
    }

    return (
        <form name="xwo-ext-trade-form" method="post" action={formAction}>
            <Grid item xs={12}>
                <Typography variant="h5">Handelsauftrag</Typography>
            </Grid>
            <Grid container item spacing={1}>
                <Grid item xs={3}>
                    <TextField
                        label="Ziel"
                        name="target"
                        onChange={handleChangeDestination}
                        value={destination}
                    ></TextField>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Favoriten</InputLabel>
                        <Select
                            autoWidth
                            label="Favoriten"
                            defaultValue={""}
                            onChange={handleFavChange}
                        >
                            {destOptions.map((option) => (
                                <MenuItem
                                    key={option.name}
                                    value={option.value}
                                >
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid
                    item
                    justifyContent="center"
                    xs={5}
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography>
                        Transportkosten {transportFee * 100}%
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Kommentar"
                    fullWidth
                    name="comment"
                    onChange={handleChangeComment}
                    value={comment}
                ></TextField>
                <input
                    type="hidden"
                    name="trade_comment"
                    value={commentWithTime}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography>Versenden</Typography>
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={2}>
                    <TextField
                        label="Roheisen"
                        name="tf_res[0]"
                        onChange={handleSendFeChange}
                        value={sendResources.fe === 0 ? "" : sendResources.fe}
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Kristalle"
                        name="tf_res[1]"
                        onChange={handleSendKrChange}
                        value={sendResources.kr === 0 ? "" : sendResources.kr}
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Frubin"
                        name="tf_res[2]"
                        onChange={handleSendFrChange}
                        value={sendResources.fr === 0 ? "" : sendResources.fr}
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Orizin"
                        name="tf_res[3]"
                        onChange={handleSendOrChange}
                        value={sendResources.or === 0 ? "" : sendResources.or}
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Frurozin"
                        name="tf_res[4]"
                        onChange={handleSendFoChange}
                        value={sendResources.fo === 0 ? "" : sendResources.fo}
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Gold"
                        name="tf_res[5]"
                        onChange={handleSendGoChange}
                        value={sendResources.go === 0 ? "" : sendResources.go}
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendFeMaxMin}>
                        {sendResources.fe > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendKrMaxMin}>
                        {sendResources.kr > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendFrMaxMin}>
                        {sendResources.fr > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendOrMaxMin}>
                        {sendResources.or > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendFoMaxMin}>
                        {sendResources.fo > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button size="small" fullWidth onClick={handleSendGoMaxMin}>
                        {sendResources.go > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography>Forderung</Typography>
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={2}>
                    <TextField
                        label="Roheisen"
                        name="tt_res[0]"
                        onChange={handleDemandFeChange}
                        value={
                            demandResources.fe === 0 ? "" : demandResources.fe
                        }
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Kristalle"
                        name="tt_res[1]"
                        onChange={handleDemandKrChange}
                        value={
                            demandResources.kr === 0 ? "" : demandResources.kr
                        }
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Frubin"
                        name="tt_res[2]"
                        onChange={handleDemandFrChange}
                        value={
                            demandResources.fr === 0 ? "" : demandResources.fr
                        }
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Orizin"
                        name="tt_res[3]"
                        onChange={handleDemandOrChange}
                        value={
                            demandResources.or === 0 ? "" : demandResources.or
                        }
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Frurozin"
                        name="tt_res[4]"
                        onChange={handleDemandFoChange}
                        value={
                            demandResources.fo === 0 ? "" : demandResources.fo
                        }
                    ></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Gold"
                        name="tt_res[5]"
                        onChange={handleDemandGoChange}
                        value={
                            demandResources.go === 0 ? "" : demandResources.go
                        }
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={10}></Grid>
                <Grid item xs={2}>
                    <Button
                        size="small"
                        fullWidth
                        onClick={handleDemandGoMaxMin}
                    >
                        {demandResources.go > 0 ? "0" : "MAX"}
                    </Button>
                </Grid>
            </Grid>
            <Grid container item spacing={1}>
                <Grid item xs={4}>
                    <Button fullWidth onClick={handleAllResources}>
                        Alle Resourcen
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button fullWidth onClick={handleSaveTrade}>
                        Sicherungshandel
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        fullWidth
                        type="submit"
                        onClick={handlePreSubmit}
                    >
                        Überprüfen
                    </Button>
                </Grid>
            </Grid>
            <ShipyardsElement
                handleShipSet={handleShipSet}
                transportFee={transportFee}
            />
        </form>
    )
}

const oldForm = window.document.querySelector('form[name="formular"]')
if (!oldForm) throw new Error("trade form not found")

let newFormParent = window.document.querySelector("#xwo-ext-trade")
if (!newFormParent) {
    newFormParent = window.document.createElement("div")
    newFormParent.id = "xwo-ext-trade"

    window.document.body.insertBefore(newFormParent, null)
}

const firstElement = window.document.querySelector("body > table")
if (firstElement && firstElement instanceof HTMLElement)
    firstElement.style.display = "none"

const formRoot = createRoot(newFormParent)

const links = Array.from(
    window.document.querySelectorAll("div[align=center] > a")
).map((link) => {
    if (link instanceof HTMLAnchorElement)
        return { name: link.innerHTML, href: link.href }
    throw new Error("expected HTMLAnchorElement")
})

formRoot.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <TradePage links={links} />
    </ThemeProvider>
)
