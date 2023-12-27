import { Tab, Tabs } from "@mui/material"
import { Link, useLocation } from "react-router-dom"

export default function SideBarTabs() {
    const location = useLocation()

    return (
        <Tabs value={location.pathname}>
            <Tab
                label="Mitglieder-Liste"
                value="/memberlist"
                to="/memberlist"
                component={Link}
            />
            <Tab
                label="Schiff-Liste"
                value="/shiplist"
                to="/shiplist"
                component={Link}
            />
        </Tabs>
    )
}
