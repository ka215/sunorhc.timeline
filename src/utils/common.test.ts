//import { describe, expect, it } from 'vitest'
import { isObject, isNumberString, isBooleanString, isEmptyObject, isValidURL, isValidPath, isURLOrPath, basename, getExt, inRange, inArray, getDuplicateValues, snakeToCamel, ensureEndsWithS, sprintf, hash, deepMergeObjects, deepCloneObject, cloneObject } from './common'

describe('isObject', () => {

    it('should handle null', () => {
        expect(isObject(null)).toEqual(false)
    })

    it('should handle undefined', () => {
        expect(isObject(undefined as any)).toEqual(false)
    })
    
    it(`should handle 'null'`, () => {
        expect(isObject('null')).toEqual(false)
    })
    
    it(`should handle 'undefined'`, () => {
        expect(isObject('undefined')).toEqual(false)
    })
    
    it('should handle empty strings', () => {
        expect(isObject('')).toEqual(false)
    })
    
    it('should handle normal strings', () => {
        expect(isObject('test')).toEqual(false)
    })
    
    it('should handle numbers', () => {
        expect(isObject(33)).toEqual(false)
    })
    
    it('should handle boolean', () => {
        expect(isObject(true)).toEqual(false)
    })
  
    it('should handle a value of "true"', () => {
        expect(isObject('true')).toEqual(false)
    })
    
    it('should handle a value of "false"', () => {
        expect(isObject('false')).toEqual(false)
    })

    it('should handle empty object', () => {
        expect(isObject({})).toEqual(true)
    })

    it('should handle a shallow object', () => {
        expect(isObject({ str: 'str', boo: true, num: 3 })).toEqual(true)
    })
    
    it('should handle a deep object', () => {
        expect(isObject({ str: 'str', boo: true, num: 3, arr: [1, 2, 3], obj: { one: { two: { three: 3 } } } }))
        .toEqual(true)
    })
    
    it('should handle arrays', () => {
        expect(isObject(['str', true, 3 ])).toEqual(true)
    })

    it('should handle arrays may have a tailing comma', () => {
        expect(isObject(['str', true, 3, ])).toEqual(true)
    })

    it('should handle Symbol', () => {
        expect(isObject(Symbol('test'))).toEqual(false)
    })
    
    it('should handle iterator object', () => {
        function* makeIterator() {
            yield 1;
            yield 2;
        }
        const iterator = makeIterator()
        expect(isObject(iterator)).toEqual(true)
    })

    it('should handle DOM element', () => {
        const element = document.createElement('p')
        expect(isObject(element)).toEqual(true)
    })

    it('returns true for an object', () => {
        expect(isObject({})).toBe(true)
        expect(isObject({ key: 'value' })).toBe(true)
        expect(isObject([])).toBe(true) // Arrays are also treated as objects.
        expect(isObject(new Date())).toBe(true)
    })

    it('returns false for null', () => {
        expect(isObject(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isObject(undefined)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isObject('string')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isObject(123)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isObject(true)).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isObject(() => {})).toBe(false)
    })

})

describe('isNumberString', () => {

    it('should handle null as falsy', () => {
        expect(isNumberString(null as unknown as string)).toEqual(false)
    })
    it('should handle undefined as falsy', () => {
        expect(isNumberString(undefined as unknown as string)).toEqual(false)
    })
    
    it(`should handle 0 as falsy`, () => {
        expect(isNumberString(0 as unknown as string)).toEqual(false)
    })
    
    it(`should handle 1 as falsy`, () => {
        expect(isNumberString(1 as unknown as string)).toEqual(false)
    })
    
    it('should handle empty strings as falsy', () => {
        expect(isNumberString('')).toEqual(false)
    })
    
    it('should handle normal strings as falsy', () => {
        expect(isNumberString('test')).toEqual(false)
    })
    
    it('should handle numbers as falsy', () => {
        expect(isNumberString(33 as unknown as string)).toEqual(false)
    })

    it('should handle numeric strings as truthy', () => {
        expect(isNumberString('53')).toEqual(true)
    })

    it('should handle boolean as falsy', () => {
        expect(isNumberString(true as unknown as string)).toEqual(false)
    })

    it('returns true for numeric string "123"', () => {
        expect(isNumberString('123')).toBe(true)
    })

    it('returns true for numeric string "0"', () => {
        expect(isNumberString('0')).toBe(true)
    })

    it('returns true for numeric string "-123"', () => {
        expect(isNumberString('-123')).toBe(true)
    })

    it('returns true for numeric string with decimal point "3.14"', () => {
        expect(isNumberString('3.14')).toBe(true)
    })

    it('returns false for non-numeric string "abc"', () => {
        expect(isNumberString('abc')).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isNumberString('')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isNumberString(null as unknown as string)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isNumberString(undefined as unknown as string)).toBe(false)
    })

    it('returns false for boolean value', () => {
        expect(isNumberString(true as unknown as string)).toBe(false)
        expect(isNumberString(false as unknown as string)).toBe(false)
    })
    
})

