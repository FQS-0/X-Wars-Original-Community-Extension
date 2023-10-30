import {
    Box,
    Container,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    Typography,
    tableCellClasses,
} from "@mui/material"
import { useTrades } from "../state/trades.js"
import { Trade } from "./Trade.js"
import { useCurrentPlanet } from "../context/CurrentPlanet.js"
import { ServertimeProvider } from "../context/Servertime.js"
import { useSubMenuList } from "../state/SubMenuList.js"
import { useSessionId } from "../context/SessionId.js"
import { useResourceBalance } from "../context/ResourceBalance.js"
import { East, West } from "@mui/icons-material"
import { formatResource } from "../Resource.js"
import { useDepot } from "../context/Depot.js"

export const Trades = () => {
    const trades = useTrades()
    const currentPlanet = useCurrentPlanet()
    const submenu = useSubMenuList()
    const id = useSessionId()

    const balance = useResourceBalance()
    const depot = useDepot()

    return (
        <Container maxWidth="md" style={{ marginTop: 20 }}>
            {submenu.length > 0 ? (
                <Box
                    sx={{ width: "100%" }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Tabs value={0} aria-label="nav tabs example">
                        {submenu.map((item) => (
                            <Tab
                                key={`${item.method}-${item.art}`}
                                label={item.text}
                                href={`?id=${id}&method=${item.method}&art=${item.art}`}
                            />
                        ))}
                    </Tabs>
                </Box>
            ) : (
                ""
            )}
            <Stack>
                <Table
                    size="small"
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            padding: 0.25,
                        },
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell width={"30%"}>Laufende Handel</TableCell>
                            <TableCell width={"10%"}>
                                <West color="success" />
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.fe)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.kr)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.fr)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.or)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.fo)}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(balance.runningTrades.go)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Lager</TableCell>
                            <TableCell>in 3h</TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.fe > depot.max.fe
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.fe)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.kr > depot.max.kr
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.kr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.fr > depot.max.fr
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.fr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.or > depot.max.or
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.or)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.fo > depot.max.fo
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.fo)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.depot3h.go > depot.max.go
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(balance.depot3h.go)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Sicherungshandel</TableCell>
                            <TableCell>
                                <East color="error" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.fe)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.kr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.fr)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.or)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.fo)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(balance.saveTrades.go)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell rowSpan={2}>Ausgehende Handel</TableCell>
                            <TableCell>
                                <West color="success" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.receive.go
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <East color="error" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.outgoingTrades.send.go
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell rowSpan={2}>Eingehende Handel</TableCell>
                            <TableCell>
                                <West color="success" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.receive.go
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <East color="error" />
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.incomingTrades.send.go
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <ServertimeProvider>
                    {trades
                        .filter(
                            (trade) =>
                                trade.fromPlanet == currentPlanet ||
                                trade.toPlanet == currentPlanet
                        )
                        .map((trade) => (
                            <Trade key={trade.id} trade={trade} />
                        ))}
                </ServertimeProvider>
            </Stack>
        </Container>
    )
}
