// Product-independent general-purpose utility methods
// Methods:
// isObject, isNumberString, isBooleanString, isEmptyObject, isValidURL, isValidPath, isURLOrPath,
// basename, getExt, inRange, inArray, snakeToCamel, ensureEndsWithS, sprintf, hash, 
// deepMergeObjects, deepCloneObject, cloneObject, 

/**
 * Finds whether the given variable is an object.
 * 
 * @param {any} value 
 * @returns {boolean}
 */
export const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object'
}

/**
 * Determines if the given variable is a numeric string.
 * 
 * @param {string} numstr
 * @returns {boolean}
 */
export const isNumberString = (numstr: string): boolean => {
    return typeof numstr === 'string' && numstr !== '' && !isNaN(Number(numstr))
}

/**
 * Determines if the given variable is a boolean string.
 * @param {string} boolstr
 * @returns {boolean}
 */
export const isBooleanString = (boolstr: string): boolean => {
    return typeof boolstr === 'string' && /^(true|false)$/i.test(boolstr)
}

/**
 * Finds whether the given variable is an empty object.
 * 
 * @param {any} value 
 * @returns {boolean}
 */
export const isEmptyObject = (value: any): boolean => {
    return isObject(value) && Object.keys(value).length === 0 && value.constructor === Object
}

/**
 * Checks if a string is a valid URL.
 * 
 * @param str - The string to check.
 * @returns True if the string is a valid URL, otherwise false.
 */
export const isValidURL = (str: string): boolean => {
    /* If use URL object:
    try {
        const url = new URL(str)
        // Ensure the URL has a valid protocol (http, https, ftp)
        return ['http:', 'https:', 'ftp:'].includes(url.protocol)
    } catch (error) {
        return false
    }
    */
    // Regular expression to check if a string is a valid URL
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return urlPattern.test(str)
}
  
/**
 * Checks if a string is a valid path (absolute or relative).
 * 
 * @param str - The string to check.
 * @returns True if the string is a valid path, otherwise false.
 */
export const isValidPath = (str: string): boolean => {
    // Regular expression to match absolute and relative paths
    const absolutePathPattern = /^([a-zA-Z]:\\|\/)/
    const relativePathPattern = /^(\.\/|\.\.\/|[^:]+\/)/

    return absolutePathPattern.test(str) || relativePathPattern.test(str)
}
  
/**
 * Checks if a string is a valid URL or Path (absolute or relative).
 * 
 * @param str - The string to check.
 * @returns True if the string is a valid URL or Path, otherwise false.
 */
export const isURLOrPath = (str: string): boolean => {
    return isValidURL(str) || isValidPath(str)
}

/**
 * Given a string containing the path to a file or directory, 
 * this function will return the trailing name component.
 * If the given path ends in a file, only the file name without 
 * the extension is returned.
 * 
 * @param {string} path 
 * @returns {string}
 */
export const basename = (path: string): string => {
    /* Readable code: 
    // Check if the input is a non-empty string
    if (typeof path !== 'string' || path === '') {
        return ''
    }

    // Split the path by directory separators
    const pathComponents = path.split(/[\/\\]/)

    // Get the last component from the split path
    const lastComponent = pathComponents.pop()
    if (!lastComponent) {
        return ''
    }

    // Split the last component by '.' and get the first part
    const nameWithoutExtension = lastComponent.split('.').shift()
    return nameWithoutExtension ?? ''
    */
    return typeof path === 'string' && path !== '' ? path.split(/[\/\\]/).pop()!.split('.').shift() || '' : ''
}

/**
 * Gets the extension from the given file path.
 * 
 * @param {string} path 
 * @returns {string}
 */
export const getExt = (path: string): string => {
    /* Use URL object:
    if (typeof path !== 'string' || path === '' || path.indexOf('.') === -1) {
        return ''
    } else if (typeof URL !== 'undefined' && URL.canParse(path)) {
        const url = new URL(path) ?? ''
        return url.pathname.indexOf('.') !== -1 ? url.pathname.split('.').pop()! ?? '' : ''
    } else {
        return path.split('.').pop()! ?? ''
    }
    */
    if (typeof path !== 'string' || path === '' || path.indexOf('.') === -1) {
        return ''
    }
    // Remove query string and hash
    const cleanPath = path.split('?')[0].split('#')[0]

    const lastSegment = cleanPath.split('/').pop()!.split('\\').pop()
    const match = lastSegment?.match(/\.([^.]+)$/)
    return match ? match[1] : ''  
}

/**
 * Return true if a number is in range, otherwise false.
 * 
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export const inRange = (num: number, min: number, max: number): boolean => {
    if (isNaN(num) || max < min) {
        return false
    } else {
        num = Number(num)
        return ((num - min) * (num - max) <= 0)
    }
}

/**
 * Whether a given array contains multiple values.
 * 
 * @param {string | string[] | number | number[]} contains value to search for. If you want to search for multiple values, specify them as an array.
 * @param {string[] | number[]} targetArray                array to search.
 * @param {boolean}             atLeastOne                 test if at least one value, from given values.
 * @returns {boolean} true if the targetArray contains all the values in contains (or at least one value if atLeastOne is true), false otherwise.
 */