describe('isBooleanString', () => {

    it('should handle null as falsy', () => {
        expect(isBooleanString(null)).toEqual(false)
    })
    it('should handle undefined as falsy', () => {
        expect(isBooleanString()).toEqual(false)
    })
    
    it(`should handle 0 as falsy`, () => {
        expect(isBooleanString(0)).toEqual(false)
    })
    
    it(`should handle 1 as falsy`, () => {
        expect(isBooleanString(1)).toEqual(false)
    })
    
    it('should handle empty strings as falsy', () => {
        expect(isBooleanString('')).toEqual(false)
    })
    
    it('should handle normal strings as falsy', () => {
        expect(isBooleanString('test')).toEqual(false)
    })
    
    it('should handle numbers as falsy', () => {
        expect(isBooleanString(33)).toEqual(false)
    })

    it('should handle numeric strings as falsy', () => {
        expect(isBooleanString('1')).toEqual(false)
    })

    it('should handle boolean as falsy', () => {
        expect(isBooleanString(true)).toEqual(false)
    })

    it('should handle boolean as falsy', () => {
        expect(isBooleanString(false)).toEqual(false)
    })

    it('should handle "true" as truthy', () => {
        expect(isBooleanString('true')).toEqual(true)
    })

    it('should handle "false" as truthy', () => {
        expect(isBooleanString('false')).toEqual(true)
    })

    it('returns true for lowercase "true"', () => {
        expect(isBooleanString('true')).toBe(true)
    })

    it('returns true for uppercase "TRUE"', () => {
        expect(isBooleanString('TRUE')).toBe(true)
    })

    it('returns true for lowercase "false"', () => {
        expect(isBooleanString('false')).toBe(true)
    })

    it('returns true for uppercase "FALSE"', () => {
        expect(isBooleanString('FALSE')).toBe(true)
    })

    it('returns false for other string values', () => {
        expect(isBooleanString('foo')).toBe(false)
        expect(isBooleanString('')).toBe(false)
        expect(isBooleanString('1')).toBe(false)
        expect(isBooleanString('0')).toBe(false)
        expect(isBooleanString('boolean')).toBe(false)
    })

    it('returns false for non-string values', () => {
        expect(isBooleanString(true)).toBe(false)
        expect(isBooleanString(false)).toBe(false)
        expect(isBooleanString(123)).toBe(false)
        expect(isBooleanString(null)).toBe(false)
        expect(isBooleanString(undefined)).toBe(false)
    })

})

describe('isEmptyObject', () => {

    it('should handle null', () => {
        expect(isEmptyObject(null)).toEqual(false)
    })

    it('should handle undefined', () => {
        expect(isEmptyObject()).toEqual(false)
    })
    
    it(`should handle 'null'`, () => {
        expect(isEmptyObject('null')).toEqual(false)
    })
    
    it(`should handle 'undefined'`, () => {
        expect(isEmptyObject('undefined')).toEqual(false)
    })
    
    it('should handle empty strings', () => {
        expect(isEmptyObject('')).toEqual(false)
    })
    
    it('should handle normal strings', () => {
        expect(isEmptyObject('test')).toEqual(false)
    })
    
    it('should handle numbers', () => {
        expect(isEmptyObject(33)).toEqual(false)
    })
    
    it('should handle boolean', () => {
        expect(isEmptyObject(true)).toEqual(false)
    })
  
    it('should handle a value of "true"', () => {
        expect(isEmptyObject('true')).toEqual(false)
    })
    
    it('should handle a value of "false"', () => {
        expect(isEmptyObject('false')).toEqual(false)
    })

    it('should handle empty object', () => {
        expect(isEmptyObject({})).toEqual(true)
    })

    it('should handle a shallow object', () => {
        expect(isEmptyObject({ str: 'str', boo: true, num: 3 })).toEqual(false)
    })
    
    it('should handle a deep object', () => {
        expect(isEmptyObject({ str: 'str', boo: true, num: 3, arr: [1, 2, 3], obj: { one: { two: { three: 3 } } } }))
        .toEqual(false)
    })
    
    it('should handle arrays', () => {
        expect(isEmptyObject(['str', true, 3 ])).toEqual(false)
    })

    it('should handle arrays may have a tailing comma', () => {
        expect(isEmptyObject(['str', true, 3, ])).toEqual(false)
    })

    it('should handle Symbol', () => {
        expect(isEmptyObject(Symbol('test'))).toEqual(false)
    })
    
    it('should handle iterator object', () => {
        function* makeIterator() {
            yield 1;
            yield 2;
        }
        const iterator = makeIterator()
        expect(isEmptyObject(iterator)).toEqual(false)
    })

    it('should handle DOM element', () => {
        const element = document.createElement('p')
        expect(isEmptyObject(element)).toEqual(false)
    })

    it('returns true for an empty object', () => {
        expect(isEmptyObject({})).toBe(true)
    })

    it('returns false for a non-empty object', () => {
        expect(isEmptyObject({ key: 'value' })).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isEmptyObject([])).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isEmptyObject('')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isEmptyObject(123)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isEmptyObject(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isEmptyObject(undefined)).toBe(false)
    })

})

