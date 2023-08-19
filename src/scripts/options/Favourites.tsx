import { ChangeEvent, useState, useEffect } from "react"
import { IFavourite } from "~src/lib/json/types/Favourite.js"
import { EFavouriteType } from "~src/lib/json/types/FavouriteType.js"
import {
    Alert,
    Button,
    Card,
    CardHeader,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material"
import { useImmer } from "use-immer"
import { StorageArea } from "~src/lib/StorageArea.js"
import { TFavourites } from "~src/lib/json/types/Favourites.js"
import {
    GppGood,
    GppBad,
    GppMaybe,
    StarOutline,
    Delete,
    Star,
} from "@mui/icons-material"
import { ensureType } from "~src/lib/JsonValidation.js"
import { IAllianceFavourites } from "~src/lib/json/types/AllianceFavourites.js"
import * as validations from "~src/lib/json/schemas/validations.js"
import { LoadingButton } from "@mui/lab"

type FavouriteRowProp = {
    favourite: IFavourite
    owned: boolean
    isfavourite?: boolean
}

export const FavouriteRow = ({
    favourite,
    owned,
    isfavourite = false,
}: FavouriteRowProp) => {
    const handleRemove = async () => {
        const favourites =
            (await StorageArea.favourites.get()) || ([] as TFavourites)
        const idx = favourites.findIndex(
            (f) => f.coordinates === favourite.coordinates
        )
        if (idx > -1) favourites.splice(idx, 1)
        StorageArea.favourites.set(favourites)
    }

    const handletoggleIsFavourite = async () => {
        const favs = await StorageArea.favouriteFavourites.tryGet([])
        const idx = favs.findIndex(
            (f) => f.coordinates == favourite.coordinates
        )
        console.log(favs, idx)
        if (isfavourite && idx > -1) favs.splice(idx, 1)
        if (!isfavourite && idx == -1) favs.push(favourite)
        await StorageArea.favouriteFavourites.set(favs)
    }

    return (
        <Grid item xs={12} md={4}>
            <Card>
                <CardHeader
                    avatar={
                        favourite.type == EFavouriteType.FRIEND ? (
                            <GppGood color="success" />
                        ) : favourite.type == EFavouriteType.FOE ? (
                            <GppBad color="error" />
                        ) : (
                            <GppMaybe />
                        )
                    }
                    action={
                        owned ? (
                            <IconButton onClick={handleRemove}>
                                <Delete />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handletoggleIsFavourite}>
                                {isfavourite ? <Star /> : <StarOutline />}
                            </IconButton>
                        )
                    }
                    title={favourite.name}
                    subheader={favourite.coordinates}
                />
            </Card>
        </Grid>
    )
}

export const FavouriteAddForm = () => {
    const [fav, setFav] = useImmer({
        name: "",
        coordinates: "",
        type: EFavouriteType.NONE,
    } as IFavourite)

    const handleChangeName = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
        setFav((f) => {
            f.name = event.target.value
        })
    const handleChangeCoordinates = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
        setFav((f) => {
            f.coordinates = event.target.value
        })
    const handleChangeType = (event: SelectChangeEvent<EFavouriteType>) =>
        setFav((f) => {
            f.type =
                EFavouriteType[
                    event.target.value as keyof typeof EFavouriteType
                ]
        })
    const handleAddFavourite = async () => {
        const favourites =
            (await StorageArea.favourites.get()) || ([] as TFavourites)
        const idx = favourites.findIndex(
            (f) => f.coordinates === fav.coordinates
        )
        if (idx > -1) {
            favourites[idx] = fav
        } else {
            favourites.push(fav)
        }

        await StorageArea.favourites.set(favourites)
        setFav({ name: "", coordinates: "", type: EFavouriteType.NONE })
    }

    return (
        <>
            <Grid container item spacing={2}>
                <Grid item md={4} xs={6}>
                    <TextField
                        fullWidth
                        label="Koordinaten"
                        value={fav.coordinates}
                        onChange={handleChangeCoordinates}
                    />
                </Grid>
                <Grid item md={4} xs={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={fav.name}
                        onChange={handleChangeName}
                    />
                </Grid>
                <Grid item md={4} xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Typ</InputLabel>
                        <Select
                            autoWidth
                            label="Typ"
                            value={fav.type}
                            onChange={handleChangeType}
                        >
                            <MenuItem value={EFavouriteType.NONE}></MenuItem>
                            <MenuItem value={EFavouriteType.FRIEND}>
                                Freund
                            </MenuItem>
                            <MenuItem value={EFavouriteType.FOE}>
                                Feind
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mb: 4 }}>
                <Button variant="outlined" onClick={handleAddFavourite}>
                    Hinzufügen/Ändern
                </Button>
            </Grid>
        </>
    )
}

