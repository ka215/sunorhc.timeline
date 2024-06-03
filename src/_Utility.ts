export const Utility = {
  deserialize<R>(arg?: string | null): R {
    // IS THE STRING NULL OR UNDEFINED?
    if (arg === null || arg === undefined) {
      return arg as R
    }
    // IS THE STRING 'undefined'?
    if (arg === 'undefined') {
      return undefined as R
    }
    // IS THE STRING EMPTY?
    if (arg === '') {
      return arg as R
    }
    // IS THE STRING A NUMBER?
    if (!isNaN(Number(arg))) {
      return parseFloat(arg) as R;
    }
    // IS THE STRING A BOOLEAN?
    if (arg === 'true') {
      return true as R
    }
    if (arg === 'false') {
      return false as R
    }
    // IS THE STRING JSON?
    try {
      const potentiallyParsableJson = arg
      // wrap all strings wrapped in single quotes with double quotes
      .replace(/'([^']+)'/g, '"$1"')
      // wrap all unquoted keys in double quotes
      .replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')
      // remove all trailing commas
      .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')

      return JSON.parse(potentiallyParsableJson)
    } catch (e) {
      // WE'VE RUN OUT OF OPTIONS, JUST RETURN THE STRING
      return arg as R
    }    
  },
    
}