describe('isValidURL', () => {

    it('should handle null', () => {
        expect(isValidURL(null)).toBe(false)
    })

    it('should handle undefined', () => {
        expect(isValidURL()).toBe(false)
    })

    it('should handle empty strings', () => {
        expect(isValidURL('')).toBe(false)
    })

    it('should handle number', () => {
        expect(isValidURL(123)).toBe(false)
    })

    it('should handle numeric strings', () => {
        expect(isValidURL('555')).toBe(false)
    })

    it('should handle url strings', () => {
        expect(isValidURL('http://example.com')).toBe(true)
        expect(isValidURL('https://example.com')).toBe(true)
        expect(isValidURL('http://localhost:3333')).toBe(true)
        expect(isValidURL('ftp://example.com')).toBe(true)
    })

    it('should handle path strings', () => {
        expect(isValidURL('/home/user')).toBe(false)
        expect(isValidURL('C:\\Users\\User')).toBe(false)
        expect(isValidURL('./folder')).toBe(false)
        expect(isValidURL('../folder')).toBe(false)
        expect(isValidURL('folder/subfolder')).toBe(false)
        expect(isValidURL('./file.txt')).toBe(false)
        expect(isValidURL('../file.txt')).toBe(false)
        expect(isValidURL('folder/subfolder/file.txt')).toBe(false)
    })

    it('should handle invalid strings', () => {
        expect(isValidURL('invalid string')).toBe(false)
    })

})

describe('isValidPath', () => {

    it('should handle null', () => {
        expect(isValidPath(null)).toBe(false)
    })

    it('should handle undefined', () => {
        expect(isValidPath()).toBe(false)
    })

    it('should handle empty strings', () => {
        expect(isValidPath('')).toBe(false)
    })

    it('should handle number', () => {
        expect(isValidPath(123)).toBe(false)
    })

    it('should handle numeric strings', () => {
        expect(isValidPath('555')).toBe(false)
    })

    it('should handle url strings', () => {
        expect(isValidPath('http://example.com')).toBe(false)
        expect(isValidPath('https://example.com')).toBe(false)
        expect(isValidPath('http://localhost:3333')).toBe(false)
        expect(isValidPath('ftp://example.com')).toBe(false)
    })

    it('should handle path strings', () => {
        expect(isValidPath('/home/user')).toBe(true)
        expect(isValidPath('C:\\Users\\User')).toBe(true)
        expect(isValidPath('./folder')).toBe(true)
        expect(isValidPath('../folder')).toBe(true)
        expect(isValidPath('folder/subfolder')).toBe(true)
        expect(isValidPath('./file.txt')).toBe(true)
        expect(isValidPath('../file.txt')).toBe(true)
        expect(isValidPath('folder/subfolder/file.txt')).toBe(true)
    })

    it('should handle invalid strings', () => {
        expect(isValidPath('invalid string')).toBe(false)
    })

})

describe('isURLOrPath', () => {

    it('should handle null', () => {
        expect(isURLOrPath(null)).toBe(false)
    })

    it('should handle undefined', () => {
        expect(isURLOrPath()).toBe(false)
    })

    it('should handle empty strings', () => {
        expect(isURLOrPath('')).toBe(false)
    })

    it('should handle number', () => {
        expect(isURLOrPath(123)).toBe(false)
    })

    it('should handle numeric strings', () => {
        expect(isURLOrPath('555')).toBe(false)
    })

    it('should handle url strings', () => {
        expect(isURLOrPath('http://example.com')).toBe(true)
        expect(isURLOrPath('https://example.com')).toBe(true)
        expect(isURLOrPath('http://localhost:3333')).toBe(true)
        expect(isURLOrPath('ftp://example.com')).toBe(true)
    })

    it('should handle path strings', () => {
        expect(isURLOrPath('/home/user')).toBe(true)
        expect(isURLOrPath('C:\\Users\\User')).toBe(true)
        expect(isURLOrPath('./folder')).toBe(true)
        expect(isURLOrPath('../folder')).toBe(true)
        expect(isURLOrPath('folder/subfolder')).toBe(true)
        expect(isURLOrPath('./file.txt')).toBe(true)
        expect(isURLOrPath('../file.txt')).toBe(true)
        expect(isURLOrPath('folder/subfolder/file.txt')).toBe(true)
    })

    it('should handle invalid strings', () => {
        expect(isURLOrPath('invalid string')).toBe(false)
    })

})

