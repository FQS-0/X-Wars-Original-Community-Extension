import esbuild from "esbuild"
import fs from "fs"
import tsj from "ts-json-schema-generator"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import standaloneCode from "ajv/dist/standalone/index.js"
import { spawn } from "child_process"
import gulp from "gulp"

import { paths } from "./config.js"

import { cleanSchemaDir } from "./cleanDir.js"

export const generateValidation = gulp.series(
    cleanSchemaDir,
    compileValidationFile,
    bundleValidationFile,
    generateValidationTypes
)

async function esBuildCommonToEsm(validationFile) {
    await esbuild.build({
        // minify: true,
        bundle: true,
        target: ["chrome89", "firefox89"],
        keepNames: true,
        platform: "browser",
        format: "esm",
        entryPoints: [validationFile.pathname],
        outfile: validationFile.pathname,
        allowOverwrite: true,
    })
}

async function bundleValidationFile() {
    await esBuildCommonToEsm(paths.validationFile)
}

function fixRef(def) {
    if (typeof def.$ref === "string") {
        def.$ref = def.$ref.replace("#/definitions/", "")
    }
    Object.entries(def).forEach(([, definition]) => {
        if (typeof definition === "object") fixRef(definition)
    })
}

function typeScriptToJsonSchema(srcDir, destDir) {
    const config = {
        path: srcDir.pathname + "/**/*.ts",
        type: "*",
    }

    const schemaRaw = tsj.createGenerator(config).createSchema(config.type)

    if (!schemaRaw.definitions) throw new Error("found no definitions")
    const schemas = []
    Object.entries(schemaRaw.definitions).forEach(([id, definition]) => {
        if (typeof definition === "object") {
            fixRef(definition)
            definition.$id = id
            definition.$schema = "http://json-schema.org/draft-07/schema#"
            fs.writeFileSync(
                new URL(`./${id}.json`, destDir),
                JSON.stringify(definition, undefined, 2)
            )
            schemas.push(definition)
        }
    })

    return schemas
}

async function compileAjvStandalone(schemas, validationFile) {
    const ajv = new Ajv.default({
        schemas: schemas,
        code: { source: true, esm: true },
    })
    addFormats.default(ajv)
    const moduleCode = standaloneCode.default(ajv)
    await fs.promises.writeFile(validationFile, moduleCode)
}

async function compileValidationFile() {
    const schemas = typeScriptToJsonSchema(paths.typeDir, paths.schemaDir)
    await compileAjvStandalone(schemas, paths.validationFile)
}

async function execCommand(
    command,
    args,
    echoOutputs = true,
    prefixOutputs = ""
) {
    return new Promise((resolve, reject) => {
        let allData = ""
        let errOutput = ""
        const call = spawn(command, args)

        call.stdout.on("data", function (data) {
            allData += data.toString()
            echoOutputs && process.stdout.write(prefixOutputs + data.toString())
        })
        call.stderr.on("data", function (data) {
            errOutput = data.toString()
            echoOutputs && process.stdout.write(prefixOutputs + data.toString())
        })
        call.on("exit", function (code) {
            if (code == 0) resolve(allData)
            else reject({ command, args, stdout: allData, stderr: errOutput })
        })
    })
}

async function generateTypings(validationFile, validationFileFolder) {
    await execCommand("npx", [
        "tsc",
        "--allowJs",
        "--declaration",
        "--emitDeclarationOnly",
        validationFile.pathname,
        "--outDir",
        validationFileFolder.pathname,
    ])
}

async function generateValidationTypes() {
    await generateTypings(paths.validationFile, paths.schemaDir)
}
