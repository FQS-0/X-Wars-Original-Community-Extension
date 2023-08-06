import { ValidateFunction, ErrorObject } from "ajv"

export class TypeError extends Error {
    public ajvErrors: ErrorObject[]
    constructor(ajvErrors: ErrorObject[]) {
        super(JSON.stringify(ajvErrors))
        this.name = "TypeError"
        this.ajvErrors = ajvErrors
    }
}

export function ensureType<T>(
    validationFunc: (
        data: unknown,
        instanceData?:
            | {
                  instancePath?: string
                  parentData: unknown
                  parentDataProperty: unknown
                  rootData?: unknown
              }
            | undefined
    ) => boolean,
    data: T
): T {
    const validate = validationFunc as ValidateFunction<T>
    if (!validate) throw new Error("Validate not defined, schema not found")

    /* Casting to and from JSON forces the object to be represented in its primitive types.
     *  The Date object for example will be forced to a ISO 8601 representation which is what we want */
    const isValid = validate(JSON.parse(JSON.stringify(data)))
    if (!isValid) throw new TypeError(validate.errors!)

    return data
}