describe('basename', () => {

    it('should return an empty string for non-string input', () => {
        expect(basename(undefined as any)).toBe('')
        expect(basename(null as any)).toBe('')
        expect(basename(123 as any)).toBe('')
        expect(basename({} as any)).toBe('')
    })

    it('should return an empty string for an empty string input', () => {
        expect(basename('')).toBe('')
    })

    it('should return the correct basename for a path with forward slashes', () => {
        expect(basename('/path/to/some/file.txt')).toBe('file')
        expect(basename('/path/to/some/')).toBe('')
        expect(basename('file.txt')).toBe('file')
        expect(basename('file')).toBe('file')
    })

    it('should return the correct basename for a path with backward slashes', () => {
        expect(basename('\\path\\to\\some\\file.txt')).toBe('file')
        expect(basename('\\path\\to\\some\\')).toBe('')
        expect(basename('file.txt')).toBe('file')
        expect(basename('file')).toBe('file')
    })

    it('should handle paths with mixed slashes', () => {
        expect(basename('/path\\to/some\\file.txt')).toBe('file')
        expect(basename('/path\\to\\some/')).toBe('')
    })

    it('should handle files with multiple dots correctly', () => {
        expect(basename('/path/to/some/file.with.dots.txt')).toBe('file')
        expect(basename('file.with.dots.txt')).toBe('file')
        expect(basename('file.with.dots')).toBe('file')
        expect(basename('/path/to/some/.')).toBe('')
        expect(basename('/path/to/some/..')).toBe('')
        expect(basename('/path/to/some/.file')).toBe('')
    })

    it('should handle paths without extensions correctly', () => {
        expect(basename('/path/to/some/file')).toBe('file')
        expect(basename('file')).toBe('file')
    })

    it('should return empty string if path ends with a slash', () => {
        expect(basename('/path/to/some/')).toBe('')
        expect(basename('/path/to/some')).toBe('some')
    })

    it('should handle URL strings', () => {
        expect(basename('https://example.com/demo.html?param=query#hash')).toBe('demo')
        expect(basename('https://example.com/test/')).toBe('')
    })

})

describe('getExt', () => {
    /*
    beforeAll(async () => {
        const window = new Window({ url: 'https://localhost:8080' })
        await window.happyDOM.waitUntilComplete()
        globalThis.URL = window.URL
    })

    afterAll(() => {
        mockURL.mockReset()
    })
    */

    it('should return empty string if path is not a string', () => {
        expect(getExt(null as unknown as string)).toBe('')
        expect(getExt(undefined as unknown as string)).toBe('')
        expect(getExt(123 as unknown as string)).toBe('')
    })

    it('should return empty string if path is an empty string', () => {
        expect(getExt('')).toBe('')
    })

    it('should return empty string if path does not contain a dot', () => {
        expect(getExt('filename')).toBe('')
        expect(getExt('path/to/filename')).toBe('')
    })

    it('should handle strings containing the path like windows', () => {
        expect(getExt('C:\\User\\document\\temp')).toEqual('')
        expect(getExt('C:\\User\\document\\temp\\')).toEqual('')
        expect(getExt('C:\\User\\document\\test.pdf')).toEqual('pdf')
        expect(getExt('\\path\\to\\filename.txt#segment')).toEqual('txt')
        expect(getExt('\\path\\to\\filename.tar.gz?version=1')).toEqual('gz')
    })

    it('should return extension from a file path', () => {
        expect(getExt('filename.txt')).toBe('txt')
        expect(getExt('path/to/filename.txt')).toBe('txt')
        expect(getExt('path.to/filename.with.dots.ext')).toBe('ext')
    })

    it('should return extension from a URL', () => {
        expect(getExt('http://example.com/path/to/filename.txt')).toBe('txt')
        expect(getExt('https://example.com/path/to/filename.with.dots.ext')).toBe('ext')
        expect(getExt('https://example.com/demo.html?param=query#hash')).toEqual('html')
    })

    it('should return empty string if URL can be parsed but does not contain a dot in the pathname', () => {
        expect(getExt('http://example.com/path/to/filename')).toBe('')
        expect(getExt('https://example.com/?param=query')).toEqual('')
        expect(getExt('https://example.com/#hash')).toEqual('')
    })

    it('should fallback to file path extension if URL.canParse is not available', () => {
        expect(getExt('http://example.com/path/to/filename.txt')).toBe('txt')
        expect(getExt('https://example.com/path/to/filename.with.dots.ext')).toBe('ext')
    })

    it('should return empty string if path is trailing dot', () => {
        expect(getExt('filename.')).toBe('')
        expect(getExt('path/to/filename.')).toBe('')
        expect(getExt('C:\\User\\document\\test.')).toEqual('')
        expect(getExt('http://example.com/path/to/filename.')).toBe('')
        expect(getExt('filename...')).toBe('')
    })

})

