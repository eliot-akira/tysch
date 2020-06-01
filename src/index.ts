export * from './validate'

// Adapted from https://github.com/sinclairzx81/typebox/

/** Schema definition for validation, simplified JSON schema */
export interface TSchema {
  static: any
  type?: TSchemaValidTypeName
  optional?: boolean
  enum?: TLiteralType[]
  pattern?: string
  minimum?: number
  maximum?: number
  properties?: { [key: string]: TSchema }
  additionalProperties?: TSchema
  items?: TSchema
  isStrict?: boolean
  anyOf?: TSchema[]
  allOf?: TSchema[]
}

export type TSchemaValidTypeName = 'null' | 'string' | 'number' | 'boolean' | 'array' | 'object' //  TODO: 'date'


/** Reflects simplified type name */
type ReflectedTypeName = 'undefined' | 'null' | 'function' | 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'

function reflect(value: any): ReflectedTypeName {
  if (value === undefined) { return 'undefined' }
  if (value === null) { return 'null' }
  if (typeof value === 'function') { return 'function' }
  if (typeof value === 'string') { return 'string' }
  if (typeof value === 'number') { return 'number' }
  if (typeof value === 'boolean') { return 'boolean' }
  if (typeof value === 'object') {
    if (value instanceof Array) { return 'array' }
    if (value instanceof Date) { return 'date' }
  }
  return 'object'
}

/** Returns unique elements */
function distinct(items: string[]): string[] {
  return items.reduce<string[]>((acc, c) => {
    if (acc.indexOf(c) === -1) { acc.push(c) }
    return acc
  }, [])
}

export interface WithOptional {
  optional?: boolean
}

export interface WithIsStrict {
  isStrict?: boolean
}

/** Type base */
export interface TBase<T> extends WithOptional, WithIsStrict {
  static: T
}

/**
 * Static<T> resolves TBase<T> to a static TypeScript type.
 * Use Static<typeof schema> to get the type of created schema.
 */
export type Static<T extends TBase<any>> = T['static']

export type TLiteralType = number | string | boolean

export interface TAny extends TBase<any> {}
export interface TNever extends TBase<never> {}
export interface TUndefined extends TBase<undefined> {}
export interface TNull extends TBase<null> { type: 'null' }
export interface TLiteral<T extends TLiteralType> extends TBase<T> { type: TSchemaValidTypeName, enum: [T] }
export interface TString extends TBase<string> { type: 'string' }
export interface TPattern extends TBase<string> { type: 'string', pattern: string }
export interface TNumber extends TBase<number> { type: 'number' }
export interface TRange extends TBase<number> { type: 'number',  minimum: number, maximum: number }
export interface TBoolean extends TBase<boolean> { type: 'boolean' }
export interface TOptional<T extends TBase<any>> extends TBase<Static<T>> {}
export type TObjectProperties = { [K in string]: TBase<any> }
export type TObjectOptionalProperties = { [K in string]?: TBase<any> }
export type TObjectPropertiesWithOptional = TObjectProperties | TObjectOptionalProperties

export interface TObject<T extends TObjectProperties> extends TBase<{ [K in keyof T]: Static<T[K]> }> {
  type: 'object',
  properties: T
}

export interface TDictionary<T extends TBase<any>> extends TBase<{ [key: string]: Static<T> }> {
  type: 'object'
  additionalProperties: T
}

export interface TArray<T extends TBase<any>> extends TBase<Array<Static<T>>> {
  type: 'array',
  items: T
}

