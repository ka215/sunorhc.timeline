import { describe, expect, it } from 'vitest'
import { serialize, deserialize } from './serialization'

describe('serialize and deserialize functions', () => {
  it('should serialize and deserialize an object with primitive types', () => {
    const obj = { name: 'John', age: 30, isStudent: false }
    const serialized = serialize(obj)
    const deserialized = deserialize<typeof obj>(serialized)
    expect(deserialized).toEqual(obj)
  })

  it('should serialize and deserialize an object with functions', () => {
    const obj = { func: () => 42 }
    const serialized = serialize(obj)
    const deserialized = deserialize<typeof obj>(serialized)
    expect(typeof deserialized.func).toBe('function')
    expect(deserialized.func()).toBe(42)
  })

  it('should handle null, undefined, empty string, and special strings', () => {
    expect(deserialize(null)).toBeNull()
    expect(deserialize('undefined')).toBeUndefined()
    expect(deserialize('')).toBe('')
    expect(deserialize('123')).toBe(123)
    expect(deserialize('true')).toBe(true)
    expect(deserialize('false')).toBe(false)
  })

  it('should handle invalid JSON strings gracefully', () => {
    const invalidArg = 'invalid argument'
    expect(deserialize(invalidArg)).toBe(invalidArg)
  })
})

describe('deserialize function', () => {

  it('should return null if argument is null', () => {
    expect(deserialize(null)).toBeNull()
    expect(deserialize('null')).toBeNull()
  })

  it('should return undefined if argument is "undefined"', () => {
    expect(deserialize()).toBeUndefined()
    expect(deserialize(undefined)).toBeUndefined()
    expect(deserialize('undefined')).toBeUndefined()
  })

  it('should return empty string if argument is empty string', () => {
    expect(deserialize('')).toBe('')
    expect(deserialize<null>('')).toBe('')
    expect(deserialize<undefined>('')).toBe('')
  })

  it('should return number if argument is a valid number string', () => {
    expect(deserialize<number>('123')).toBe(123)
    expect(deserialize<number>('1e3')).toBe(1000)
    expect(deserialize<number>('1.41421356')).toBe(1.41421356)
    expect(deserialize<number>('.1234')).toBe(0.1234)
    expect(deserialize<boolean>('1')).toBe(1)
    expect(deserialize<boolean>('0')).toBe(0)
  })

  it('should return boolean true if argument is "true"', () => {
    expect(deserialize<boolean>('true')).toBe(true)
  })

  it('should return boolean false if argument is "false"', () => {
    expect(deserialize<boolean>('false')).toBe(false)
  })

  it('should parse JSON string correctly', () => {
    const jsonString = '{"name": "John", "age": 30, "nested": {"hoby": ["travel", "game", "music"]}}'
    expect(deserialize(jsonString)).toEqual({ name: 'John', age: 30, nested: { hoby: ['travel', 'game', 'music'] } })
  })

  it('should simply return the same string if it is not valid JSON', () => {
    // is not valid because string value is not enclosed in quotes.
    expect(deserialize(`{ str: str, boo: true }`)).toEqual('{ str: str, boo: true }')
    const invalidJSON = `{
      "alpha": true,
      // Comments not allowed (in strict mode)
      "beta": [1, 2, 3]
    }`
    expect(deserialize(invalidJSON)).toBe(invalidJSON)
  })

  it('arrays may have a tailing comma', () => {
    expect(deserialize(`{ arr: [1, 2, 3], }`)).toEqual({ arr: [1, 2, 3] })
  })

  it('objects may have a tailing comma', () => {
    expect(deserialize(`{ obj: {one: 'test'}, }`)).toEqual({ obj: { one: 'test' } })
  })

  it('should parse JSON string with function correctly', () => {
    const jsonString = '{"func": "__FUNCTION__function() { return 5; }"}'
    const result: any = deserialize(jsonString)
    expect(result).toEqual({ func: expect.any(Function) })
    expect(result!.func()).toBe(5)
  })

  it('should return argument as is if it cannot be parsed', () => {
    const invalidArg = 'invalid argument'
    expect(deserialize(invalidArg)).toBe(invalidArg)
  })
})
