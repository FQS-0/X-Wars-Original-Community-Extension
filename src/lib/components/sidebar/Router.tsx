import ErrorPage from "./Error.js"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import Root from "./Root.js"
import MemberList from "./Memberlist.js"
import ShipGrid from "./ShipGrid.js"

const router = createBrowserRouter([
    {
        path: "*",
        element: <Navigate to={"/memberlist"} />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Navigate to={"memberlist"} /> },
            { path: "memberlist", element: <MemberList /> },
            { path: "shiplist", element: <ShipGrid /> },
        ],
    },
])

export default function Router() {
    return <RouterProvider router={router} />
}
