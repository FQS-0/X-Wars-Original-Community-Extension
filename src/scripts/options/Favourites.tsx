import { ChangeEvent, useState, useEffect } from "react"
import { Favourite } from "~src/lib/json/types/Favourite.js"
import { FavouriteType } from "~src/lib/json/types/FavouriteType.js"
import {
    Button,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material"
import { useImmer } from "use-immer"
import { StorageArea } from "~src/lib/StorageArea.js"
import { Favourites } from "~src/lib/json/types/Favourites.js"
import { GppGood, GppBad } from "@mui/icons-material"

type FavouriteRowProp = {
    favourite: Favourite
}

export const FavouriteRow = ({ favourite }: FavouriteRowProp) => {
    const handleRemove = async () => {
        const favourites =
            (await StorageArea.favourites.get()) || ([] as Favourites)
        const idx = favourites.findIndex(
            (f) => f.coordinates === favourite.coordinates
        )
        if (idx > -1) favourites.splice(idx, 1)
        StorageArea.favourites.set(favourites)
    }
    return (
        <Grid container item key={favourite.coordinates} spacing={2}>
            <Grid item xs={2}>
                <Chip
                    label={favourite.coordinates}
                    variant="outlined"
                    icon={
                        favourite.type == FavouriteType.FRIEND ? (
                            <GppGood />
                        ) : favourite.type == FavouriteType.FOE ? (
                            <GppBad />
                        ) : undefined
                    }
                    color={
                        favourite.type == FavouriteType.FRIEND
                            ? "success"
                            : favourite.type == FavouriteType.FOE
                            ? "error"
                            : undefined
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <Typography>{favourite.name}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Button variant="outlined" onClick={handleRemove}>
                    Entfernen
                </Button>
            </Grid>
        </Grid>
    )
}

export const FavouriteAddForm = () => {
    const [fav, setFav] = useImmer({
        name: "",
        coordinates: "",
        type: FavouriteType.NONE,
    } as Favourite)

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
    const handleChangeType = (event: SelectChangeEvent<FavouriteType>) =>
        setFav((f) => {
            f.type =
                FavouriteType[event.target.value as keyof typeof FavouriteType]
        })
    const handleAddFavourite = async () => {
        const favourites =
            (await StorageArea.favourites.get()) || ([] as Favourites)
        const idx = favourites.findIndex(
            (f) => f.coordinates === fav.coordinates
        )
        if (idx > -1) {
            favourites[idx] = fav
        } else {
            favourites.push(fav)
        }

        await StorageArea.favourites.set(favourites)
        setFav({ name: "", coordinates: "", type: FavouriteType.NONE })
    }

    return (
        <>
            <Grid container item spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Koordinaten"
                        value={fav.coordinates}
                        onChange={handleChangeCoordinates}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={fav.name}
                        onChange={handleChangeName}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Typ</InputLabel>
                        <Select
                            autoWidth
                            label="Typ"
                            value={fav.type}
                            onChange={handleChangeType}
                        >
                            <MenuItem value={FavouriteType.NONE}></MenuItem>
                            <MenuItem value={FavouriteType.FRIEND}>
                                Freund
                            </MenuItem>
                            <MenuItem value={FavouriteType.FOE}>Feind</MenuItem>
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

export const FavouriteInputList = () => {
    const [list, setList] = useState<Favourite[] | null>(null)

    const updateFavouriteList = async () => {
        const l = (await StorageArea.favourites.get()) || ([] as Favourites)

        setList(l)
    }

    useEffect(() => {
        const unsubscribe =
            StorageArea.favourites.subscribe(updateFavouriteList)
        return () => {
            unsubscribe()
        }
    }, [])

    if (list === null) {
        updateFavouriteList()
        return <Typography>Loading...</Typography>
    } else {
        return list.map((fl) => (
            <FavouriteRow key={fl.coordinates} favourite={fl}></FavouriteRow>
        ))
    }
}

export const FavouriteOptions = () => {
    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h4" sx={{ my: 3 }}>
                    Favouriten
                </Typography>
            </Grid>
            <FavouriteAddForm />
            <FavouriteInputList />
        </>
    )
}
