import "dotenv/config"

import { transpileProduction, transpileDebug } from "./gulp/build.js"
import {
    cleanSchemaDir,
    cleanBuildDir,
    cleanFirefoxPackDir,
    cleanChromePackDir,
} from "./gulp/cleanDir.js"
import {
    compileValidationFile,
    bundleValidationFile,
    generateValidationTypes,
} from "./gulp/validation.js"
import {
    copyAssetsToFirefoxDir,
    copyAssetsToChromeDir,
    copyScriptsToFirefoxDir,
    copyScriptsTochromeDir,
} from "./gulp/package.js"
export { createFirefoxZip, createChromeZip } from "./gulp/package.js"
import gulp from "gulp"

export const generateValidation = gulp.series(
    cleanSchemaDir,
    compileValidationFile,
    bundleValidationFile,
    generateValidationTypes
)

export const buildProduction = gulp.series(cleanBuildDir, transpileProduction)
export const buildDebug = gulp.series(cleanBuildDir, transpileDebug)

export const packFirefox = gulp.series(
    cleanFirefoxPackDir,
    gulp.parallel(copyAssetsToFirefoxDir, copyScriptsToFirefoxDir)
)
export const packChrome = gulp.series(
    cleanChromePackDir,
    gulp.parallel(copyAssetsToChromeDir, copyScriptsTochromeDir)
)

export default gulp.series(
    cleanSchemaDir,
    compileValidationFile,
    bundleValidationFile,
    generateValidationTypes,
    buildDebug
)
