# tysch

Typed schema with run-time validation

## Install

```sh
yarn add tysch
```

## Use

```ts
import {
  type as t,
  Static,
  validate,
  isError
} from 'tysch'

const userSchema = t.object({
  name: t.string(),
  points: t.number(),
})

type UserSchema = Static<typeof userSchema>

const validData = {
  name: 'me',
  points: 1
}

const result = validate(validData, userSchema)

if (isError(result)) {

  // result is of type SchemaError

} else {

  // result is of type UserSchema

}
```

## Develop this library

Install dependencies

```sh
yarn
```

Develop: Watch files; Recompile, type check and test on changes

```sh
yarn dev
```

Build

```sh
yarn build
```

Publish to NPM

```sh
npm run release
```
