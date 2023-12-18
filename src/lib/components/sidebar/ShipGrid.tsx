import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    IconButton,
    Stack,
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
import { useState } from "react"
import { Updater, useImmer } from "use-immer"

const fmt = new Intl.NumberFormat()

export default function ShipGrid() {
    const ships = useShipList()
    const [selectedShips, setSelectedShips] = useImmer<string[]>([])

    const handleInvertSelection = () => {
        setSelectedShips(
            ships
                .map((ship) => ship.name)
                .filter((ship) => !selectedShips.includes(ship))
        )
    }

    return (
        <Container maxWidth="md">
            <Button onClick={handleInvertSelection}>Auswahl umkehren</Button>
            <Grid container spacing={2}>
                {ships.map((ship) => (
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