export interface TTUnion1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  anyOf: [T1]
}
export interface TTUnion2<T1 extends TBase<any>, T2 extends TBase<any>>
  extends TBase<Static<T1> | Static<T2>> {
  anyOf: [T1, T2]
}
export interface TTUnion3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3>> {
  anyOf: [T1, T2, T3]
}
export interface TTUnion4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4>> {
  anyOf: [T1, T2, T3, T4]
}
export interface TTUnion5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5>> {
  anyOf: [T1, T2, T3, T4, T5]
}
export interface TTUnion6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6>> {
  anyOf: [T1, T2, T3, T4, T5, T6]
}
export interface TTUnion7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7>> {
  anyOf: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TTUnion8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7> | Static<T8>> {
  anyOf: [T1, T2, T3, T4, T5, T6, T7, T8]
}

export interface TIntersect1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  allOf: [T1]
}
export interface TIntersect2<T1 extends TBase<any>, T2 extends TBase<any>>
  extends TBase<Static<T1> & Static<T2>> {
  allOf: [T1, T2]
}
export interface TIntersect3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3>> {
  allOf: [T1, T2, T3]
}
export interface TIntersect4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4>> {
  allOf: [T1, T2, T3, T4]
}
export interface TIntersect5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5>> {
  allOf: [T1, T2, T3, T4, T5]
}
export interface TIntersect6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6>> {
  allOf: [T1, T2, T3, T4, T5, T6]
}
export interface TIntersect7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase< Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7>> {
  allOf: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TIntersect8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase< Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7> & Static<T8>> {
  allOf: [T1, T2, T3, T4, T5, T6, T7, T8]
}

export interface TEnum1<T1 extends TLiteralType> extends TBase<T1> {
  type: TSchemaValidTypeName // Was: LiteralType
  enum: [T1]
}
export interface TEnum2<T1 extends TLiteralType, T2 extends TLiteralType> extends TBase<T1 | T2> {
  type: TSchemaValidTypeName
  enum: [T1, T2]
}
export interface TEnum3<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType> extends TBase<T1 | T2 | T3> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3]
}
export interface TEnum4<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3, T4]
}
export interface TEnum5<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3, T4, T5]
}
export interface TEnum6<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3, T4, T5, T6]
}
export interface TEnum7<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6 | T7> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TEnum8<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType, T8 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8> {
  type: TSchemaValidTypeName
  enum: [T1, T2, T3, T4, T5, T6, T7, T8]
}


class TypeBuilder {

  /** Schema for type 'any' */
  public any(): TAny {
    return { } as TAny
  }

  /** Schema for type 'null' */
  public null(): TNull {
    return { type: 'null' } as TNull
  }

  /** Schema for type 'number' */
  public number(value?: number): TNumber {
    if (typeof value!=='undefined') return this.literal(value)
    return { type: 'number' } as TNumber
  }

  /** Schema for type 'string' */
  public string(value?: string): TString {
    if (typeof value!=='undefined') return this.literal(value)
    return { type: 'string' } as TString
  }

  /** Schema for type 'boolean' */
  public boolean(value?: boolean): TBoolean {
    if (typeof value!=='undefined') return this.literal(value)
    return { type: 'boolean' } as TBoolean
  }

  /** creates boolean literal value. Statically resolves to the given type 'boolean' */
  public literal(value: boolean): TBoolean
  /** creates string literal value. Statically resolves to the given type 'string' */
  public literal(value: string): TString
  /** creates number literal value. Statically resolves to the given type 'number' */
  public literal(value: number): TNumber
  /** Creates a JSON schema literal validator for the given literal value. Statically resolves to the given type 'boolean' or 'string' or 'number' */
  public literal<T extends TLiteralType>(value: T): TString | TNumber | TBoolean {
    const type = reflect(value)
    switch (type) {
      case 'number':
        return ({ type, enum: [value] } as any) as TNumber
      case 'boolean':
        return ({ type, enum: [value] } as any) as TBoolean
      case 'string':
        return ({ type, enum: [value] } as any) as TString
      default:
        throw Error('literal only allows for string, number or boolean value')
    }
  }

  /** Schema for optional value of type T | undefined */
  public optional<T extends TBase<any>>(type: T): TOptional<T | TUndefined> {
    return { ...type, optional: true } as TOptional<T | TUndefined>
  }

