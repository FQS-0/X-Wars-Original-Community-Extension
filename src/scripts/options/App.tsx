import { Container, Typography, AppBar, Toolbar, Grid } from "@mui/material"
import { FavouriteOptions } from "./Favourites.js"
import { ShipyardOptions } from "./Shipyard.js"

export default function App() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        X-Wars Original Community Extension - Settings
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <FavouriteOptions />
                    <ShipyardOptions />
                </Grid>
            </Container>
        </>
    )
}