describe('inRange', () => {

    it('should handle undefined', () => {
        expect(inRange()).toEqual(false)
    })
    
    it('should handle empty strings', () => {
        expect(inRange('')).toEqual(false)
    })

    it('should handle numeric strings', () => {
        expect(inRange('1', '2', '3')).toEqual(false)
    })

    it('should handle out of range number as falsy', () => {
        expect(inRange(1, 2, 3)).toEqual(false)
    })

    it('should handle out of range float number as truthy', () => {
        expect(inRange(1.1, 1.2, 1.4)).toEqual(false)
    })

    it('should handle in range number as truthy', () => {
        expect(inRange(2, 0, 4)).toEqual(true)
    })

    it('should handle in range float number as truthy', () => {
        expect(inRange(1.2, 1.1, 1.4)).toEqual(true)
    })

    it('should handle given invalid range as falsy', () => {
        expect(inRange(3, 5, 1)).toEqual(false)
    })

    it('should handle given same range as truthy', () => {
        expect(inRange(3, 3, 3)).toEqual(true)
    })

    it('should handle in range number contains minus number as truthy', () => {
        expect(inRange(0, -2, 1)).toEqual(true)
    })

    it('returns false if the number is not in range', () => {
        expect(inRange(5, 10, 20)).toBe(false)
    })

    it('returns true if the number is equal to the minimum value', () => {
        expect(inRange(10, 10, 20)).toBe(true)
    })

    it('returns true if the number is equal to the maximum value', () => {
        expect(inRange(20, 10, 20)).toBe(true)
    })

    it('returns true if the number is within the range', () => {
        expect(inRange(15, 10, 20)).toBe(true)
    })

    it('returns false if the maximum value is less than the minimum value', () => {
        expect(inRange(15, 20, 10)).toBe(false)
    })

    it('returns false if the number is NaN', () => {
        expect(inRange(NaN, 10, 20)).toBe(false)
    })
})

