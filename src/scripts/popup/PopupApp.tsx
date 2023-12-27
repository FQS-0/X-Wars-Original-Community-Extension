import {
    Container,
    Typography,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material"
import { RotateLeft, Settings } from "@mui/icons-material"
import Browser from "webextension-polyfill"
import { fetchShipyardsUpdates } from "~src/lib/state/Shipyards.js"
import { fetchAllianceFavouritesUpdates } from "~src/lib/state/AllianceFavourites.js"

export default function App() {
    console.log("test")
    const openOptions = () => {
        Browser.runtime.openOptionsPage()
        window.close()
    }

    const updateJSONs = async () => {
        await fetchShipyardsUpdates(true)
        await fetchAllianceFavouritesUpdates(true)
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        X-Wars Original Community Extension
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <List>
                    <ListItem onClick={openOptions}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary="Optionen" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={updateJSONs}>
                        <ListItemButton>
                            <ListItemIcon>
                                <RotateLeft />
                            </ListItemIcon>
                            <ListItemText primary="JSONs aktualisieren" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Container>
        </>
    )
}
