import esbuild from "esbuild"
import process from "process"
import { watch } from "chokidar"
import { polyfillNode } from "esbuild-plugin-polyfill-node"

import fs from "fs"
import tsj from "ts-json-schema-generator"
import { JSONSchema7 } from "json-schema"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import standaloneCode from "ajv/dist/standalone/index.js"
import { spawn } from "child_process"

async function execCommand(
    command: string,
    args: string[],
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
    addFormats.default(ajv)
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
    await execCommand("npx", [
        "tsc",
        "--allowJs",
        "--declaration",
        "--emitDeclarationOnly",
        validationFile.pathname,
        "--outDir",
        validationFileFolder.pathname,
    ])
    console.timeEnd("* TSC DECLARATIONS")
}

async function buildTypes() {
    console.log("Building types")
    const paths = {
        types: new URL("src/lib/json/types/", import.meta.url),
        typesJsonSchema: new URL("src/lib/json/schemas/", import.meta.url),
        validationFile: new URL(
            "src/lib/json/schemas/validations.js",
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

async function build(dev = false) {
    try {
        console.log("Starting build...")
        const meta = await esbuild.build({
            entryPoints: [
                "./src/scripts/content/menu.ts",
                "./src/scripts/content/resources.tsx",
                "./src/scripts/content/status.ts",
                "./src/scripts/content/top.ts",
                "./src/scripts/content/bank.tsx",
                "./src/scripts/content/overview.ts",
                "./src/scripts/content/production_list.ts",
                "./src/scripts/content/fleet_movement.ts",
                "./src/scripts/content/fleet_command.js",
                "./src/scripts/content/fleet_command_give_order.js",
                "./src/scripts/content/trade_create_offer.tsx",
                "./src/scripts/content/trades.tsx",
                "./src/scripts/content/messages_events.js",
                "./src/scripts/content/construction.js",
                "./src/scripts/options/options.tsx",
                "./src/scripts/popup/popup.tsx",
            ],
            bundle: true,
            minify: dev ? false : true,
            splitting: false,
            sourcemap: dev ? "inline" : false,
            target: ["chrome89", "firefox89"],
            outdir: "./build",
            outbase: "src",
            metafile: dev ? false : true,
            define: {
                "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
                "process.env.NODE_DEBUG": "false",
            },
            format: "esm",
            plugins: [
                polyfillNode({
                    globals: { process: false },
                }),
            ],
        })
        if (!dev) fs.writeFileSync("meta.json", JSON.stringify(meta.metafile))
        console.log(`${new Date()} Build successful.`)
    } catch (e) {
        console.log(`${new Date()} Build error: ${e}`)
    }
}

const dev = process.argv.includes("--development")

if (!dev) clearDir(new URL("build/scripts", import.meta.url))

await buildTypes()
build(dev)

if (process.argv.includes("--watch")) {
    const watcher = watch(["src/**/*"])
    console.log("Watching files")
    watcher.on("change", async (path) => {
        if (path.startsWith("src/lib/json/types/")) {
            await buildTypes()
            build(dev)
        } else if (!path.startsWith("src/lib/json/")) {
            build(dev)
        }
    })
}
