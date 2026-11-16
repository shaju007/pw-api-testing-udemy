import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { createSchema } from 'genson-js';
import fs from 'fs/promises'
import path from 'path'

const SCHEMA_BASE_PATH = './response-schemas'
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

export async function validateSchema(dir:string, fileName:string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH,dir,`${fileName}_schema.json`)

    if(createSchemaFlag){
        await generateSchema(responseBody, schemaPath)
    }
    
    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema)
    const valid = validate(responseBody)
    if (!valid) {
        throw new Error(`Schema validation ${fileName}_schema.json failed:\n ${JSON.stringify(validate.errors, null, 4)}\n\n Actual response body:\n ${JSON.stringify(responseBody, null, 4)}`)
    }
}

async function loadSchema(schemaPath:string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
    } catch (error) {
        throw new Error(`Failed to load the schema ${error.message}`)
    }
    
    
}

async function generateSchema(responseBody: object, schemaPath: string) {
    try {
            const generatedSchema = createSchema(responseBody)
            addDateTimeFormats(generatedSchema)
            await fs.mkdir(path.dirname(schemaPath), {recursive: true})
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4),)
        } catch (error) {
            throw new Error(`Failed to create schema file: ${error.message}`)
        }
}

function addDateTimeFormats(schema: Record<string, any>) {
    if (schema.properties) {
        for (const [name, property] of Object.entries(schema.properties)) {
            const propertySchema = property as Record<string, any>

            if (
                (name === 'createdAt' || name === 'updatedAt') &&
                propertySchema.type === 'string'
            ) {
                propertySchema.format = 'date-time'
            }

            addDateTimeFormats(propertySchema)
        }
    }

    if (schema.items) {
        addDateTimeFormats(schema.items)
    }
}