describe('inArray', () => {

    it('should handle undefined', () => {
        expect(inArray()).toEqual(false)
    })

    it('should handle empty strings', () => {
        expect(inArray('')).toEqual(false)
    })

    it('should handle invalid arguments', () => {
        expect(inArray('', [])).toEqual(false)
    })

    it('returns false if targetArray is not an array', () => {
        expect(inArray('value', 'not an array')).toBe(false)
    })

    it('returns true if targetArray contains all values in contains array', () => {
        expect(inArray(['a', 'b'], ['a', 'b', 'c'])).toBe(true)
    })

    it('returns false if targetArray does not contain all values in contains array', () => {
        expect(inArray(['a', 'd'], ['a', 'b', 'c'])).toBe(false)
    })

    it('returns true if atLeastOne is true and targetArray contains at least one value in contains array', () => {
        expect(inArray(['a', 'd'], ['a', 'b', 'c'], true)).toBe(true)
    })

    it('returns false if atLeastOne is true and targetArray does not contain any value in contains array', () => {
        expect(inArray(['x', 'y'], ['a', 'b', 'c'], true)).toBe(false)
    })

    it('should handle matched string from string[]', () => {
        expect(inArray('cat', ['bear', 'cat', 'dog', 'fox'])).toEqual(true)
    })

    it('should handle unmatched string from string[]', () => {
        expect(inArray('wolf', ['bear', 'cat', 'dog', 'fox'])).toEqual(false)
    })

    it('should handle matched string from number[]', () => {
        expect(inArray(301, [101, 201, 301, 401])).toEqual(true)
    })

    it('should handle unmatched string from number[]', () => {
        expect(inArray(111, [222, 333, 444, 555])).toEqual(false)
    })

    it('should handle multiple matched string from string[]', () => {
        expect(inArray(['cat', 'fox'], ['bear', 'cat', 'dog', 'fox'])).toEqual(true)
    })

    it('should handle multiple unmatched string from string[]', () => {
        expect(inArray(['lion', 'rabbit'], ['bear', 'cat', 'dog', 'fox'])).toEqual(false)
    })

    it('should handle multiple unmatched string from string[]', () => {
        expect(inArray(['dog', 'rabbit'], ['bear', 'cat', 'dog', 'fox'])).toEqual(false)
    })

    it('should handle at least one matching from multiple needles string from string[]', () => {
        expect(inArray(['lion', 'dog', 'rabbit'], ['bear', 'cat', 'dog', 'fox'], true)).toEqual(true)
    })

    it('should handle at least one matching from multiple needles string from number[]', () => {
        expect(inArray([2016, 2018, 2020], [2020, 2021, 2022, 2023, 2024], true)).toEqual(true)
    })

    it('should handle unmatched value from object[]', () => {
        expect(inArray({ name: 'Joe' }, [ { name: 'Joe' }, { name: 'Mike' }, { name: 'Sara' } ])).toEqual(false)
    })

    it('should handle matched empty from string[]', () => {
        expect(inArray('', [ 'first', 'second', 'third', '', '', null ])).toEqual(true)
    })

    it('should handle matched null from string[]', () => {
        expect(inArray(null, [ 'first', 'second', 'third', '', null, '' ])).toEqual(true)
    })

    it('should handle matched from date string[]', () => {
        const needleDate = new Date("2024-05-03T01:23:45.678Z")// .toDateString: "Mon May 03 2024"
        const targetArray = [
            new Date("2024-04-29T12:34:56.789Z").toDateString(),// "Mon Apr 29 2024"
            new Date("2024-05-03T01:23:45Z").toDateString(),// "Mon May 03 2024" is same needleDate
            needleDate.toLocaleDateString(),// "2024/5/6"
            needleDate.toUTCString(),// "Mon, 06 May 2024 01:23:45 GMT"
            new Date().toDateString(),// "Mon May 06 2024"
        ]
        expect(inArray(needleDate.toDateString(), targetArray)).toEqual(true)
    })

    it('should handle unmatched from date object[]', () => {
        const needleDate = new Date("2024-05-04T01:23:45.678Z")
        expect(inArray(needleDate, [new Date("2024-04-29T12:34:56.789Z"), new Date("2024-05-04T01:23:45.678Z"), new Date()])).toEqual(false)
    })

})

describe('getDuplicateValues', () => {

  it('should return an empty array when given an empty array', () => {
    const result = getDuplicateValues([])
    expect(result).toEqual([])
  })

  it('should return an empty array when there are no duplicates', () => {
    const result = getDuplicateValues([1, 2, 3, 4, 5])
    expect(result).toEqual([])
  })

  it('should return an array with duplicate values only', () => {
    const result = getDuplicateValues([1, 2, 2, 3, 4, 4, 5])
    expect(result).toEqual([2, 4])
  })

  it('should handle strings as array elements', () => {
    const result = getDuplicateValues(['apple', 'banana', 'apple', 'cherry', 'banana', 'date'])
    expect(result).toEqual(['apple', 'banana'])
  })

  it('should handle boolean values as array elements', () => {
    const result = getDuplicateValues([true, false, true, true, false, false])
    expect(result).toEqual([true, false])
  })

  it('should handle objects as array elements', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const obj3 = { id: 1 } // Different object, same content
    const result = getDuplicateValues([obj1, obj2, obj1, obj3])
    expect(result).toEqual([obj1])
  })

  it('should return the correct array when all elements are duplicates', () => {
    const result = getDuplicateValues([1, 1, 1, 1])
    expect(result).toEqual([1])
  })

  it('should return the correct array when elements are mixed types and have duplicates', () => {
    const result = getDuplicateValues([1, '1', 1, '1', true, true])
    expect(result).toEqual([1, '1', true])
  })

})

describe('snakeToCamel', () => {

    it('should handle undefined', () => {
        expect(snakeToCamel()).toEqual('')
    })

    it('should handle empty strings', () => {
        expect(snakeToCamel('')).toEqual('')
    })

    it('should handle number', () => {
        expect(snakeToCamel(123)).toEqual('')
    })

    it('should handle snake case strings with underbar to lower camel case', () => {
        expect(snakeToCamel('snake_case_string')).toEqual('snakeCaseString')
    })

    it('should handle snake case strings with comma to upper camel case', () => {
        expect(snakeToCamel('snake_case_string', true)).toEqual('SnakeCaseString')
    })

    it('should handle capital case strings', () => {
        expect(snakeToCamel('CapitalCaseString')).toEqual('CapitalCaseString')
    })

})

