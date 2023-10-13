import fs from "fs"
import tsj from "ts-json-schema-generator"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import standaloneCode from "ajv/dist/standalone/index.js"

import { paths } from "./config.js"

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

export async function compileValidationFile() {
    const schemas = typeScriptToJsonSchema(paths.typeDir, paths.schemaDir)
    await compileAjvStandalone(schemas, paths.validationFile)
}
