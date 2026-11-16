import { createSchema } from 'genson-js'
import fs from 'fs/promises'
import path from 'path'

// Alternative version following the instructor's approach.
function addDateTimeFormat(schema: any) {
    // Handle array items.
    if (schema.type === 'array' && schema.items) {
        addDateTimeFormat(schema.items)
    }

    // Handle object properties.
    if (schema.type === 'object' && schema.properties) {
        for (const [key, value] of Object.entries(schema.properties)) {
            if (key === 'createdAt' || key === 'updatedAt') {
                if ((value as any).type === 'string') {
                    (value as any).format = 'date-time'
                }
            }

            addDateTimeFormat(value)
        }
    }
}

export async function generateNewSchema(responseBody: object, schemaPath: string) {
    try {
        const generatedSchema = createSchema(responseBody)

        // Add the date-time format before saving the schema.
        addDateTimeFormat(generatedSchema)

        await fs.mkdir(path.dirname(schemaPath), { recursive: true })
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
    } catch (error) {
        throw new Error(`Failed to create schema file: ${error.message}`)
    }
}