describe('ensureEndsWithS', () => {

    it('should handle empty strings', () => {
        expect(ensureEndsWithS('')).toEqual('s')
    })

    it('should handle that tail of strings is not "s"', () => {
        expect(ensureEndsWithS('cat')).toEqual('cats')
        expect(ensureEndsWithS('JAZZ')).toEqual('JAZZs')
        expect(ensureEndsWithS('MOS')).toEqual('MOSs')
    })

    it('should handle that tail of strings is "s"', () => {
        expect(ensureEndsWithS('dogs')).toEqual('dogs')
        expect(ensureEndsWithS('class')).toEqual('class')
        expect(ensureEndsWithS('bus')).toEqual('bus')
    })

})

describe('sprintf', () => {

    it('should handle replace with string specifier', () => {
        const result = sprintf('%s', 'Hello')
        expect(result).toBe('Hello')
    })

    it('should handle replace with integer specifier', () => {
        const result = sprintf('%d', 10)
        expect(result).toBe('10')
    })

    it('should handle replace with floating point specifier', () => {
        const result = sprintf('%f', 3.14159)
        expect(result).toBe('3.14')
    })

    it('should handle replace with percentage specifier', () => {
        const result = sprintf('%%')
        expect(result).toBe('%')
    })

    it('should handle replace with mixed specifiers', () => {
        const result = sprintf('Value: %s, Count: %d, Pi: %f', 'test', 5, 3.14159)
        expect(result).toBe('Value: test, Count: 5, Pi: 3.14')
    })

    it('should handle replace with insufficient arguments', () => {
        const result = sprintf('Value: %s, Count: %d', 'test')
        expect(result).toBe('Value: test, Count: ')
    })

    it('should handle replace with invalid specifiers', () => {
        const result = sprintf('Value: %x, Count: %f', 'test', 5)
        expect(result).toBe('Value: %x, Count: ')
    })

})

describe('hash', () => {

    it('should handle undefined', () => {
        expect(hash()).toEqual(3338908027751811)
    })

    it('should handle empty strings', () => {
        expect(hash('')).toEqual(3338908027751811)
    })

    it('should handle number', () => {
        expect(hash(123)).toEqual(3338908027751811)
    })

    it('should handle normal strings', () => {
        expect(hash('test')).toEqual(8713769735217609)
    })

    it('should handle multibyte strings', () => {
        expect(hash('∀≑⌘')).toEqual(5438331974746668)
    })

})

describe('deepMergeObjects', () => {

    it('merges two objects correctly', () => {
        const obj1 = { a: 1, b: 'hello' }
        const obj2 = { b: 'world', c: true }
        const result = deepMergeObjects(obj1, obj2)
        const expected = { a: 1, b: 'world', c: true }
        expect(result).toEqual(expected)
    })

    it('works with objects of different types', () => {
        const obj1 = { a: 1, b: 'hello' }
        const obj2 = { c: true, d: { nested: 'value' } }
        const result = deepMergeObjects(obj1, obj2)
        const expected = { a: 1, b: 'hello', c: true, d: { nested: 'value' } }
        expect(result).toEqual(expected)
    })

    it('handles empty objects correctly', () => {
        const obj1 = {}
        const obj2 = {}
        const result = deepMergeObjects(obj1, obj2)
        const expected = {}
        expect(result).toEqual(expected)
    })

    it('Identical properties between objects will be overwritten', () => {
        const obj1 = { a: 1, b: 'hello' }
        const obj2 = { a: true, b: 2, c: 'world' }
        const result = deepMergeObjects(obj1, obj2)
        const expected = { a: true, b: 2, c: 'world' }
        expect(result).toEqual(expected)
    })

    it('Identical properties between objects with nested object will be overwritten too', () => {
        const obj1 = { a: 1, b: { nested: 'hello' } }
        const obj2 = { a: true, b: { nested: 'value', new: 'world' } }
        const result = deepMergeObjects(obj1, obj2)
        const expected = { a: true, b: { nested: 'value', new: 'world' } }
        expect(result).toEqual(expected)
    })

})