export const FavouriteImportForm = () => {
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

        const allyFavs = ensureType<IAllianceFavourites>(
            validations.IAllianceFavourites,
            JSON.parse(await response.text())
        )
        allyFavs.url = url
        allyFavs.lastUpdate = new Date()

        const favList = await StorageArea.allianceFavourites.tryGet([])
        const idx = favList.findIndex((fav) => fav.url == allyFavs.url)

        if (idx > -1) {
            favList[idx] = allyFavs
            setMsg("Favouriten aktualisiert")
        } else {
            favList.push(allyFavs)
            setMsg("Favouriten hinzugefügt")
        }
        await StorageArea.allianceFavourites.set(favList)

        setUrl("")
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
                        Importieren
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    )
}

export const FavouriteList = () => {
    const [list, setList] = useState<IFavourite[] | null>(null)
    const [allyLists, setAllyLists] = useState<IAllianceFavourites[] | null>(
        null
    )
    const [favFavs, setFavFavs] = useState<TFavourites | null>(null)

    const updateFavouriteList = async () => {
        const favList = await StorageArea.favourites.tryGet([])
        setList(favList)
    }

    const updateAllianceFavouritesLists = async () => {
        const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
        setAllyLists(allyFavsList)
    }

    const updateFavouriteFavourites = async () => {
        setFavFavs(await StorageArea.favouriteFavourites.tryGet([]))
    }

    useEffect(() => {
        updateFavouriteList()
        updateAllianceFavouritesLists()
        updateFavouriteFavourites()

        const unsubscribe =
            StorageArea.favourites.subscribe(updateFavouriteList)
        const unsubscribeAllyFavs = StorageArea.allianceFavourites.subscribe(
            updateAllianceFavouritesLists
        )
        const unsubscribeFavFavs = StorageArea.favouriteFavourites.subscribe(
            updateFavouriteFavourites
        )
        return () => {
            unsubscribe()
            unsubscribeAllyFavs()
            unsubscribeFavFavs()
        }
    }, [])

    if (list === null) {
        return <Typography>Loading...</Typography>
    } else {
        return (
            <>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Eigene Favoriten
                    </Typography>
                </Grid>
                {list.map((fl) => (
                    <FavouriteRow
                        key={fl.coordinates}
                        owned={true}
                        favourite={fl}
                    ></FavouriteRow>
                ))}
                {allyLists?.map((allyList) => (
                    <AllyFavouriteList
                        list={allyList}
                        favFavs={favFavs || []}
                        key={`allyList#${allyList.url}`}
                    />
                ))}
            </>
        )
    }
}

const AllyFavouriteList = ({
    list,
    favFavs,
}: {
    list: IAllianceFavourites
    favFavs: TFavourites
}) => {
    const handleRemove = async () => {
        const allyFavsList = await StorageArea.allianceFavourites.tryGet([])
        const idx = allyFavsList.findIndex((afl) => afl.url == list.url)
        if (idx > -1) allyFavsList.splice(idx, 1)
        StorageArea.allianceFavourites.set(allyFavsList)
    }

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Favoriten
                    <IconButton onClick={handleRemove}>
                        <Delete />
                    </IconButton>
                </Typography>
                <Typography variant="subtitle2">{list.url}</Typography>
            </Grid>
            {list.favourites.map((fav) => (
                <FavouriteRow
                    key={`allyListRow#${list.url}#${fav.coordinates}`}
                    favourite={fav}
                    owned={false}
                    isfavourite={
                        favFavs.findIndex(
                            (f) => f.coordinates == fav.coordinates
                        ) > -1
                    }
                />
            ))}
        </>
    )
}

export const FavouriteOptions = () => {
    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h4" sx={{ my: 3 }}>
                    Favoriten
                </Typography>
            </Grid>
            <FavouriteAddForm />
            <FavouriteImportForm />
            <FavouriteList />
        </>
    )
}
