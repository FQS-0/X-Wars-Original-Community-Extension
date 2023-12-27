import { createRoot } from "react-dom/client"
import Router from "~src/lib/components/sidebar/Router.js"

const root = createRoot(window.document.getElementById("root") as HTMLElement)
root.render(<Router />)