describe('deepCloneObject', () => {

    it('should handle given null', () => {
        const result = deepCloneObject(null)
        expect(result).toBe(null)
    })

    it('should handle given empty object', () => {
        const emptyObj = {}
        const clonedObj = deepCloneObject(emptyObj)
        expect(clonedObj).not.toBe(emptyObj)
        expect(clonedObj).toEqual({})
    })

    it('should handle cloning a simple object', () => {
        const origObj = { a: 1, b: 2 }
        const clonedObj = deepCloneObject(origObj)
        expect(clonedObj).not.toBe(origObj)
        expect(Object.keys(clonedObj)).toEqual(Object.keys(origObj))
        expect(clonedObj.a).toEqual(origObj.a)
        expect(clonedObj.b).toEqual(origObj.b)
    })

    it('should handle cloning an object with nested objects', () => {
        const origObj = { a: { b: { c: 1 } } }
        const clonedObj = deepCloneObject(origObj)
        expect(clonedObj).not.toBe(origObj)
        expect(Object.keys(clonedObj)).toEqual(Object.keys(origObj))
        expect(clonedObj.a).toEqual(origObj.a)
        expect(clonedObj.a.b).toEqual(origObj.a.b)
        expect(clonedObj.a.b.c).toEqual(origObj.a.b.c)
    })

    it('should cast to object at cloning an array', () => {
        const arr = [1, 2, 3, 'Four']
        const clonedObj = deepCloneObject(arr)
        expect(clonedObj).not.toBe(arr)
        expect(Object.keys(clonedObj)).toEqual(Object.keys(arr))
        expect(clonedObj['0']).toEqual(arr[0])
    })

    it('should handle cloning an object with circular reference', () => {
        const circularObj: any = { a: 1 }
        circularObj.b = circularObj
        const clonedCircularObj = deepCloneObject(circularObj)
        expect(clonedCircularObj).not.toBe(circularObj)
        expect(clonedCircularObj.b).toBe(clonedCircularObj)
    })

    it('should handle cloning an object with function', () => {
        const functionalObj: any = { id: 1, increment: (n: number = 1) => n++ }
        const clonedFunctionalObj = deepCloneObject(functionalObj)
        const res1 = functionalObj.increment(1)
        const res2 = clonedFunctionalObj.increment(1)
        expect(clonedFunctionalObj).not.toBe(functionalObj)
        expect(clonedFunctionalObj.id).toEqual(functionalObj.id)
        expect(clonedFunctionalObj.increment).toBe(functionalObj.increment)
        expect(res2).toEqual(res1)
    })

    it('should handle cloning an object with HTMLElement or DOMRect object', () => {
        const element = document.createElement('div')
        element.id = 'test-id'
        element.classList.add('test-class')
        const originObj = { elm: element, rect: element.getBoundingClientRect() }
        const clonedObj = deepCloneObject(originObj)
        expect(clonedObj).not.toBe(originObj)
        expect(clonedObj.elm.id).toEqual(originObj.elm.id)
        expect(clonedObj.elm.classList.contains('test-class')).toBe(true)
        expect(clonedObj.rect).toEqual(originObj.rect)
        expect(clonedObj.rect.x).toEqual(originObj.rect.x)
        expect(clonedObj.rect.width).toEqual(originObj.rect.width)
    })

    it('should handle cloning an object with Date object', () => {
        const utcDate = new Date('2024-05-13T15:00:00Z')
        const jstDate = new Date('2024-05-13T15:00:00')
        const originObj = { utc: utcDate, jst: jstDate }
        const clonedObj = deepCloneObject(originObj)
        expect(clonedObj).not.toBe(originObj)
        expect(clonedObj.utc).toEqual(originObj.utc)
        expect(clonedObj.jst).toEqual(originObj.jst)
    })

    it('should handle cloning an object with RegExp object', () => {
        const regex1 = new RegExp('^sample-\\d+$')
        const regex2 = new RegExp(/^test_(\d+)$/, 'i')
        const originObj = { pattern1: regex1, pattern2: regex2 }
        const clonedObj = deepCloneObject(originObj)
        expect(clonedObj).not.toBe(originObj)
        expect(clonedObj.pattern1).toEqual(originObj.pattern1)
        expect(clonedObj.pattern2).toEqual(originObj.pattern2)
        expect(clonedObj.pattern1.test('sample-123')).toEqual(true)
        expect(clonedObj.pattern2.test('Test_890')).toEqual(true)
        expect(clonedObj.pattern2.flags).toEqual('i')
    })

})

describe('cloneObject', () => {

    it('should clone a simple object without circular references or functions', () => {
        // Define a sample object
        const originalObject = {
            name: 'John',
            age: 30,
            address: {
                city: 'New York',
                country: 'USA',
                hobby: [
                    'reading',
                    'game',
                    'travel',
                ],
            }
        }

        // Clone the object using cloneObject function
        const clonedObject = cloneObject(originalObject)

        // Check if the cloned object is equal to the original object
        expect(clonedObject).toEqual(originalObject)
    })

})

