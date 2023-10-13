import { paths } from "./config.js"

import { spawn } from "child_process"
import process from "process"

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

export async function generateValidationTypes() {
    await generateTypings(paths.validationFile, paths.schemaDir)
}
