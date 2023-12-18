import { useRouteError } from "react-router-dom"

export default function ErrorPage() {
    const error = useRouteError()
    console.error(error)
    const msg =
        error !== null &&
        typeof error === "object" &&
        "statusText" in error &&
        typeof error.statusText == "string"
            ? error.statusText
            : error !== null &&
              typeof error === "object" &&
              "message" in error &&
              typeof error.message == "string"
            ? error.message
            : "unknown"

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{msg}</i>
            </p>
        </div>
    )
}
