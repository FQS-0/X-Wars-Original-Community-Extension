import { createTheme } from "@mui/material/styles"
import { blue, green, purple } from "@mui/material/colors"

declare module "@mui/material/styles" {
    interface Palette {
        current: Palette["primary"]
        own: Palette["primary"]
        friend: Palette["primary"]
    }

    interface PaletteOptions {
        current?: PaletteOptions["primary"]
        own?: PaletteOptions["primary"]
        friend?: PaletteOptions["primary"]
    }
}

declare module "@mui/material/Badge" {
    interface BadgePropsColorOverrides {
        current: true
        own: true
        firend: true
    }
}

// A custom theme for this app
let theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#000000",
        },
        primary: {
            main: "#80d8ff",
        },
        secondary: {
            //main: "#80d8ff",
            main: "#0084d9",
        },
        warning: {
            main: "#FFA726",
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                margin: "dense",
                size: "small",
            },
        },
        MuiFormControl: {
            defaultProps: {
                margin: "dense",
                size: "small",
            },
        },
    },
})

theme = createTheme(theme, {
    palette: {
        current: theme.palette.augmentColor({
            color: { main: purple[500] },
            name: "current",
        }),
        own: theme.palette.augmentColor({
            color: { main: blue[500] },
            name: "own",
        }),
        friend: theme.palette.augmentColor({
            color: { main: green[500] },
            name: "friend",
        }),
    },
})

export default theme
