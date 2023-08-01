import { ChangeEvent, useState, useEffect } from "react"
import { Favourite, FavouriteType } from "~src/lib/Favourite.js"
import {
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
import { produce } from "immer"
import Browser from "webextension-polyfill"
import { Account } from "~src/lib/Account.js"

type FavouriteRowProp = {
    favourite: Favourite
    handleBlur: (f: Favourite) => void
}

export const FavouriteRow = ({ favourite, handleBlur }: FavouriteRowProp) => {
    const [fav, setFav] = useImmer(favourite)

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

    return (
        <Grid container item key={fav.uuid} spacing={2}>
            <Grid item xs={4}>
                <TextField
                    label="Name"
                    value={fav.name}
                    onChange={handleChangeName}
                    onBlur={() => {
                        handleBlur(fav)
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Koordinaten"
                    value={fav.coordinates}
                    onChange={handleChangeCoordinates}
                    onBlur={() => {
                        handleBlur(fav)
                    }}
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
                        onBlur={() => {
                            handleBlur(fav)
                        }}
                    >
                        <MenuItem value={FavouriteType.NONE}></MenuItem>
                        <MenuItem value={FavouriteType.FRIEND}>Freund</MenuItem>
                        <MenuItem value={FavouriteType.FOE}>Feind</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    )
}

export const FavouriteInputList = () => {
    const [list, setList] = useState<Favourite[] | null>(null)

    const updateFavouriteList = async () => {
        const l = await Favourite.getList()
        if (l !== null) {
            l.push(new Favourite("", "", FavouriteType.NONE))
            setList(l)
        }
    }

    const handleBlur = (f: Favourite) => {
        const newList = produce(list, (draft) => {
            if (draft !== null) {
                let idx = draft.findIndex((fav) => fav.uuid == f.uuid)
                if (idx !== -1) {
                    draft[idx] = f
                }
                while (
                    (idx = draft.findIndex(
                        (fav) => fav.name === "" && fav.coordinates === ""
                    )) != -1
                ) {
                    draft.splice(idx, 1)
                }
            }
        })
        if (newList !== null) Favourite.setList(newList)
    }

    useEffect(() => {
        const handleOnChanged = async (
            changes: Record<string, Browser.Storage.StorageChange>,
            areaName: string
        ) => {
            if (areaName !== "local") return
            const key = `${await Account.getId()}#favourites`
            if (Object.keys(changes).includes(key)) {
                updateFavouriteList()
            }
        }
        Browser.storage.onChanged.addListener(handleOnChanged)
        return () => {
            Browser.storage.onChanged.removeListener(handleOnChanged)
        }
    }, [])

    if (list === null) {
        updateFavouriteList()
        return <Typography>Loading...</Typography>
    } else {
        return (
            <Grid container spacing={3}>
                {list.map((fl) => (
                    <FavouriteRow
                        key={fl.uuid}
                        favourite={fl}
                        handleBlur={handleBlur}
                    ></FavouriteRow>
                ))}
            </Grid>
        )
    }
}

export const FavouriteOptions = () => {
    return (
        <>
            <Typography variant="h4" sx={{ my: 2 }}>
                Favouriten
            </Typography>
            <FavouriteInputList />
        </>
    )
}
