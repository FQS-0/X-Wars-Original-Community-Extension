import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import {
    ExpandLess,
    ExpandMore,
    LocalShipping,
    RocketLaunch,
    SettingsRemote,
    Star,
    StarOutline,
    VisibilityOff,
} from "@mui/icons-material"
import {
    CrystalIcon,
    FrubinIcon,
    FrurozinIcon,
    GoldIcon,
    OrizinIcon,
    PigironICon,
} from "~src/lib/Icons.js"
import { useShipList } from "~src/lib/state/ShipList.js"
import { IShip } from "~src/lib/json/types/Ship.js"
import { useEffect, useState } from "react"
import { Updater, useImmer } from "use-immer"
import { IShipyard } from "~src/lib/json/types/Shipyard.js"

const fmt = new Intl.NumberFormat()

export default function ShipGrid() {
    const shipyard = useShipList()
    const [selectedShips, setSelectedShips] = useImmer<string[]>([])
    const [name, setName] = useState<string>("")
    const [filename, setFilename] = useState<string>("")
    const [planetList, setPlanetList] = useImmer<
        { coordinates: string; selected: boolean }[]
    >([])

    useEffect(() => {
        setName(shipyard.name)
        setFilename(shipyard.name + ".json")
        setPlanetList(
            shipyard.planets.map((planet) => {
                return { coordinates: planet.coordinates, selected: true }
            })
        )
    }, [shipyard])

    const handleInvertSelection = () => {
        setSelectedShips(
            shipyard.ships
                .map((ship) => ship.name)
                .filter((ship) => !selectedShips.includes(ship))
        )
    }

    const downloadJson = () => {
        const shipyardToJson: IShipyard = {
            name: name,
            planets: planetList
                .filter((planet) => planet.selected)
                .map((planet) => {
                    return { coordinates: planet.coordinates }
                }),
            ships: shipyard.ships.filter((ship) =>
                selectedShips.includes(ship.name)
            ),
        }

        const a = window.document.createElement("a")
        const file = new Blob([JSON.stringify(shipyardToJson, undefined, 2)], {
            type: "application/json",
        })

        a.href = URL.createObjectURL(file)
        a.download = filename
        a.click()
        URL.revokeObjectURL(a.href)
    }

    const handlePlanetToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlanetList((list) => {
            const planet = list.find(
                (planet) => event.target.id == planet.coordinates
            )
            if (planet) planet.selected = !planet.selected
        })
    }
    return (
        <Container maxWidth="md">
            <FormGroup>
                <TextField
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value)
                    }}
                    id="name"
                    label="Name"
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    value={filename}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilename(event.target.value)
                    }}
                    id="filename"
                    label="Dateiname"
                    variant="outlined"
                    margin="normal"
                />
                {planetList.map((planet) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={planet.selected}
                                onChange={handlePlanetToggle}
                                id={planet.coordinates}
                            />
                        }
                        label={planet.coordinates}
                        key={planet.coordinates}
                    />
                ))}
                <Button onClick={downloadJson}>Download JSON</Button>
                <Button onClick={handleInvertSelection}>
                    Auswahl umkehren
                </Button>
            </FormGroup>
            <Grid container spacing={2}>
                {shipyard.ships.map((ship) => (
                    <Ship
                        key={ship.name}
                        ship={ship}
                        selectedShips={selectedShips}
                        setSelectedShips={setSelectedShips}
                    />
                ))}
            </Grid>
        </Container>
    )
}

const Ship = ({
    ship,
    selectedShips,
    setSelectedShips,
}: {
    ship: IShip
    selectedShips: string[]
    setSelectedShips: Updater<string[]>
}) => {
    const [isExpanded, setExpanded] = useState(false)

    const handleToggleExpanded = () => {
        setExpanded(!isExpanded)
    }

    const handleToggleIsFavourite = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation()
        if (selectedShips.includes(ship.name)) {
            setSelectedShips(
                selectedShips.filter((selShip) => selShip != ship.name)
            )
        } else {
            setSelectedShips((ships) => {
                ships.push(ship.name)
            })
        }
    }

    return (
        <Grid item xs={12} md={isExpanded ? 12 : 4}>
            <Card onClick={handleToggleExpanded}>
                <CardHeader
                    action={
                        <Stack>
                            <IconButton onClick={handleToggleIsFavourite}>
                                {selectedShips.includes(ship.name) ? (
                                    <Star />
                                ) : (
                                    <StarOutline />
                                )}
                            </IconButton>
                            <IconButton onClick={handleToggleExpanded}>
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
