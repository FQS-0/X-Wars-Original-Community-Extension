import "dotenv/config"

import gulp from "gulp"

export { runFirefox, runChrome } from "./gulp/run.js"

import { generateValidation } from "./gulp/validation.js"
import { buildProduction } from "./gulp/build.js"
import {
    assembleFirefox,
    assembleChrome,
    createChromeZip,
    createFirefoxZip,
} from "./gulp/package.js"

export default gulp.series(
    generateValidation,
    buildProduction,
    gulp.parallel(
        gulp.series(assembleFirefox, createFirefoxZip),
        gulp.series(assembleChrome, createChromeZip)
    )
)
