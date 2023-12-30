import "dotenv/config"

export { generateValidation } from "./gulp/validation.js"
export { buildProduction, buildDebug } from "./gulp/build.js"
export {
    assembleFirefox,
    assembleFirefoxRun,
    assembleChrome,
    assembleChromeRun,
    createFirefoxZip,
    createChromeZip,
} from "./gulp/package.js"
export { runFirefox, runChrome } from "./gulp/run.js"
