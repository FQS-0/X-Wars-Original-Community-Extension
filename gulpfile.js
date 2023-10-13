import { buildSource } from "./gulp/buildSource.js"
import { cleanSchemaDir } from "./gulp/cleanSchemaDir.js"
import { compileValidationFile } from "./gulp/compileValidationFile.js"
import { bundleValidationFile } from "./gulp/bundleValidationFile.js"
import { generateValidationTypes } from "./gulp/generateValidationTypes.js"
import gulp from "gulp"

export default gulp.series(
    cleanSchemaDir,
    compileValidationFile,
    bundleValidationFile,
    generateValidationTypes,
    buildSource
)
