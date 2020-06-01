import { test, runTests } from 'testra'
import { type as t, Static, validate, isError } from '../index'
import { SchemaError } from '../validate'

/** Test schema */

test('Simple schema', (it) => {

  const testSchema = t.object({
    key1: t.string(),
    key2: t.number()
  })

  it('is able to construct schema', true)
  it('returned schema is an object', typeof testSchema==='object')

  type TestSchema = Static<typeof testSchema>

  const result = validate<TestSchema>({
    key1: '1',
    key2: 2
  }, testSchema)

  it('validate runs', true)
  it('validate returns result', result ? true : false)

  const errorStatus = isError(result)

  it('isError returns boolean', typeof errorStatus==='boolean')
  it('isError returns false on valid schema', errorStatus===false, result)

  // In VS Code, hover on each result below to see how the type is narrowed
  if (isError(result)) {
    result // Instance of SchemaError
  } else {
    result // Valid schema of type TestSchema
  }

  const errorResult = validate<TestSchema>({}, testSchema)

  it('validate returns instance of SchemaError for invalid schema', errorResult instanceof SchemaError, errorResult)
})

const basicTypeTests = {
  number: {
    schema: t.number(),
    valid: 0
  },
  boolean: {
    schema: t.boolean(),
    valid: false
  },
  string: {
    schema: t.string(),
    valid: '0'
  },
  array: {
    schema: t.array(),
    valid: []
  },
  object: {
    schema: t.object(),
    valid: {}
  }
}

for (const thisType of Object.keys(basicTypeTests)) {

  test(`type.${thisType}`, (it, is) => {

    const schema = t[thisType]()
    let result

    for (const key of Object.keys(basicTypeTests)) {

      const testType = basicTypeTests[key]
      const mustBeValid = key===thisType

      result = validate(testType.valid, schema)
      it(`is${
        mustBeValid ? '' : ' not'
      } valid for ${
        key
      }`, mustBeValid ? !isError(result) : isError(result))
    }
  })

}

test('type.enum number', (it, is) => {

  // Enum must be literal type

  const schema = t.enum(1, 2, 3)

  it('is valid for number value included in enum', !isError(validate(1, schema)))
  it('is not valid for number value not included in enum', isError(validate(0, schema)))
  it('is not valid for string value not included in enum', isError(validate('0', schema)))
  it('is not valid for boolean value not included in enum', isError(validate(true, schema)))
  it('is not valid for array value not included in enum', isError(validate([], schema)))
  it('is not valid for object value not included in enum', isError(validate({}, schema)))
})

test('type.enum string', (it, is) => {
  const schema = t.enum('1', '2', '3')
  it('is valid for string value included in enum', !isError(validate('1', schema)))
  it('is not valid for string value not included in enum', isError(validate('0', schema)))
  it('is not valid for number value not included in enum', isError(validate(0, schema)))
  it('is not valid for boolean value not included in enum', isError(validate(true, schema)))
  it('is not valid for array value not included in enum', isError(validate([], schema)))
  it('is not valid for object value not included in enum', isError(validate({}, schema)))
})

// literal

// dictionary

// optional

// anyOf

// allOf

export default runTests()
