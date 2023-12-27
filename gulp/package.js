import gulp from "gulp"
import webext from "web-ext"

import { paths } from "./config.js"

const version = process.env.npm_package_version

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
