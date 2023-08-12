import { createTheme } from "@mui/material/styles"
import { red } from "@mui/material/colors"

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#000000",
        },
        primary: {
            main: "#80d8ff",
        },
        secondary: {
            main: "#80d8ff",
        },
        error: {
            main: red.A400,
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

export default theme
