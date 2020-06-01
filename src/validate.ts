import { Static, TBase, TSchema } from './index'

export class SchemaError {
  constructor(public message: string, public path: string) {}
}

export const isError = (val: SchemaError | any): val is SchemaError => val instanceof SchemaError

export const validate = <T>(value: any, schema: TSchema, path: string = ''): T | SchemaError => {

  const {
    type = '',
    optional = false,
    items,
    enum: allowedValues,
    anyOf,
    allOf,
    isStrict = false
  } = schema

  if (typeof value==='undefined' && optional) {
    // Undefined is valid
    return value as unknown as T // Static<typeof schema>
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
      if (typeof items!=='undefined') {
        const checkValues =
          // Strict: Check every value in array
          isStrict ? value
            // Loose: Check only first value, if exists
            : value.length ? [value[0]] : []

        for (const val of checkValues) {
          const result = validate(val, items, path)
          if (isError(result)) return result
        }
      }
    break
    case 'object': {

      if (typeof value!=='object' || Array.isArray(value)) {
        return new SchemaError('must be object', path)
      }

      const keys = Object.keys(value)

      if (schema.properties) {
        for (const key in schema.properties) {

          const currentPath = path ? `${path}.${key}` : key

          const keySchema = schema.properties[key]
          const result = validate(value[key], keySchema, currentPath)

          if (isError(result)) return result

          // Valid - Remove from keys to check after
          const index = keys.indexOf(key)
          if (index >= 0) keys.splice(index, 1)
        }
      }

      if (schema.additionalProperties) {

        // All other keys must match schema given in additionalProperties

        for (const key in keys) {

          const currentPath = path ? `${path}.${key}` : key

          const keySchema = schema.additionalProperties
          const result = validate(value[key], keySchema, currentPath)

          if (isError(result)) return result

          // Valid - Remove from keys to check after
          const index = keys.indexOf(key)
          if (index >= 0) keys.splice(index, 1)
        }
      }

      // By default, allow additional properties
      const key = keys.shift()

      if (isStrict && key) {
        const currentPath = path ? `${path}.${key}` : key
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

  if (anyOf) {
    let matchedOne = false
    for (const eachSchema of anyOf) {
      const eachResult = validate(value, eachSchema, path)
      if (!isError(eachResult)) {
        // Matched a schema
        matchedOne = true
        break
      }
    }
    if (!matchedOne) return new SchemaError('must match any of given schema', path)
  }

  if (allOf) {
    for (const eachSchema of allOf) {
      const eachResult = validate(value, eachSchema, path)
      if (isError(eachResult)) return eachResult
    }
  }

  return value as T // Static<typeof schema>
}
