import {
    Cancel,
    East,
    LocalShipping,
    PendingActions,
    ThumbDown,
    ThumbUp,
    West,
} from "@mui/icons-material"
import {
    Avatar,
    Badge,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material"
import { tableCellClasses } from "@mui/material/TableCell"
import { ITrade } from "../json/types/Trade.js"
import { useOwnPlanets } from "../context/OwnPlanets.js"
import { useCurrentPlanet } from "../context/CurrentPlanet.js"
import { useServertime } from "../context/Servertime.js"
import { formatSeconds } from "../Date.js"
import { formatResource, Resources } from "../Resource.js"
import { useSessionId } from "../context/SessionId.js"
import { useResourceBalance } from "../context/ResourceBalance.js"

export const Trade = ({ trade }: { trade: ITrade }) => {
    const ownPlanets = useOwnPlanets()
    const currentPlanet = useCurrentPlanet()
    const servertime = useServertime()
    const now = new Date()
    const id = useSessionId()
    const balance = useResourceBalance()

    const dateString = `${trade.date.toLocaleDateString()} ${trade.date.toLocaleTimeString()}`
    const timeleft =
        (trade.date.getTime() - servertime.getTime()) / 1000 + 12 * 60 * 60

    const colors = {
        delivery: { fe: "", kr: "", fr: "", or: "", fo: "", go: "" },
        returnDelivery: { fe: "", kr: "", fr: "", or: "", fo: "", go: "" },
    }

    const res = balance.currentResources
    const resIn3H = balance.resourcesIn3Hours
    const canAccept =
        res.fe >= trade.returnDelivery.fe &&
        res.kr >= trade.returnDelivery.kr &&
        res.fr >= trade.returnDelivery.fr &&
        res.or >= trade.returnDelivery.or &&
        res.fo >= trade.returnDelivery.fo &&
        res.go >= trade.returnDelivery.go

    if (!trade.concludedAt) {
        if (trade.fromPlanet == currentPlanet) {
            colors.delivery = balance.depot.max.compare(
                res.add(Resources.fromObj(trade.delivery)),
                (value) => (value < 0 ? "error.main" : "")
            )
        } else if (trade.toPlanet == currentPlanet) {
            colors.delivery = balance.depot.max.compare(
                resIn3H.add(Resources.fromObj(trade.delivery)),
                (value) => (value < 0 ? "warning.main" : "")
            )

            colors.delivery = balance.depot.max.compare(
                Resources.fromObj(trade.delivery),
                (value, key) =>
                    value < 0 ? "error.main" : colors.delivery[key]
            )
        }
    } else {
        const resAtConclusion = balance.getResources(trade.concludedAt)
        if (trade.fromPlanet == currentPlanet) {
            colors.returnDelivery = balance.depot.max.compare(
                resAtConclusion,
                (value) => (value < 0 ? "error.main" : "")
            )
        } else if (trade.toPlanet == currentPlanet) {
            colors.delivery = balance.depot.max.compare(
                resAtConclusion,
                (value) => (value < 0 ? "error.main" : "")
            )
        }
    }

    return (
        <Card style={{ marginTop: 10 }}>
            <CardHeader
                style={{ paddingTop: 4, paddingBottom: 2 }}
                avatar={
                    <Avatar>
                        {trade.concludedAt ? (
                            <LocalShipping />
                        ) : (
                            <PendingActions />
                        )}
                    </Avatar>
                }
                title={trade.comment}
                subheader={
                    trade.concludedAt
                        ? dateString
                        : `${dateString} - ${formatSeconds(timeleft)}`
                }
                action={
                    trade.concludedAt ? (
                        <Chip
                            label={formatSeconds(
                                (trade.concludedAt.getTime() - now.getTime()) /
                                    1000
                            )}
                            style={{ marginTop: 12 }}
                        />
                    ) : trade.fromPlanet == currentPlanet ? (
                        <IconButton
                            onClick={() =>
                                (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=cancel&tid=${trade.id}`)
                            }
                        >
                            <Cancel fontSize="large" color="error" />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton
                                onClick={() =>
                                    (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=accept&tid=${trade.id}`)
                                }
                                style={{ marginRight: 20 }}
                                disabled={!canAccept}
                            >
                                <ThumbUp
                                    fontSize="large"
                                    color={canAccept ? "success" : undefined}
                                />
                            </IconButton>
                            <IconButton
                                onClick={() =>
                                    (window.location.href = `?id=${id}&method=dHJhZGU=&art=dHJhZGU=&extern=&todo=cancel&tid=${trade.id}`)
                                }
                            >
                                <ThumbDown fontSize="large" color="error" />
                            </IconButton>
                        </>
                    )
                }
            ></CardHeader>
            <CardContent style={{ paddingTop: 2, paddingBottom: 4 }}>
                <Table
                    size="small"
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none",
                            padding: 0.25,
                        },
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell rowSpan={2} width={"15%"} align="center">
                                <Badge
                                    color={
                                        trade.fromPlanet == currentPlanet
                                            ? "current"
                                            : "own"
                                    }
                                    variant="dot"
                                    invisible={
                                        !ownPlanets.includes(trade.fromPlanet)
                                    }
                                >
                                    {trade.fromPlanet}
                                </Badge>
                            </TableCell>
                            <TableCell width={"5%"} align="right">
                                <East color="error" />
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.fe}>
                                    {formatResource(trade.delivery.fe)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.kr}>
                                    {formatResource(trade.delivery.kr)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.fr}>
                                    {formatResource(trade.delivery.fr)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.or}>
                                    {formatResource(trade.delivery.or)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.fo}>
                                    {formatResource(trade.delivery.fo)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography color={colors.delivery.go}>
                                    {formatResource(trade.delivery.go)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"5%"}>
                                <East color="success" />
                            </TableCell>
                            <TableCell rowSpan={2} width={"15%"} align="center">
                                <Badge
                                    color={
                                        trade.toPlanet == currentPlanet
                                            ? "current"
                                            : "own"
                                    }
                                    variant="dot"
                                    invisible={
                                        !ownPlanets.includes(trade.toPlanet)
                                    }
                                >
                                    {trade.toPlanet}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <West color="success" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.fe}>
                                    {formatResource(trade.returnDelivery.fe)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.kr}>
                                    {formatResource(trade.returnDelivery.kr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.fr}>
                                    {formatResource(trade.returnDelivery.fr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.or}>
                                    {formatResource(trade.returnDelivery.or)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.fo}>
                                    {formatResource(trade.returnDelivery.fo)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color={colors.returnDelivery.go}>
                                    {formatResource(trade.returnDelivery.go)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <West color="error" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