  /** Schema for type 'object' with given property types */
  public object<T extends TObjectProperties>(properties: T = {} as T): TObject<T> {
    return { type: 'object', properties, isStrict: false } as TObject<T>
  }

  /** Schema for type 'object' with given property types and no extra properties */
  public strictObject<T extends TObjectProperties>(properties: T = {} as T): TObject<T> {
    return { type: 'object', properties, isStrict: true } as TObject<T>
  }

  /** Schema for type dictionary with string keys. Statically resolves to an TDictionary<T> */
  public dictionary<T extends TBase<any>>(type: T = (undefined as any) as T): TDictionary<T> {
    return { type: 'object', additionalProperties: type } as TDictionary<T>
  }

  /** Schema for type array. Statically resolves to an Array<T> */
  public array<T extends TBase<any>>(type: T = undefined as any as T): TArray<T> {
    return { type: 'array', items: type === undefined ? {} : type, isStrict: false } as TArray<T>
  }

  /** Schema for type array. Statically resolves to an Array<T> */
  public strictArray<T extends TBase<any>>(type: T = undefined as any as T): TArray<T> {
    return { type: 'array', items: type === undefined ? {} : type, isStrict: true } as TArray<T>
  }

  /** Schema for range of type 'number'  */
  public range(minimum: number, maximum: number): TNumber {
    return { type: 'number', minimum, maximum } as any as TNumber
  }

  /** Schema for matching type 'string' */
  public match(regex: RegExp): TString {
    return { type: 'string', pattern: regex.source } as any as TString
  }

  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>>(t1: T1): TTUnion1<T1>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TTUnion2<T1, T2>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TTUnion3<T1, T2, T3>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TTUnion4<T1, T2, T3, T4>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTUnion5<T1, T2, T3, T4, T5>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTUnion6<T1, T2, T3, T4, T5, T6>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTUnion7<T1, T2, T3, T4, T5, T6, T7>
  /** Schema for any of given types */
  public anyOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TTUnion8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Schema for any of given types */
  public anyOf(...types: any[]) {
    if (types.length === 0) {
      throw Error('anyOf requires at least one type.')
    }
    return { anyOf: types } as any
  }
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>>(t1: T1): TIntersect1<T1>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TIntersect2<T1, T2>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TIntersect3<T1, T2, T3>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TIntersect4<T1, T2, T3, T4>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TIntersect5<T1, T2, T3, T4, T5>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ): TIntersect6<T1, T2, T3, T4, T5, T6>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TIntersect7<T1, T2, T3, T4, T5, T6, T7>
  /** Schema for all of given types */
  public allOf<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TIntersect8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Schema for all of given types */
  public allOf(...types: TBase<any>[]) {
    if (types.length === 0) {
      throw Error('Type intersect requires at least one type.')
    }
    return { allOf: types } as any
  }

  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType>(t1: T1): TEnum1<T1>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType>(t1: T1, t2: T2): TEnum2<T1, T2>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType>(t1: T1, t2: T2, t3: T3): TEnum3<T1, T2, T3>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4): TEnum4<T1, T2, T3, T4>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TEnum5<T1, T2, T3, T4, T5>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TEnum6<T1, T2, T3, T4, T5, T6>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TEnum7<T1, T2, T3, T4, T5, T6, T7>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType, T8 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TEnum8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public enum(...items: TLiteralType[]) {
    if (items.length === 0) {
      throw Error('enum types must have at least one value.')
    }
    const typenames = items.map((item) => reflect(item))
    if (distinct(typenames).length > 1) {
      throw Error('enum types must all be of the same literal type.')
    }
    const typename = typenames[0]
    switch (typename) {
      case 'number':  return { type: 'number', enum: items } as any
      case 'boolean': return { type: 'boolean', enum: items } as any
      case 'string':  return { type: 'string', enum: items } as any
      default: throw Error('enum types only allows for string, number and boolean values.')
    }
  }
}

const type = new TypeBuilder()

export { type }
