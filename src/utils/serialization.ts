
export const serialize = (obj: Record<string, any>): string => {
  return JSON.stringify(obj, (_, value) => {
      if (typeof value === 'function') {
          return `__FUNCTION__${value.toString()}`
      }
      return value
  })
}

/**
 * Deserialize a serialized string.
 * 
 * @param {string | null} arg 
 * @returns {R}
 */
export const deserialize = <R>(arg?: string | null): R => {
    // is the argument null or undefined?
    if (arg === null || arg === undefined) {
      return arg as R
    }
    // is the string "undefined"?
    if (arg === 'undefined') {
      return undefined as R
    }
    // is the string empty?
    if (arg === '') {
      return arg as R
    }
    // is the string a number?
    if (!isNaN(Number(arg))) {
      return parseFloat(arg) as R
    }
    // is the string a boolean?
    if (arg === 'true') {
      return true as R
    }
    if (arg === 'false') {
      return false as R
    }
    // is the string JSON?
    try {
      const potentiallyParsableJson = arg
      // wrap all strings wrapped in single quotes with double quotes
      .replace(/'([^']+)'/g, '"$1"')
      // wrap all unquoted keys in double quotes
      .replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')
      // remove all trailing commas
      .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')

      return JSON.parse(potentiallyParsableJson, (_, value) => {
        if (typeof value === 'string' && value.startsWith('__FUNCTION__')) {
          const functionBody = value.substring(12)
          return new Function(`return ${functionBody}`)()
        }
        return value
      })
    } catch (e) {
      // We've run out of options, just return the string
      return arg as R
    }    
}
