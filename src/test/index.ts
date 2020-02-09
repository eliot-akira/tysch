import { test, runTests } from 'testra'
import { type as t, Static, validate, isError } from '../index'

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

test('type.enum', (it, is) => {

  // Enum must be literal type

  let schema = t.enum(1, 2, 3)
  let result

  it('is valid for number value included in enum', !isError(validate(1, schema)))
  it('is not valid for number value not included in enum', isError(validate(0, schema)))
  it('is not valid for string value not included in enum', isError(validate('0', schema)))
  it('is not valid for boolean value not included in enum', isError(validate(true, schema)))
  it('is not valid for array value not included in enum', isError(validate([], schema)))
  it('is not valid for object value not included in enum', isError(validate({}, schema)))

  schema = t.enum('1', '2', '3')
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


runTests()
