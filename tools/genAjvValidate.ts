import fs from "fs"
import tsj from "ts-json-schema-generator"
import { JSONSchema7 } from "json-schema"
import Ajv from "ajv"
import standaloneCode from "ajv/dist/standalone/index.js"
import esbuild from "esbuild"
import { spawn } from "child_process"

/**
 * Runs a command, returns the stdout on a successful exit code(0)
 * @param command The executable name
 * @param args The args as a string
 * @param cwd Current Working Directory
 * @param echoOutputs Pipes the command standard streams directly to this process to get the output as it is happening,
 *                    not waiting for the exit code
 * @param prefixOutputs Useful if running multiple commands in parallel
 * @param extraEnv Extra variables to pass as Environment variables
 * @return {Promise<string>}
 */
async function execCommand(
    command: string,
    args: string,
    cwd = import.meta.url,
    echoOutputs = true,
    prefixOutputs = "",
    extraEnv = {}
) {
    return new Promise((resolve, reject) => {
        let allData = ""
        let errOutput = ""
        const call = spawn(command, [args], {
            shell: true,
            windowsVerbatimArguments: true,
            cwd: cwd,
            env: { ...process.env, ...extraEnv },
        })

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

function clearDir(destDir: URL) {
    fs.rmSync(destDir, { recursive: true, force: true })
    fs.mkdirSync(destDir, { recursive: true })
}

function fixRef(def: JSONSchema7) {
    if (typeof def.$ref === "string") {
        def.$ref = def.$ref.replace("#/definitions/", "")
    }
    Object.entries(def).forEach(([, definition]) => {
        if (typeof definition === "object") fixRef(definition)
    })
}

function typeScriptToJsonSchema(srcDir: URL, destDir: URL) {
    const config = {
        path: srcDir.pathname + "/**/*.ts",
        type: "*",
    }

    console.time("* TS TO JSONSCHEMA")
    const schemaRaw = tsj.createGenerator(config).createSchema(config.type)
    console.timeEnd("* TS TO JSONSCHEMA")

    if (!schemaRaw.definitions) throw new Error("found no definitions")
    const schemas: JSONSchema7[] = []
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

function compileAjvStandalone(schemas: JSONSchema7[], validationFile: URL) {
    console.time("* AJV COMPILE")
    const ajv = new Ajv.default({
        schemas: schemas,
        code: { source: true, esm: true },
    })
    //addFormats(ajv);
    const moduleCode = standaloneCode.default(ajv)
    console.timeEnd("* AJV COMPILE")
    fs.writeFileSync(validationFile, moduleCode)
}

function esBuildCommonToEsm(validationFile: URL) {
    console.time("* ES BUILD")
    esbuild.buildSync({
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
    console.timeEnd("* ES BUILD")
}

async function generateTypings(validationFile: URL, validationFileFolder: URL) {
    console.time("* TSC DECLARATIONS")
    await execCommand(
        "npx",
        'tsc -allowJs --declaration --emitDeclarationOnly "' +
            validationFile.pathname +
            '" --outDir "' +
            validationFileFolder.pathname +
            '"'
    )
    console.timeEnd("* TSC DECLARATIONS")
}

async function buildTypes() {
    const paths = {
        types: new URL("../src/lib/json/types/", import.meta.url),
        typesJsonSchema: new URL("../src/lib/json/schemas/", import.meta.url),
        validationFile: new URL(
            "../src/lib/json/schemas/validations.js",
            import.meta.url
        ),
    }

    /* Clear the output dir for the AJV validation code, definition and JSON Schema definitions */
    clearDir(paths.typesJsonSchema)

    /* Create the JSON Schema files from the TS Types and save them as individual JSON Schema files */
    const schemas = typeScriptToJsonSchema(paths.types, paths.typesJsonSchema)

    /* Create the AJV validation code in ESM format from the JSON Schema files */
    compileAjvStandalone(schemas, paths.validationFile)

    /* Bundle the AJV validation code file in ESM format */
    esBuildCommonToEsm(paths.validationFile)

    /* Create TypeScript typings for the generated AJV validation code */
    await generateTypings(paths.validationFile, paths.typesJsonSchema)
}

buildTypes()
