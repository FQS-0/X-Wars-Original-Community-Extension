import gulp from "gulp"
import webext from "web-ext"

import { paths } from "./config.js"

import {
    cleanFirefoxPackDir,
    cleanChromePackDir,
    cleanFirefoxRunPackDir,
    cleanChromeRunPackDir,
} from "./cleanDir.js"

const version = process.env.npm_package_version

export const assembleFirefox = gulp.series(
    cleanFirefoxPackDir,
    gulp.parallel(copyAssetsToFirefoxDir, copyScriptsToFirefoxDir)
)

export const assembleChrome = gulp.series(
    cleanChromePackDir,
    gulp.parallel(copyAssetsToChromeDir, copyScriptsTochromeDir)
)

export const assembleFirefoxRun = gulp.series(
    cleanFirefoxRunPackDir,
    gulp.parallel(copyAssetsToFirefoxRunDir, copyScriptsToFirefoxRunDir)
)

export const assembleChromeRun = gulp.series(
    cleanChromeRunPackDir,
    gulp.parallel(copyAssetsToChromeRunDir, copyScriptsTochromeRunDir)
)

export async function copyAssetsToFirefoxDir() {
    return gulp
        .src(paths.assetsDir.pathname + "**")
        .pipe(gulp.dest(paths.firefoxPackDir.pathname))
}

export async function copyAssetsToChromeDir() {
    return gulp
        .src(paths.assetsDir.pathname + "**")
        .pipe(gulp.dest(paths.chromePackDir.pathname))
}

export async function copyScriptsToFirefoxDir() {
    return gulp
        .src(paths.buildDir.pathname + "**")
        .pipe(gulp.dest(paths.firefoxPackDir.pathname))
}

export async function copyScriptsTochromeDir() {
    return gulp
        .src(paths.buildDir.pathname + "**")
        .pipe(gulp.dest(paths.chromePackDir.pathname))
}

export async function copyAssetsToFirefoxRunDir() {
    return gulp
        .src(paths.assetsDir.pathname + "**")
        .pipe(gulp.dest(paths.firefoxRunPackDir.pathname))
}

export async function copyAssetsToChromeRunDir() {
    return gulp
        .src(paths.assetsDir.pathname + "**")
        .pipe(gulp.dest(paths.chromeRunPackDir.pathname))
}

export async function copyScriptsToFirefoxRunDir() {
    return gulp
        .src(paths.buildDir.pathname + "**")
        .pipe(gulp.dest(paths.firefoxRunPackDir.pathname))
}

export async function copyScriptsTochromeRunDir() {
    return gulp
        .src(paths.buildDir.pathname + "**")
        .pipe(gulp.dest(paths.chromeRunPackDir.pathname))
}

export async function createFirefoxZip() {
    await webext.cmd.build({
        overwriteDest: true,
        artifactsDir: paths.distDir.pathname,
        sourceDir: paths.firefoxPackDir.pathname,
        filename: `xwo-com-ext-${version}-firefox.zip`,
    })
}

export async function createChromeZip() {
    await webext.cmd.build({
        overwriteDest: true,
        artifactsDir: paths.distDir.pathname,
        sourceDir: paths.chromePackDir.pathname,
        filename: `xwo-com-ext-${version}-chrome.zip`,
    })
}
