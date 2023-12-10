import { createRoot } from "react-dom/client"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./theme.js"
import SidebarApp from "~src/lib/components/SidebarApp.js"

const root = createRoot(window.document.getElementById("root") as HTMLElement)
root.render(
    <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SidebarApp />
    </ThemeProvider>
)
