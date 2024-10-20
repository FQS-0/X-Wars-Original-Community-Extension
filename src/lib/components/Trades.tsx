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
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell width={"10%"} align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromRunningTrades
                                            .go
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Lager</TableCell>
                            <TableCell>in 1h</TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.fe >
                                        depot.max.fe
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.kr >
                                        depot.max.kr
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.fr >
                                        depot.max.fr
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.or >
                                        depot.max.or
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.fo >
                                        depot.max.fo
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={
                                        balance.resourcesIn3Hours.go >
                                        depot.max.go
                                            ? "error.main"
                                            : undefined
                                    }
                                >
                                    {formatResource(
                                        balance.resourcesIn3Hours.go
                                    )}
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
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromSaveTrades.go
                                    )}
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
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromOutgoingTrades
                                            .go
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
                                        balance.sentResourcesFromOutgoingTrades
                                            .fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromOutgoingTrades
                                            .kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromOutgoingTrades
                                            .fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromOutgoingTrades
                                            .or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromOutgoingTrades
                                            .fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromOutgoingTrades
                                            .go
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
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance
                                            .receivedResourcesFromIncomingTrades
                                            .go
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
                                        balance.sentResourcesFromIncomingTrades
                                            .fe
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromIncomingTrades
                                            .kr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromIncomingTrades
                                            .fr
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromIncomingTrades
                                            .or
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromIncomingTrades
                                            .fo
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {formatResource(
                                        balance.sentResourcesFromIncomingTrades
                                            .go
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
