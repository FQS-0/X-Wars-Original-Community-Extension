import { ChangeEvent, useState } from "react"
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
import {
    GppGood,
    GppBad,
    GppMaybe,
    StarOutline,
    Delete,
    Star,
} from "@mui/icons-material"
import { IAllianceFavourites } from "~src/lib/json/types/AllianceFavourites.js"
import { LoadingButton } from "@mui/lab"
import {
    addFavouriteFavourite,
    removeFavouriteFavourite,
    useFavouriteFavourites,
} from "~src/lib/context/FavouriteFavourites.js"
import {
    addFavourite,
    removeFavourite,
    useFavourites,
} from "~src/lib/state/Favourites.js"
import {
    fetchAllianceFavourites,
    removeAllianceFavourites,
    useAllianceFavouritesList,
} from "~src/lib/state/AllianceFavourites.js"

type FavouriteRowProp = {
    favourite: IFavourite
    owned: boolean
}

export const FavouriteRow = ({ favourite, owned }: FavouriteRowProp) => {
    const favouriteFavourites = useFavouriteFavourites()
    const isFavourite =
        favouriteFavourites.findIndex(
            (f) => f.coordinates == favourite.coordinates
        ) > -1

    const handleRemove = async () => {
        removeFavourite(favourite)
    }

    const handletoggleIsFavourite = async () => {
        if (isFavourite) {
            removeFavouriteFavourite(favourite)
        } else {
            addFavouriteFavourite(favourite)
        }
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
                                {isFavourite ? <Star /> : <StarOutline />}
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
        addFavourite(fav)
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
            const isNewAllianceFavList = await fetchAllianceFavourites(u)
            if (isNewAllianceFavList) setMsg("Werft hinzugefügt")
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
                        Importieren
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    )
}

export const FavouriteList = () => {
    const favourites = useFavourites()
    const allianceFavsList = useAllianceFavouritesList()

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Eigene Favoriten
                </Typography>
            </Grid>
            {favourites.map((fl) => (
                <FavouriteRow
                    key={fl.coordinates}
                    owned={true}
                    favourite={fl}
                ></FavouriteRow>
            ))}
            {allianceFavsList?.map((list) => (
                <AllyFavouriteList list={list} key={`allyList#${list.url}`} />
            ))}
        </>
    )
}

const AllyFavouriteList = ({ list }: { list: IAllianceFavourites }) => {
    const handleRemove = async () => {
        removeAllianceFavourites(list)
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
                <Typography variant="subtitle2">
                    {list.url}
                    {list.lastUpdate &&
                        ` - ${new Date(
                            list.lastUpdate
                        ).toLocaleDateString()} ${new Date(
                            list.lastUpdate
                        ).toLocaleTimeString()}`}
                </Typography>
            </Grid>
            {list.favourites.map((fav) => (
                <FavouriteRow
                    key={`allyListRow#${list.url}#${fav.coordinates}`}
                    favourite={fav}
                    owned={false}
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
