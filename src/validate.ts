import { TSchema, Static } from './index'

export class SchemaError {
  constructor(public message: string, public path: string) {}
}

export const isError = (val: SchemaError | any): val is SchemaError => val instanceof SchemaError

export const validate = (value: any, schema: TSchema<any>, path: string = ''): Static<typeof schema> | SchemaError => {

  const {
    type = '',
    optional = false,
    enum: allowedValues
  } = schema

  if (typeof value==='undefined' && optional) {
    // Undefined is valid
    return value as unknown as Static<typeof schema>
  }

  switch (type) {
    case 'null':
      if (value!==null) return new SchemaError('must be null', path)
    break

    case 'string':
      if (typeof value!=='string') return new SchemaError('must be string', path)
    break
    case 'number':
      if (typeof value!=='number') return new SchemaError('must be number', path)
    break
    case 'boolean':
      if (typeof value!=='boolean') return new SchemaError('must be boolean', path)
    break

    case 'array':
      if (!Array.isArray(value)) return new SchemaError('must be array', path)
    break
    case 'object': {

      if (typeof value!=='object' || Array.isArray(value)) {
        return new SchemaError('must be object', path)
      }

      const keys = Object.keys(value)

      let currentPath = path

      for (const key of keys) {

        const keyValue = value[key]

        currentPath = path ? `${path}.${key}` : key

        console.log(`validate object path ${currentPath}`)

        if (schema.properties && schema.properties[key]) {

          const keySchema = schema.properties[key]
          const keyResult = validate(keyValue, keySchema, currentPath)

          if (isError(keyResult)) return keyResult

          continue // valid
        }

        if (schema.additionalProperties) {

          const keySchema = schema.additionalProperties
          const keyResult = validate(keyValue, keySchema, currentPath)

          if (isError(keyResult)) return keyResult

          continue // valid
        }

        return new SchemaError('object has unexpected key', currentPath)
      }
    }
    break
    default:
    break
  }

  if (allowedValues && allowedValues.indexOf(value) < 0) {
    return new SchemaError(`must be one of: ${allowedValues.join(', ')}`, path)
  }

  return value as Static<typeof schema>
}
