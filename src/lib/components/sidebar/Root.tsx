import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { Outlet } from "react-router-dom"
import theme from "~/src/scripts/sidebar/theme.js"
import SideBarTabs from "./SideBarTabs.js"

export default function Root() {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <SideBarTabs />
            <Outlet />
        </ThemeProvider>
    )
}
