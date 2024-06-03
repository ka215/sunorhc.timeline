// Datetime-related general-purpose helper methods
// Methods:
// getIntlDateTimeFormatOptions, getStartOfYearInTimeZone, getWeekNumber, parseDateTime, isCurrentDate,
// getTimeZoneOffset, addToDate, addTime, toValidScale, truncateLowerScales, getStartDatetime,
// getEndDatetime,

import { Scale, DateTimeObject } from '@/types/definitions'
import { isEmptyObject, deepMergeObjects } from './common'

/**
 * Gets Intl.DateTimeFormatOptions in the specified time zone.
 * You can override options by passing any property/value pairs object of the option you want 
 * to change as the 3rd argument.
 * @param {string} timeZone 
 * @param {Partial<Intl.DateTimeFormatOptions> | undefined} overrideOptions 
 * @returns {Intl.DateTimeFormatOptions}
 */
export const getIntlDateTimeFormatOptions = (
    timeZone: string = 'UTC',
    overrideOptions?: Partial<Intl.DateTimeFormatOptions>
): Intl.DateTimeFormatOptions => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        //fractionalSecondDigits: 3,
        hour12: false,
        timeZone: timeZone
    }
    if (!!overrideOptions && !isEmptyObject(overrideOptions)) {
        return deepMergeObjects(defaultOptions, overrideOptions) as Intl.DateTimeFormatOptions
    } else {
        return defaultOptions
    }
}

/**
 * Gets the first date of the year in the specified time zone.
 * @param {number} year
 * @param {string} timeZone
 * @returns {Date}
 */
export const getStartOfYearInTimeZone = (year: number, timeZone: string = 'UTC'): Date => {
    const options: Intl.DateTimeFormatOptions = getIntlDateTimeFormatOptions(timeZone)
    const locale: string | undefined = undefined// or 'en-US'
    const formatter = new Intl.DateTimeFormat(locale, options)
    const startOfYearStr = `${year}-01-01T00:00:00${timeZone === 'UTC' ? '.000Z' : ''}`
    const parts = formatter.formatToParts(new Date(startOfYearStr))
    const dateStr = parts.map(({ value }) => value).join('') + (timeZone === 'UTC' ? '.000Z' : '')
    return new Date(dateStr)
}

/**
 * Calculate the number of weeks by calculating the number of days that have passed 
 * since the beginning of the year and dividing it by 7.
 * @param {Date} date
 * @param {string} timeZone
 * @returns {number}
 */
