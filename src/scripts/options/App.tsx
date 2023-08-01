import { Container, Typography, AppBar, Toolbar } from "@mui/material"
import { FavouriteOptions } from "./Favourites.js"

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
                <FavouriteOptions />
            </Container>
        </>
    )
}