export const inArray = (
    contains: string | string[] | number | number[],
    targetArray: string[] | number[],
    atLeastOne = false
): boolean => {
    const containsArray: (string | number)[] = Array.isArray(contains) ? contains : [contains]
    if (!Array.isArray(targetArray) || targetArray.length == 0) return false
    
    const includesItems = <T>(array1: T[], array2: T[], flag: boolean): boolean => {
        return flag ? array1.some(item => array2.includes(item)) : array1.every(item => array2.includes(item))
    }
    return includesItems(containsArray, targetArray, atLeastOne)
}


/**
 * Extract duplicate values in an array as a unique array.
 * 
 * @param {T[]} array 
 * @returns {T[]}
 */
export const getDuplicateValues = <T>(array: T[]): T[] => {
    // A map that counts the number of appearances.
    const countMap = new Map<T, number>()
  
    // Scan the array and count the number of occurrences.
    for (const item of array) {
      countMap.set(item, (countMap.get(item) || 0) + 1)
    }
  
    // Extract only duplicate elements as unique arrays.
    const duplicates = Array.from(countMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([item, _]) => item)
  
    return duplicates
}

/**
 * Convert a string in snake case (snake_case) to camel case (camelCase).
 * 
 * @param {string} str
 * @param {boolean} toUpper To upper camel case if true, default to false.
 * @returns {string}
 */
export const snakeToCamel = (str: string = '', toUpper: boolean = false): string => {
    if (typeof str !== 'string') {
        return ''
    }
    
    const camelCaseStr = str.replace(/_./g, match => match.charAt(1).toUpperCase())
    
    return toUpper ? camelCaseStr.replace(/^\w/, c => c.toUpperCase()) : camelCaseStr
}

/**
 * Adds 's' to the end of the string if it doesn't already end with 's'.
 * 
 * @param {string} input - The input string.
 * @returns {string} - The modified string with 's' added if needed.
 */
export const ensureEndsWithS = (input: string): string => {
    return input.endsWith('s') ? input : input + 's'
}

/**
 * Formats a string using sprintf-like syntax.
 * 
 * @param {string} format - The format string.
 * @param {any[]} args - The arguments to replace placeholders in the format string.
 * @returns {string} - The formatted string.
 */
export const sprintf = (format: string, ...args: any[]): string => {
    return format.replace(/%([%sdf])/g, (_, specifier) => {
        const arg = args.shift()
        switch (specifier) {
            case '%':
                return '%'
            case 's':
                return String(arg)
            case 'd':
            case 'f':
                if (typeof arg === 'number') {
                    return specifier === 'd' ? Math.floor(arg).toString() : arg.toFixed(2)
                }
                return ''
            /* v8 ignore next 4 */
            default:
                // Although it never matches this conditional expression, it is defined as a type guard.
                /* istanbul ignore if */
                return ''
        }
    })
}

/**
 * Generate syrb53 hash
 * 
 * @param {string?} str 
 * @param {number?} seed 
 * @returns {number}
 */
export const hash = (str: string = '', seed: number = 0): number => {
    let h1: number = 0xdeadbeef ^ seed,
        h2: number = 0x41c6ce57 ^ seed

    for (let i: number = 0, ch: number; i < str.length; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

/**
 * Deep copy and merge two given objects. If the object's properties are 
 * objects, deep copy and merge them recursively.
 * 
 * @param {object} obj1 
 * @param {object} obj2 
 * @returns             the merged result object
 */
export const deepMergeObjects = <T extends Record<string, any>, U extends Record<string, any>>(
    obj1: T,
    obj2: U
): T & U => {
    const result = { ...obj1 }

    for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
            if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
                if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
                    result[key] = deepMergeObjects(result[key], obj2[key])
                } else {
                    result[key] = deepMergeObjects({}, obj2[key])
                }
            } else {
                result[key] = obj2[key] as any
            }
        }
    }

    return result as T & U
}

/**
 * Deep clones an object.
 * Supports objects containing circular references and functions.
 * 
 * @param {T} obj - The object to clone.
 * @param {WeakMap<Object, any>} [clones=new WeakMap()] - (Optional) Map to track cloned objects to avoid circular references.
 * @returns {T} - The deep clone of the object.
 */
export const deepCloneObject = <T>(obj: T, clones: WeakMap<Object, any> = new WeakMap()): T => {
    // Handle null or non-object values
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // Handle specific objects
    //const constructors = [DOMRect, CanvasRenderingContext2D, DocumentFragment, CanvasRenderingContext2D, Date, RegExp]
    const constructors = [DOMRect, HTMLElement, DocumentFragment, RegExp, Date]
    if (constructors.some(constructor => obj instanceof constructor)) {
        return obj
    //} else if (obj instanceof Date) {
    //    console.log('clone Date object:', obj)
    //    return new Date(obj.getTime())
    }

    // Check if the object has already been cloned
    //console.log(clones, clones.has(obj), obj)
    if (clones.has(obj)) {
        return clones.get(obj)
    }

    // Create an empty object with the same prototype as the original object
    const clonedObj = Object.create(Object.getPrototypeOf(obj))

    // Register the cloned object in the map
    clones.set(obj, clonedObj)

    // Iterate over the object's properties and clone each one recursively
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepCloneObject(obj[key], clones)
        }
    }

    return clonedObj as T
}

/**
 * Clones a simple object without circular references or functions.
 * 
 * @param {T} obj - The object to clone.
 * @returns {T} - The deep clone of the object.
 */
export const cloneObject = <T>(obj: T): T => {
    // import cloneDeep form 'lodash/cloneDeep'
    // return cloneDeep(obj)
    return JSON.parse(JSON.stringify(obj))
}