export const getWeekNumber = (date: Date, timeZone: string = 'UTC'): number => {
    // Calculate the day of the year in the given time zone
    const timeZoneOffset = (date.getTime() - new Date(date.toLocaleString(undefined, { timeZone })).getTime())
    const localDate = new Date(date.getTime() + timeZoneOffset)
    // Get the start of the year in the given time zone
    const startOfYear = getStartOfYearInTimeZone(timeZone === 'UTC' ? localDate.getUTCFullYear() : localDate.getFullYear(), timeZone)
    const pastDaysOfYear = Math.floor((localDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1
    // Calculate the week number
    return Math.ceil(pastDaysOfYear / 7)
}

/**
 * Determine whether a date/time string is in a recommended format, including ISO 8601 format.
 * 
 * @param {string} dateString 
 * @returns 
 */
export const isValidISOStrings = (dateString: string): boolean => {
    //const dateRegex = /^(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?)|(\d{2}\/\d{2}\/\d{4}(?: \d{2}:\d{2}(?::\d{2})?)?)$/
    const dateRegex = /^([+-]?\d{1,4}[-\/]\d{1,2}[-\/]\d{1,2}(?:[T\s]\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{1,2}:\d{1,2})?)?)$/
    return dateRegex.test(dateString)
}

/**
 * Retrives an object with datetime elements from a specified datetime string, number, or datetime object.
 *  
 * @param {string | number | Date} dateTime
 * @param {string | undefined} timeZone
 * @param {string[] | undefined} monthNames
 * @param {string[] | undefined} dayNames
 * @param {string | undefined} locale
 * @returns {DateTimeObject}
 */
export const parseDateTime = (dateTime: string | number | Date, timeZone?: string, monthNames?: string[], dayNames?: string[], locale?: string): DateTimeObject | null => {
    // Based "dateObject" must be UTC datetime.
    let dateObject: Date
    let isGivenUTC: boolean = false
    let _localDate: Date
    if (typeof dateTime === 'string') {
        //console.log('parseDateTime::1:', isValidISOStrings(dateTime))
        if (isValidISOStrings(dateTime)) {
            // Date strings matched includes ISO 8601 format.
            const matches = /^((?<_y>[+-]?\d{1,4})[-\/](?<_m>\d{1,2})[-\/](?<_d>\d{1,2})(?:[T\s](?<_h>\d{1,2}):(?<_mi>\d{1,2})(?::(?<_s>\d{1,2})(?:\.(?<_ms>\d{1,3}))?)?(?:(?<_utc>Z)|(?<_tzo>[+-]\d{1,2}:\d{1,2}))?)?)$/.exec(dateTime)
            if (matches?.groups && matches?.length > 0) {
                isGivenUTC = !!matches.groups._utc
                //if (isUTCString) {
                dateObject = new Date(Date.UTC(Number(matches.groups._y), Number(matches.groups._m) - 1, Number(matches.groups._d), Number(matches.groups._h || 0), Number(matches.groups._mi || 0), Number(matches.groups._s || 0), Number(matches.groups._ms || 0)))
                //console.log('parseDateTime::2-1:', matches.groups, isGivenUTC, dateObject)
            }
        } else {
            // Other format of date strings. Treated as a datetime in local timezone.
            _localDate = new Date(dateTime)
            dateObject = new Date(Date.UTC(_localDate.getFullYear(), _localDate.getMonth(), _localDate.getDate(), _localDate.getHours(), _localDate.getMinutes(), _localDate.getSeconds(), _localDate.getMilliseconds()))
            //dateObject = new Date(Date.UTC(_localDate.getUTCFullYear(), _localDate.getUTCMonth(), _localDate.getUTCDate(), _localDate.getUTCHours(), _localDate.getUTCMinutes(), _localDate.getUTCSeconds(), _localDate.getUTCMilliseconds()))
            //console.log('parseDateTime::2-2:', _localDate, isGivenUTC, dateObject)
        }
    } else if (typeof dateTime === 'number' && !Number.isNaN(dateTime)) {
        // Constructed datetime from a timestamp is always UTC.
        dateObject = new Date(dateTime)
        isGivenUTC = true
        //console.log('parseDateTime::2-3:', dateTime, isGivenUTC, dateObject.toISOString(), dateObject.getTime())
    } else if (dateTime instanceof Date) {
        // Treated as a datetime in local timezone, then convert to UTC.
        _localDate = dateTime
        dateObject = new Date(Date.UTC(_localDate.getUTCFullYear(), _localDate.getUTCMonth(), _localDate.getUTCDate(), _localDate.getUTCHours(), _localDate.getUTCMinutes(), _localDate.getUTCSeconds(), _localDate.getUTCMilliseconds()))
        isGivenUTC = true
    } else {
        return null
    }

    if (Number.isNaN(dateObject!.getTime())) {
        // When cannot parse given date strings, or other exception case.
        return null
    }

    // Set default values
    if (!timeZone || timeZone === '') {
        timeZone = 'UTC'
    }
    if (!monthNames || !Array.isArray(monthNames) || monthNames.length == 0) {
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
    if (!dayNames || !Array.isArray(dayNames) || dayNames.length == 0) {
        dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    const timeZoneOffset = getTimeZoneOffset(dateObject!, timeZone)
    const offsetHours = Math.floor(timeZoneOffset / (60 * 60 * 1000))
    const offsetMinutes = Math.floor((timeZoneOffset - (offsetHours * 60 * 60 * 1000)) / (60 * 1000))
    const localDate = new Date(dateObject!.getTime() + (isGivenUTC ? timeZoneOffset : 0))
    //console.log('parseDateTime::3:', dateObject!, timeZone, timeZoneOffset, offsetHours, offsetMinutes, localDate)

    const options: Intl.DateTimeFormatOptions = getIntlDateTimeFormatOptions(timeZone)
    const formatter = new Intl.DateTimeFormat(locale, options)
    const dateString = formatter.format(dateObject!) // depended given timeZone
    //console.log('parseDateTime::4:', dateObject!, timeZone, dateString)

    const [date, time] = dateString.split(' ')
    const [year, month, day] = date.split('/')
    const [hours, minutes, seconds] = time.split(':')
    const fixedHours = parseInt(hours, 10) - (isGivenUTC ? 0 : offsetHours)
    const fixedMinutes = parseInt(minutes, 10) - (isGivenUTC ? 0 : offsetMinutes)
    const monthname = monthNames[Number(month) - 1]
    const weeks = getWeekNumber(dateObject!, timeZone)
    const weekday = timeZone === 'UTC' ? dayNames[dateObject!.getUTCDay()] : dayNames[dateObject!.getDay()]
    const milliseconds = timeZone === 'UTC' ? dateObject!.getUTCMilliseconds() : dateObject!.getMilliseconds()
    let ISOFormatString = dateObject!.toISOString()
    let unixTimeStamp = Math.floor(dateObject!.getTime() / 1000)
    if (timeZone !== 'UTC') {
        const tzOffsetString = `${(offsetHours < 0 ? '-' : '+')}${String(Math.abs(offsetHours)).padStart(2, '0')}:${String(Math.abs(offsetMinutes)).padStart(2, '0')}`
        ISOFormatString = localDate.toISOString().replace('Z', tzOffsetString)
        //console.log('parseDateTime::3:', timeZone, ISOFormatString, dateString, localDate.toISOString(), tzOffsetString)
        unixTimeStamp = Math.floor(new Date(ISOFormatString).getTime() / 1000)
    }
    /*
    const unixEpochDate = timeZone === 'UTC'
        ? new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)))
        : new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds))
    const unixTimeStamp = Math.floor(unixEpochDate.getTime() / 1000)
    */
    //const unixTimeStamp = timeZone === 'UTC' ? Math.floor(dateObject!.getTime() / 1000) : Math.floor(localDate.getTime() / 1000)
    const ceEpochTime = unixTimeStamp + 62135596800// unit sec.
    //console.log(unixTimeStamp, ceEpochTime)

    return {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        monthName: monthname,
        day: parseInt(day, 10),
        weekday: weekday,
        weeks: weeks,
        hours: fixedHours,
        minutes: fixedMinutes,
        seconds: parseInt(seconds, 10),
        milliseconds: milliseconds,
        //ISO: unixEpochDate.toISOString(),// always UTC datetime
        ISO: ISOFormatString,
        ts: unixTimeStamp,
        cept: ceEpochTime,
        y: (digit: number = 4) => String(parseInt(year, 10)).padStart(digit, '0'),
        m: (digit: number = 2) => String(parseInt(month, 10)).padStart(digit, '0'),
        mn:(digit: number = 0, addPeriod: boolean = false) => { return (digit == 0
            ? monthname : monthname.substring(0, digit) + (addPeriod && digit < monthname.length ? '.' : ''))},
        d: (digit: number = 2) => String(parseInt(day, 10)).padStart(digit, '0'),
        w: (digit: number = 2) => String(weeks).padStart(digit, '0'),
        wd:(digit: number = 0, addPeriod: boolean = false) => { return (digit == 0
            ? weekday : weekday.substring(0, digit) + (addPeriod && digit < weekday.length ? '.' : ''))},
        h: (digit: number = 2) => String(fixedHours).padStart(digit, '0'),
        mi:(digit: number = 2) => String(fixedMinutes).padStart(digit, '0'),
        s: (digit: number = 2) => String(parseInt(seconds, 10)).padStart(digit, '0'),
        ms:(digit: number = 3) => String(milliseconds).padStart(digit, '0'),
    }
}

/**
 * Determines whether the specified date format string matches the current date.
 * 
 * @param {string} dateString 
 * @param {RegExp | null} patternRegExp c.f. "/(?<year>\d+)[-\/](?<month>\d+)[-\/](?<day>\d+)(.*)$/g", "/(?<month>\d+)月(?<day>\d+)日/g"
 * @param {boolean} asUTC   whether handle given date string as UTC datetime; default to true
 * @returns {boolean}
 */
export const isCurrentDate = (dateString: string, patternRegExp: RegExp | null = null, asUTC: boolean = true): boolean => {
    const currentDate = new Date()
    const currentDateValue = asUTC ? currentDate.valueOf() : currentDate.setHours(0, 0, 0, 0)
    let year: number | string = 0, month: number | string = 0, day: number | string = 0
    
    try {
        if (!patternRegExp) {
            const dateObject = new Date(dateString)
            if (isNaN(dateObject.getTime())) {
                throw new Error('Invalid date')
            }
            year = dateObject.getFullYear()
            month = dateObject.getMonth() + 1
            day = dateObject.getDate()
        } else {
            const flags = patternRegExp.flags || ''
            const globalPatternRegExp = new RegExp(patternRegExp.source, flags.includes('g') ? flags : flags + 'g')
            const matches = Array.from(dateString.matchAll(globalPatternRegExp))
            if (!matches || !matches[0].groups) {
                throw new Error('Pattern unmatched')
            }
            ({ year, month, day } = matches[0].groups)
            year = year ? parseInt(year, 10) : (asUTC ? currentDate.getUTCFullYear() : currentDate.getFullYear())
            month = parseInt(month, 10)
            day = parseInt(day, 10)
        }

        //console.log(dateString, patternRegExp, year, month, day)
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Invalid date components')
        }

        const targetDate = new Date(year, month - 1, day)
        const targetDateValue = asUTC ? Date.UTC(year, month - 1, day) : targetDate.setHours(0, 0, 0, 0)
        
        //console.log(targetDate, targetDateValue, currentDateValue === targetDateValue)
        return currentDateValue === targetDateValue
    } catch (error: unknown) {
        console.error('Failed to parse date in isCurrentDate():', error instanceof Error ? error.message : error)
        return false
    }
}

/**
 * Obtain time zone offset using Intl.DateTimeFormat API.
 * 
 * @param {Date} date - 
 * @param {string} timeZone - 
 * @returns {number}
 */
export const getTimeZoneOffset = (date: Date, timeZone: string): number => {
    const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' } as const
    const formatter = new Intl.DateTimeFormat([], options)
    const parts = formatter.formatToParts(date)
  
    const yearPart = parts.find(part => part.type === 'year')
    const monthPart = parts.find(part => part.type === 'month')
    const dayPart = parts.find(part => part.type === 'day')
    const hourPart = parts.find(part => part.type === 'hour')
    const minutePart = parts.find(part => part.type === 'minute')
    const secondPart = parts.find(part => part.type === 'second')
  
    if (!yearPart || !monthPart || !dayPart || !hourPart || !minutePart || !secondPart) {
        throw new Error(`Invalid time zone specified: ${timeZone}`)
    }
  
    const localTimeString = `${yearPart.value}-${monthPart.value}-${dayPart.value}T${hourPart.value}:${minutePart.value}:${secondPart.value}`
    const utcTimeString = date.toISOString().substring(0, 19)
  
    const localTime = Date.parse(`${localTimeString}Z`)
    const utcTime = Date.parse(`${utcTimeString}Z`)
  
    return localTime - utcTime
}

type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

/**
 * Adds time in years, months, days, hours, minutes, seconds, and milliseconds.
 * 
 * @param {Date} date -  
 * @param {number} amount -  
 * @param {TimeUnit} unit - 
 * @returns {Date}
 */
export const addToDate = (date: Date, amount: number, unit: TimeUnit): Date => {
    const newDate = new Date(date)
    switch (unit) {
        case 'years':
            newDate.setUTCFullYear(newDate.getUTCFullYear() + amount)
            break
        case 'months':
            newDate.setUTCMonth(newDate.getUTCMonth() + amount)
            break
        case 'weeks':
            newDate.setUTCDate(newDate.getUTCDate() + amount * 7)
            break
        case 'days':
            newDate.setUTCDate(newDate.getUTCDate() + amount)
            break
        case 'hours':
            newDate.setUTCHours(newDate.getUTCHours() + amount)
            break
        case 'minutes':
            newDate.setUTCMinutes(newDate.getUTCMinutes() + amount)
            break
        case 'seconds':
            newDate.setUTCSeconds(newDate.getUTCSeconds() + amount)
            break
        case 'milliseconds':
            newDate.setUTCMilliseconds(newDate.getUTCMilliseconds() + amount)
            break
    }
    return newDate
}

/**
 * Treats the underlying timestamp as a UTC time and calculates the specified timezone offset.
 * Calculate the local time by applying the time zone offset and add the required amount.
 * It then converts back to UTC time and returns a timestamp.
 * 
 * @param {number} baseTimestamp -  
 * @param {number} amount - 
 * @param {TimeUnit | string} unit - 
 * @param {string} timeZone - 
 * @returns {number}
 */
export const addTime = (baseTimestamp: number, amount: number, unit: TimeUnit | string, timeZone: string = 'UTC'): number => {
  // Get the standard UTC time.
  const baseDate = new Date(baseTimestamp)

  // Calculate time zone offset.
  const timeZoneOffset = getTimeZoneOffset(baseDate, timeZone)

  // Local time with time zone offset applied.
  const localBaseDate = new Date(baseDate.getTime() - timeZoneOffset)

  // Add increase amount.
  const filteredUnit = (!/.+s$/.test(unit) ? unit + 's' : unit) as TimeUnit
  const updatedLocalDate = addToDate(localBaseDate, amount, filteredUnit)

  // Convert time zone offset back to UTC time.
  const updatedUtcDate = new Date(updatedLocalDate.getTime() + timeZoneOffset)

  //console.log('addTime:', baseTimestamp, amount, unit, timeZone, timeZoneOffset, updatedLocalDate, updatedUtcDate)

  // return timestamp.
  return updatedUtcDate.getTime()
}

/**
 * Converts an ambiguous scale string to a system-safe scale string.
 * @param {Scale | string} scale - Candidate strings representing scale.
 * @returns {string | boolean} - Invalid scale returns boolean false.
 */
export const toValidScale = (scale: Scale | string): string | boolean => {
    let scaleStr = String(scale).toLowerCase()
    scaleStr = /s$/i.test(scaleStr) ? scaleStr.slice(0, -1) : scaleStr
    if (scaleStr !== '' && /^(year|month|(week|)(day|)|hour|minute|(milli|)second)$/.test(scaleStr)) {
        return scaleStr
    } else {
        return false
    }
}

/**
 * Truncates the datetime below the specified scale of the target Date object.
 * @param {Date} datetime 
 * @param {string} timeZone 
 * @param {Scale} scale 
 * @returns {Date}
 */
export const truncateLowerScales = (datetime: Date, timeZone: string, scale: Scale): Date => {
    switch(scale) {
        case 'year':
            if (timeZone === 'UTC') {
                datetime.setUTCMonth(0, 1)
                datetime.setUTCHours(0, 0, 0, 0)
            } else {
                datetime.setMonth(0, 1)
                datetime.setHours(0, 0, 0, 0)
            }
            break
        case 'month':
            if (timeZone === 'UTC') {
                datetime.setUTCDate(1)
                datetime.setUTCHours(0, 0, 0, 0)
            } else {
                datetime.setDate(1)
                datetime.setHours(0, 0, 0, 0)
            }
            break
        case 'week':
        case 'weekday':
        case 'day':
            if (timeZone === 'UTC') {
                datetime.setUTCHours(0, 0, 0, 0)
            } else {
                datetime.setHours(0, 0, 0, 0)
            }
            break
        case 'hour':
            if (timeZone === 'UTC') {
                datetime.setUTCMinutes(0, 0, 0)
            } else {
                datetime.setMinutes(0, 0, 0)
            }
            break
        case 'minute':
            if (timeZone === 'UTC') {
                datetime.setUTCSeconds(0, 0)
            } else {
                datetime.setSeconds(0, 0)
            }
            break
        case 'second':
            if (timeZone === 'UTC') {
                datetime.setUTCMilliseconds(0)
            } else {
                datetime.setMilliseconds(0)
            }
            break
        case 'millisecond':
            break
    }
    return datetime
}

//export type SetStartDatatimeReturnType = ReturnType<typeof getStartDatetime>;

/**
 * Optimize the start datetime given for the Sunorhc.Timeline, then retrieve.
 * Generates Date object along the given timezone and scale if specified "currently".
 * 
 * @param {string | Date} startDate - String of "currently", Date object, or a datetime string that can be instantiated as a Date object.
 * @param {string} timeZone - String of timezone.
 * @param {Scale | string} scale - As the global scale of the timeline, and scales below this are initialized to the 0 position.
 * @returns {Date | Error}
 */
export const getStartDatetime = (startDate: string | Date, timeZone: string, scale: Scale | string): Date | Error => {
    const scaleStr: string | boolean = toValidScale(scale)
    if (!scaleStr) {
        return new Error(`An unsupported scale was specified: "${scale}"`)
    }
    let fixedStartDatetime: Date
    if (typeof startDate === 'string') {
        if (startDate.toLowerCase() === 'currently') {
            const currentDate = new Date()// Note: local timezone date
            let currentlyStartDate: Date
            if (timeZone === 'UTC') {
                currentlyStartDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()))
                //currentlyStartDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds()))
            } else {
                //currentlyStartDate = new Date(currentDate.getTime())
                currentlyStartDate = currentDate
            }
            const reverseOffset: { [key in Scale]: number; } = {
                year: 5,// An amount of years equal to half of decade.
                month: 6,// An amount of months equal to half year.
                week: 26,// An amount of weeks equal to about half max week numbers in a year.
                weekday: 15,// An amount of days equal to half of average days (30.4375) in a month.
                day: 15,// An amount of days equal to half of average days (30.4375) in a month.
                hour: 12,// An amount of hours equal to a half day with excluding daylight saving time etc.
                minute: 30,// An amount of minutes equal to half hour.
                second: 30,// An amount of seconds equal to half minute.
                millisecond: 500,// An amount of milliseconds equal to half of a second.
            }
            switch(scaleStr) {
                case 'year':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCFullYear(currentDate.getFullYear() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCFullYear()`.
                        : currentlyStartDate.setFullYear(currentDate.getFullYear() - reverseOffset[scaleStr])
                    break
                case 'month':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCMonth(currentDate.getMonth() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCMonth()`.
                        : currentlyStartDate.setMonth(currentDate.getMonth() - reverseOffset[scaleStr])
                    break
                case 'week':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCDate(currentDate.getDate() - (reverseOffset[scaleStr] * 7)) // Note: does not decrease from `getUTCDate()`.
                        : currentlyStartDate.setUTCDate(currentDate.getDate() - (reverseOffset[scaleStr] * 7))
                    break
                case 'weekday':
                case 'day':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCDate(currentDate.getDate() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCDate()`.
                        : currentlyStartDate.setDate(currentDate.getDate() - reverseOffset[scaleStr])
                    break
                case 'hour':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCHours(currentDate.getHours() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCHours()`.
                        : currentlyStartDate.setHours(currentDate.getHours() - reverseOffset[scaleStr])
                    break
                case 'minute':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCMinutes(currentDate.getMinutes() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCMinutes()`.
                        : currentlyStartDate.setMinutes(currentDate.getMinutes() - reverseOffset[scaleStr])
                    break
                case 'second':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCSeconds(currentDate.getSeconds() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCSeconds()`.
                        : currentlyStartDate.setUTCSeconds(currentDate.getSeconds() - reverseOffset[scaleStr])
                    break
                case 'millisecond':
                    timeZone === 'UTC' 
                        ? currentlyStartDate.setUTCMilliseconds(currentDate.getMilliseconds() - reverseOffset[scaleStr]) // Note: does not decrease from `getUTCMilliseconds()`.
                        : currentlyStartDate.setMilliseconds(currentDate.getMilliseconds() - reverseOffset[scaleStr])
                    break
                default:
                    return new Error(`An unsupported scale was specified: "${scale}"`)
            }
            //console.log('setStartDatetime:', optionStartDate, optionScale, currentlyStartDate)
            fixedStartDatetime = currentlyStartDate
        } else {
            // When the string is not "currently".
            let givenDatetime: Date
            let isUtcDate: boolean = false
            if (/Z|([+-]\d{2}:\d{2})$/.test(startDate)) {
                // Handle as UTC datetime
                givenDatetime = new Date(startDate)
                isUtcDate = true
            } else {
                // Handle as local timezone datetime
                givenDatetime = new Date(startDate)
                isUtcDate = false
            }
            if (isNaN(givenDatetime.getTime())) {
                return new Error(`Invalid date strings given: "${startDate}"`)
            }
            if (timeZone === 'UTC') {
                fixedStartDatetime = isUtcDate 
                    ? givenDatetime 
                    : new Date(Date.UTC(givenDatetime.getUTCFullYear(), givenDatetime.getUTCMonth(), givenDatetime.getUTCDate(), givenDatetime.getUTCHours(), givenDatetime.getUTCMinutes(), givenDatetime.getUTCSeconds(), givenDatetime.getUTCMilliseconds()))
            } else {
                fixedStartDatetime = !isUtcDate 
                    ? givenDatetime 
                    : new Date(Date.UTC(givenDatetime.getFullYear(), givenDatetime.getMonth(), givenDatetime.getDate(), givenDatetime.getHours(), givenDatetime.getMinutes(), givenDatetime.getSeconds(), givenDatetime.getMilliseconds()))
            }
        }
    } else {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            return new Error(`Invalid Date object given`)
        }
        fixedStartDatetime = startDate
    }
    // Truncate lower scales of start datetime depended on given global scale.
    return truncateLowerScales(fixedStartDatetime, timeZone, scaleStr as Scale)
}

//export type SetEndDatatimeReturnType = ReturnType<typeof getEndDatetime>;

/**
 * Optimizes the given end date and time for a timeline component.
 * Mainly generates end date and time objects "auto" along the specified scale.
 * 
 * @param {string | Date} endDate - String of "auto", Date object, or a datetime string that can be instantiated as a Date object.
 * @param {string} timeZone - String of timezone.
 * @param {string} scale - As the global scale of the timeline, and scales below this are initialized to the 0 position.
 * @param {Date | undefined} startDate - Required when optionScale is "auto".
 * @returns {Date | Error}
 */
export const getEndDatetime = (endDate: string | Date, timeZone: string, scale: string, startDate?: Date): Date | Error => {
    const scaleStr: string | boolean = toValidScale(scale)
    if (!scaleStr) {
        return new Error(`An unsupported scale was specified: "${scale}"`)
    }
    let fixedEndDatetime: Date
    if (typeof endDate === 'string') {
        if (endDate.toLowerCase() === 'auto') {
            if (!(startDate instanceof Date)) {
                return new Error('Invalid Date object given start date.')
            }
            const autoEndDate = new Date(startDate.getTime())// Note: UTC date
            const increaseOffset: { [key in Scale]: number; } = {
                year: 10,// Decade years from start year.
                month: 12,// An amount of months equal to a year.
                week: 52,// An amount of weeks equal to max week numbers in a year.
                weekday: 30,// An amount of days equal to average days (30.4375) in a month.
                day: 30,// An amount of days equal to average days (30.4375) in a month.
                hour: 24,// An amount of hours equal to a day with excluding daylight saving time etc.
                minute: 60,// An amount of minutes equal to a hour.
                second: 60,// An amount of seconds equal to a minute.
                millisecond: 1000,// An amount of milliseconds equal to a second.
            }
            switch(scaleStr) {
                case 'year':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCFullYear(startDate.getUTCFullYear() + increaseOffset[scaleStr])
                        : autoEndDate.setFullYear(startDate.getFullYear() + increaseOffset[scaleStr])
                    break
                case 'month':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCMonth(startDate.getUTCMonth() + increaseOffset[scaleStr])
                        : autoEndDate.setMonth(startDate.getMonth() + increaseOffset[scaleStr])
                    break
                case 'week':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCDate(startDate.getUTCDate() + (increaseOffset[scaleStr] * 7))
                        : autoEndDate.setDate(startDate.getDate() + (increaseOffset[scaleStr] * 7))
                    break
                case 'weekday':
                case 'day':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCDate(startDate.getUTCDate() + increaseOffset[scaleStr])
                        : autoEndDate.setDate(startDate.getDate() + increaseOffset[scaleStr])
                    break
                case 'hour':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCHours(startDate.getUTCHours() + increaseOffset[scaleStr])
                        : autoEndDate.setHours(startDate.getHours() + increaseOffset[scaleStr])
                    break
                case 'minute':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCMinutes(startDate.getUTCMinutes() + increaseOffset[scaleStr])
                        : autoEndDate.setMinutes(startDate.getMinutes() + increaseOffset[scaleStr])
                    break
                case 'second':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCSeconds(startDate.getUTCSeconds() + increaseOffset[scaleStr])
                        : autoEndDate.setSeconds(startDate.getSeconds() + increaseOffset[scaleStr])
                    break
                case 'millisecond':
                    timeZone === 'UTC' 
                        ? autoEndDate.setUTCMilliseconds(startDate.getUTCMilliseconds() + increaseOffset[scaleStr])
                        : autoEndDate.setMilliseconds(startDate.getMilliseconds() + increaseOffset[scaleStr])
                    break
            }
            //console.log('setEndDatetime:', optionEndDate, optionScale, autoEndDate)
            fixedEndDatetime = new Date(autoEndDate.getTime() - 1)
        } else {
            // When the string is not "auto".
            let givenDatetime: Date
            let isUtcDate: boolean = false
            if (/Z|([+-]\d{2}:\d{2})$/.test(endDate)) {
                // Handle as UTC datetime
                givenDatetime = new Date(endDate)
                isUtcDate = true
            } else {
                // Handle as local timezone datetime
                givenDatetime = new Date(endDate)
                isUtcDate = false
            }
            if (isNaN(givenDatetime.getTime())) {
                return new Error(`Invalid date strings given: "${endDate}"`)
            }
            if (timeZone === 'UTC') {
                fixedEndDatetime = isUtcDate 
                    ? givenDatetime 
                    : new Date(Date.UTC(givenDatetime.getUTCFullYear(), givenDatetime.getUTCMonth(), givenDatetime.getUTCDate(), givenDatetime.getUTCHours(), givenDatetime.getUTCMinutes(), givenDatetime.getUTCSeconds(), givenDatetime.getUTCMilliseconds()))
            } else {
                fixedEndDatetime = !isUtcDate 
                    ? givenDatetime 
                    : new Date(Date.UTC(givenDatetime.getFullYear(), givenDatetime.getMonth(), givenDatetime.getDate(), givenDatetime.getHours(), givenDatetime.getMinutes(), givenDatetime.getSeconds(), givenDatetime.getMilliseconds()))
            }
        }
    } else {
        if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
            return new Error(`Invalid Date object given`)
        }
        fixedEndDatetime = endDate
    }
    return fixedEndDatetime
    // Truncate lower scales of end datetime depended on given global scale.
    //return truncateLowerScales(fixedEndDatetime, timeZone, scaleStr as Scale)
}

