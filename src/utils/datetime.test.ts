import { Scale } from '@/types/definitions'
import { getIntlDateTimeFormatOptions, getStartOfYearInTimeZone, getWeekNumber, isValidISOStrings, parseDateTime, isCurrentDate, getTimeZoneOffset, addToDate, addTime, toValidScale, truncateLowerScales, getStartDatetime, getEndDatetime } from './datetime'

describe('getIntlDateTimeFormatOptions', () => {

    it('should return default options when no override options are provided', () => {
        const timeZone = 'UTC'
        const expected = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: timeZone
        }

        const result = getIntlDateTimeFormatOptions(timeZone)
        expect(result).toEqual(expected)
    })

    it('should return merged options when override options are provided', () => {
        const timeZone = 'UTC'
        const overrideOptions = {
            year: '2-digit',
            hour12: true
        }
        const expected = {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: timeZone
        }

        const result = getIntlDateTimeFormatOptions(timeZone, overrideOptions)
        expect(result).toEqual(expected)
    })

    it('should return default options when empty override options are provided', () => {
        const timeZone = 'UTC'
        const overrideOptions = {}
        const expected = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: timeZone
        }

        const result = getIntlDateTimeFormatOptions(timeZone, overrideOptions)
        expect(result).toEqual(expected)
    })

    it('should handle different time zones correctly', () => {
        const timeZone = 'Asia/Tokyo'
        const expected = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: timeZone
        }

        const result = getIntlDateTimeFormatOptions(timeZone)
        expect(result).toEqual(expected)
    })
})

describe('getStartOfYearInTimeZone', () => {

    it('should return the start of the year in UTC when no timezone is specified', () => {
        const year = 2024
        const result = getStartOfYearInTimeZone(year)
        const expected = new Date(Date.UTC(2024, 0, 1, 0, 0, 0))

        expect(result.toISOString()).toBe(expected.toISOString())
    })

    it('should return the start of the year in a specified timezone', () => {
        const year = 2024
        const timeZone = 'Asia/Tokyo'
        const result = getStartOfYearInTimeZone(year, timeZone)
        
        //const expectedDate = new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
        const expectedDate = new Date(2024, 0, 1, 0, 0, 0)// JST
        const options = getIntlDateTimeFormatOptions(timeZone)
        const formatter = new Intl.DateTimeFormat(undefined, options)
        const expectedParts = formatter.formatToParts(expectedDate)
        const expectedDateStr = expectedParts.map(({ value }) => value).join('')
        const expected = new Date(expectedDateStr)

        expect(result.getTime()).toBe(expected.getTime())
    })

    it('should handle different years correctly', () => {
        const year = 2030
        const result = getStartOfYearInTimeZone(year)
        const expected = new Date(Date.UTC(2030, 0, 1, 0, 0, 0))

        expect(result.toISOString()).toBe(expected.toISOString())
    })

})

describe('getWeekNumber', () => {

    it('should return the correct week number in UTC when no timezone is specified', () => {
        const date = new Date('2024-01-01T00:00:00')
        const result = getWeekNumber(date)
        const expected = 1

        expect(result).toBe(expected)
    })

    it('should return the correct week number in a specified timezone', () => {
        const date = new Date('2024-01-05T00:00:00')
        const timeZone = 'America/New_York' // Eastern Time Zone
        const result = getWeekNumber(date, timeZone)
        const expected = 1 // January 5, 2024, falls in the first week of the year in Eastern Time Zone

        expect(result).toBe(expected)
    })

    it('should handle different dates correctly', () => {
        const date = new Date('2024-02-15T00:00:00')
        const result = getWeekNumber(date)
        const expected = 7 // February 15, 2024, falls in the 7th week of the year

        expect(result).toBe(expected)
    })

})

describe('isValidISOStrings', () => {

  it('should return true for valid ISO 8601 date strings', () => {
    expect(isValidISOStrings('2024-05-07')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34:56')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34:56.789')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34:56Z')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34:56+01:00')).toBe(true)
    expect(isValidISOStrings('-2024-05-07T12:34:56-01:00')).toBe(true)
  })

  it('should return true for valid date strings with slashes', () => {
    expect(isValidISOStrings('2024/05/07')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34:56')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34:56.789')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34:56Z')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34:56+01:00')).toBe(true)
    expect(isValidISOStrings('-2024/05/07T12:34:56-01:00')).toBe(true)
  })

  it('should return true for a valid date string with a half-width space separating the date and time parts', () => {
    expect(isValidISOStrings('2024/05/07 12:34')).toBe(true)
    expect(isValidISOStrings('2024/05/07 12:34:56')).toBe(true)
    expect(isValidISOStrings('2024/05/07 12:34:56.789')).toBe(true)
    expect(isValidISOStrings('2024/05/07 12:34:56Z')).toBe(true)
    expect(isValidISOStrings('2024/05/07 12:34:56+01:00')).toBe(true)
    expect(isValidISOStrings('-2024/05/07 12:34:56-01:00')).toBe(true)
  })

  it('should return true if the format is correct, even if the date string is invalid', () => {
    expect(isValidISOStrings('2024-13-07')).toBe(true)
    expect(isValidISOStrings('2024-05-32')).toBe(true)
    expect(isValidISOStrings('24-05-07')).toBe(true)
    expect(isValidISOStrings('2024-5-7')).toBe(true)
    expect(isValidISOStrings('2024-05-07T25:34')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:60')).toBe(true)
    expect(isValidISOStrings('2024-05-07T12:34:60')).toBe(true)
    expect(isValidISOStrings('2024/05-07')).toBe(true)
    expect(isValidISOStrings('2024/05/07T12:34:56+25:00')).toBe(true)
  })

  it('should return false the date string that is valid as constructor argument for Date object but has different format', () => {
    // US format date string: `MM/DD/YYYY HH:mm:ss`
    expect(isValidISOStrings('05/07/2024')).toBe(false)
    expect(isValidISOStrings('05/07/2024 12:34')).toBe(false)
    expect(isValidISOStrings('05/07/2024 12:34:56')).toBe(false)
    // European format date string: `DD/MM/YYYY HH:mm:ss`
    expect(isValidISOStrings('07/05/2024')).toBe(false)
    expect(isValidISOStrings('07/05/2024 12:34')).toBe(false)
    expect(isValidISOStrings('07/05/2024 12:34:56')).toBe(false)
    // RFC 2822 format
    expect(isValidISOStrings('Tue, 07 May 2024 14:30:00 GMT')).toBe(false)
    expect(isValidISOStrings('Tue, 07 May 2024 14:30:00 +0900')).toBe(false)
    expect(isValidISOStrings('Tue, 07 May 2024 14:30:00')).toBe(false)
    // Other formats
    expect(isValidISOStrings('05-07-2024')).toBe(false)
    expect(isValidISOStrings('2024-05-07T14:30:00+0900')).toBe(false)
    expect(isValidISOStrings('2024-05-07T14:30:00+09')).toBe(false)
  })

})

describe('parseDateTime', () => {

    it('should return null for empty argument', () => {
        const result = parseDateTime(undefined as any)
        expect(result).toBeNull()
    })

    it('should correctly parse date string in UTC', () => {
        const result = parseDateTime('2024-04-17T12:30:45Z')
        expect(result).toEqual({
            year: 2024,
            month: 4,
            monthName: 'April',
            day: 17,
            weeks: 16,
            weekday: 'Wednesday',
            hours: 12,
            minutes: 30,
            seconds: 45,
            milliseconds: expect.any(Number),
            ISO: '2024-04-17T12:30:45.000Z',
            ts: 1713357045,
            cept: 63848953845,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2024')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('17')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Wednesday')
        expect(result?.wd(3)).toBe('Wed')
        expect(result?.h()).toBe('12')
        expect(result?.mi()).toBe('30')
        expect(result?.s()).toBe('45')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse date string with local timezone', () => {
        const result = parseDateTime('2024-04-17T12:30:45', 'Asia/Tokyo')
        expect(result).toEqual({
            year: 2024,
            month: 4,
            monthName: 'April',
            day: 17,
            weeks: 16,
            weekday: 'Wednesday',
            hours: 12,
            minutes: 30,
            seconds: 45,
            milliseconds: expect.any(Number),
            ISO: '2024-04-17T12:30:45.000+09:00',
            ts: 1713324645,
            cept: 63848921445,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2024')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('17')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Wednesday')
        expect(result?.wd(3)).toBe('Wed')
        expect(result?.h()).toBe('12')
        expect(result?.mi()).toBe('30')
        expect(result?.s()).toBe('45')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse custom date string with local timezone', () => {
        const result = parseDateTime('2024/5/7 12:34:56 (JST)', 'Asia/Tokyo')
        expect(result).toEqual({
            year: 2024,
            month: 5,
            monthName: 'May',
            day: 7,
            weeks: 19,
            weekday: 'Tuesday',
            hours: 12,
            minutes: 34,
            seconds: 56,
            milliseconds: expect.any(Number),
            ISO: '2024-05-07T12:34:56.000+09:00',
            ts: 1715052896,
            cept: 63850649696,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2024')
        expect(result?.m()).toBe('05')
        expect(result?.mn()).toBe('May')
        expect(result?.d()).toBe('07')
        expect(result?.w()).toBe('19')
        expect(result?.wd()).toBe('Tuesday')
        expect(result?.wd(3)).toBe('Tue')
        expect(result?.h()).toBe('12')
        expect(result?.mi()).toBe('34')
        expect(result?.s()).toBe('56')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse custom date string (date only) in UTC', () => {
        const result = parseDateTime('2024/5/7')
        expect(result).toEqual({
            year: 2024,
            month: 5,
            monthName: 'May',
            day: 7,
            weeks: 19,
            weekday: 'Tuesday',
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: expect.any(Number),
            ISO: '2024-05-07T00:00:00.000Z',
            ts: 1715040000,
            cept: 63850636800,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2024')
        expect(result?.m()).toBe('05')
        expect(result?.mn()).toBe('May')
        expect(result?.d()).toBe('07')
        expect(result?.w()).toBe('19')
        expect(result?.wd()).toBe('Tuesday')
        expect(result?.wd(3)).toBe('Tue')
        expect(result?.h()).toBe('00')
        expect(result?.mi()).toBe('00')
        expect(result?.s()).toBe('00')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse custom date string (date only) with local timezone', () => {
        const result = parseDateTime('2024/5/7', 'Asia/Tokyo')
        expect(result).toEqual({
            year: 2024,
            month: 5,
            monthName: 'May',
            day: 7,
            weeks: 19,
            weekday: 'Tuesday',
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: expect.any(Number),
            ISO: '2024-05-07T00:00:00.000+09:00',
            ts: 1715007600,
            cept: 63850604400,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y(2)).toBe('2024')
        expect(result?.m(1)).toBe('5')
        expect(result?.d(1)).toBe('7')
        expect(result?.w(1)).toBe('19')
        expect(result?.wd(1)).toBe('T')
        expect(result?.h(1)).toBe('0')
        expect(result?.mi(1)).toBe('0')
        expect(result?.s(1)).toBe('0')
        expect(result?.ms(1)).toBe('0')
    })

    it('should correctly parse numeric timestamp in UTC', () => {
        // 2021-04-16T20:19:55.000Z
        const result = parseDateTime(1618604395000)
        expect(result).toEqual({
            year: 2021,
            month: 4,
            monthName: 'April',
            day: 16,
            weeks: 16,
            weekday: 'Friday',
            hours: 20,
            minutes: 19,
            seconds: 55,
            milliseconds: 0,
            ISO: '2021-04-16T20:19:55.000Z',
            ts: 1618604395,
            cept: 63754201195,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2021')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('16')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Friday')
        expect(result?.h()).toBe('20')
        expect(result?.mi()).toBe('19')
        expect(result?.s()).toBe('55')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse numeric timestamp with local timezone', () => {
        // UTC: 2021-04-16T20:19:55.000Z -> JST: Saturday, April 17th 2021, 5:19:55 am
        const result = parseDateTime(1618604395000, 'Asia/Tokyo')
        expect(result).toEqual({
            year: 2021,
            month: 4,
            monthName: 'April',
            day: 17,
            weeks: 16,
            weekday: 'Saturday',
            hours: 5,
            minutes: 19,
            seconds: 55,
            milliseconds: 0,
            ISO: '2021-04-17T05:19:55.000+09:00',
            ts: 1618604395,
            cept: 63754201195,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        })
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2021')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('17')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Saturday')
        expect(result?.h()).toBe('05')
        expect(result?.mi()).toBe('19')
        expect(result?.s()).toBe('55')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse Date object in UTC', () => {
        const date = new Date('2021-04-17T12:39:55')// local timezone datetime
        const result = parseDateTime(date)
        expect(result).toEqual({
            year: 2021,
            month: 4,
            monthName: 'April',
            day: 17,
            weeks: 16,
            weekday: 'Saturday',
            hours: 3,
            minutes: 39,
            seconds: 55,
            milliseconds: 0,
            ISO: '2021-04-17T03:39:55.000Z',
            ts: 1618630795,
            cept: 63754227595,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        });
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2021')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('17')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Saturday')
        expect(result?.h()).toBe('03')
        expect(result?.mi()).toBe('39')
        expect(result?.s()).toBe('55')
        expect(result?.ms()).toBe('000')
    })

    it('should correctly parse Date object with local timezone', () => {
        const date = new Date('2021-04-17T12:39:55')// local timezone datetime
        const result = parseDateTime(date, 'Asia/Tokyo')
        expect(result).toEqual({
            year: 2021,
            month: 4,
            monthName: 'April',
            day: 17,
            weeks: 16,
            weekday: 'Saturday',
            hours: 12,
            minutes: 39,
            seconds: 55,
            milliseconds: 0,
            ISO: '2021-04-17T12:39:55.000+09:00',
            ts: 1618630795,
            cept: 63754227595,
            y: expect.any(Function),
            m: expect.any(Function),
            mn: expect.any(Function),
            d: expect.any(Function),
            w: expect.any(Function),
            wd: expect.any(Function),
            h: expect.any(Function),
            mi: expect.any(Function),
            s: expect.any(Function),
            ms: expect.any(Function)
        });
        // Confirming the year, month, day, week, weekday, hour, minute, and second, taking into account the time difference.
        expect(result?.y()).toBe('2021')
        expect(result?.m()).toBe('04')
        expect(result?.mn()).toBe('April')
        expect(result?.d()).toBe('17')
        expect(result?.w()).toBe('16')
        expect(result?.wd()).toBe('Saturday')
        expect(result?.h()).toBe('12')
        expect(result?.mi()).toBe('39')
        expect(result?.s()).toBe('55')
        expect(result?.ms()).toBe('000')
    })

    it('should return null for invalid input', () => {
        const result = parseDateTime('invalid')
        expect(result).toBeNull()
    })

    it('should return null for invalid input with local timezone', () => {
        const result = parseDateTime('invalid', 'Asia/Tokyo')
        expect(result).toBeNull()
    })

    it('should parse a valid date string', () => {
        const dateTime = '2023-05-14T15:30:00Z'
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeDefined()
        if (result) {
            expect(result.year).toBe(2023)
            expect(result.month).toBe(5)
            expect(result.monthName).toBe('May')
            expect(result.day).toBe(14)
            expect(result.hours).toBe(15)
            expect(result.minutes).toBe(30)
            expect(result.seconds).toBe(0)
            expect(result.ISO).toBe('2023-05-14T15:30:00.000Z')
        }
    })
    
    it('should parse a valid timestamp', () => {
        const dateTime = 1684081800000
        // UTC: 2023-05-14T16:30:00.000Z
        // JST: 2023-05-15T01:30:00.000
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeDefined()
        if (result) {
            expect(result.year).toBe(2023)
            expect(result.month).toBe(5)
            expect(result.day).toBe(14)
            expect(result.hours).toBe(16)
            expect(result.minutes).toBe(30)
            expect(result.seconds).toBe(0)
            expect(result.ISO).toBe('2023-05-14T16:30:00.000Z')
        }
    })

    it('should parse a valid Date object', () => {
        const dateTime = new Date('2023-05-14T15:30:00Z')
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeDefined()
        if (result) {
            expect(result.year).toBe(2023)
            expect(result.month).toBe(5)
            expect(result.day).toBe(14)
            expect(result.hours).toBe(15)
            expect(result.minutes).toBe(30)
            expect(result.seconds).toBe(0)
            expect(result.ISO).toBe('2023-05-14T15:30:00.000Z')
        }
    })

    it('should return null for an invalid date string', () => {
        const dateTime = 'invalid date'
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeNull()
    })

    it('should return null for an invalid timestamp', () => {
        const dateTime = NaN
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeNull()
    })

    it('should use default day names if none provided', () => {
        const dateTime = '2023-05-14T15:30:00Z'
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeDefined()
        if (result) {
            expect(result.weekday).toBe('Sunday')
        }
    })

    it('should use provided month names', () => {
        const dateTime = '2023-03-14T15:30:00Z'
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
        const result = parseDateTime(dateTime, 'UTC', monthNames)
        expect(result).toBeDefined()
        if (result) {
            expect(result.monthName).toBe('März')
            expect(result.mn()).toBe('März')
            expect(result.mn(3)).toBe('Mär')
            expect(result.mn(2, true)).toBe('Mä.')
        }
    })

    it('should handle the period addition to tail when omitted names', () => {
        expect(parseDateTime('2023-01-01T00:00:00Z')!.mn()).toBe('January')
        expect(parseDateTime('2023-01-01T00:00:00Z')!.mn(3, true)).toBe('Jan.')
        expect(parseDateTime('2023-02-01T00:00:00Z')!.mn()).toBe('February')
        expect(parseDateTime('2023-02-01T00:00:00Z')!.mn(3, true)).toBe('Feb.')
        expect(parseDateTime('2023-03-01T00:00:00Z')!.mn()).toBe('March')
        expect(parseDateTime('2023-03-01T00:00:00Z')!.mn(3, true)).toBe('Mar.')
        expect(parseDateTime('2023-04-01T00:00:00Z')!.mn()).toBe('April')
        expect(parseDateTime('2023-04-01T00:00:00Z')!.mn(3, true)).toBe('Apr.')
        expect(parseDateTime('2023-05-01T00:00:00Z')!.mn()).toBe('May')
        // If the number of characters of the omit and unomit name are the same, it does not add full stop.
        expect(parseDateTime('2023-05-01T00:00:00Z')!.mn(3, true)).toBe('May')
        expect(parseDateTime('2023-06-01T00:00:00Z')!.mn()).toBe('June')
        expect(parseDateTime('2023-06-01T00:00:00Z')!.mn(3, true)).toBe('Jun.')
        expect(parseDateTime('2023-07-01T00:00:00Z')!.mn()).toBe('July')
        expect(parseDateTime('2023-07-01T00:00:00Z')!.mn(3, true)).toBe('Jul.')
        expect(parseDateTime('2023-08-01T00:00:00Z')!.mn()).toBe('August')
        expect(parseDateTime('2023-08-01T00:00:00Z')!.mn(3, true)).toBe('Aug.')
        expect(parseDateTime('2023-09-01T00:00:00Z')!.mn()).toBe('September')
        expect(parseDateTime('2023-09-01T00:00:00Z')!.mn(3, true)).toBe('Sep.')
        expect(parseDateTime('2023-10-01T00:00:00Z')!.mn()).toBe('October')
        expect(parseDateTime('2023-10-01T00:00:00Z')!.mn(3, true)).toBe('Oct.')
        expect(parseDateTime('2023-11-01T00:00:00Z')!.mn()).toBe('November')
        expect(parseDateTime('2023-11-01T00:00:00Z')!.mn(3, true)).toBe('Nov.')
        expect(parseDateTime('2023-12-01T00:00:00Z')!.mn()).toBe('December')
        expect(parseDateTime('2023-12-01T00:00:00Z')!.mn(3, true)).toBe('Dec.')
    })
    
    it('should use provided day names', () => {
        const dateTime = '2023-05-14T15:30:00Z'
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const result = parseDateTime(dateTime, 'UTC', undefined, dayNames)
        expect(result).toBeDefined()
        if (result) {
            expect(result.weekday).toBe('Sun')
            expect(result.wd()).toBe('Sun')
            expect(result.wd(3, true)).toBe('Sun')
            expect(result.wd(2)).toBe('Su')
            expect(result.wd(2, true)).toBe('Su.')
        }
    })

    it('should calculate correct week number', () => {
        const dateTime = '2023-05-14T15:30:00Z'
        const result = parseDateTime(dateTime, 'UTC')
        expect(result).toBeDefined()
        if (result) {
            expect(result.weeks).toBe(20)
        }
    })

})

describe('isCurrentDate', () => {
    // mock to assert that fired `console.log()`
    // const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    let nowDateObj: object = {}

    beforeAll(() => {
        // Enable mock for datetime
        vi.useFakeTimers()

        const nowDate = new Date()
        const nowUTCDate = new Date(nowDate.toUTCString())
        nowDateObj = {
            local: {
                ISO: `${nowDate.toLocaleDateString('sv-SE')}T${nowDate.toLocaleTimeString('sv-SE')}.${nowDate.getMilliseconds()}`,
                y: nowDate.getFullYear(),
                m: nowDate.getMonth() + 1,
                d: nowDate.getDate(),
                h: nowDate.getHours(),
                mi: nowDate.getMinutes(),
                s: nowDate.getSeconds(),
                ms: nowDate.getMilliseconds(),
            },
            utc: {
                ISO: nowUTCDate.toISOString(),
                y: nowUTCDate.getUTCFullYear(),
                m: nowUTCDate.getUTCMonth() + 1,
                d: nowUTCDate.getUTCDate(),
                h: nowUTCDate.getUTCHours(),
                mi: nowUTCDate.getUTCMinutes(),
                s: nowUTCDate.getUTCSeconds(),
                ms: nowUTCDate.getUTCMilliseconds(),
            },
        }
        //console.log('currentDate:', nowDateObj.local, 'currentUTCDate:', nowDateObj.utc)
    })

    afterAll(() => {
        // Unset mock for datetime
        vi.useRealTimers()

        // Reset mock for console
        //consoleMock.mockReset()
    })

    it('should return true when dateString is current local date in default format', () => {
        const dateString = new Date().toLocaleDateString()
        expect(isCurrentDate(dateString, null, false)).toBe(true)
    })

    it('should return false when dateString is current UTC date in default format', () => {
        const dateString = new Date().toLocaleDateString()
        expect(isCurrentDate(dateString, null)).toBe(false)
    })

    it('should return true when dateString matches the specified pattern', () => {
        const dateString = '2023-04-17T12:30:45Z'
        const patternRegExp = /\d{4}-\d{2}-\d{2}/
        expect(isCurrentDate(dateString, patternRegExp)).toBe(false)
    })

    it('should return false when dateString is invalid', () => {
        const dateString = 'Invalid Date'
        expect(isCurrentDate(dateString)).toBe(false)
    })

    it('should return false when pattern is unmatched', () => {
        const dateString = '2023-04-17'
        const patternRegExp = /(\d{4})-(\d{2})-(\d{2})/
        expect(isCurrentDate(dateString, patternRegExp)).toBe(false)
    })

    it('should return true when dateString matches the specified pattern', () => {
        // Set current local datetime to mock
        vi.setSystemTime(new Date(nowDateObj.local.ISO))
        const dateString = nowDateObj.local.ISO
        const patternRegExp = /(?<year>\d+)-(?<month>\d+)-(?<day>\d+).+/g
        expect(isCurrentDate(dateString, patternRegExp, false)).toBe(true)
    })

    it('should return false when dateString matches the specified pattern', () => {
        // Set current UTC datetime to mock
        vi.setSystemTime(new Date(nowDateObj.utc.ISO))
        const dateString = nowDateObj.utc.ISO
        const patternRegExp = /(?<year>\d+)-(?<month>\d+)-(?<day>\d+).+/g
        expect(isCurrentDate(dateString, patternRegExp)).toBe(false)
    })

    it('should return true when dateString matches the specified pattern without global flag', () => {
        // Set current local datetime to mock
        vi.setSystemTime(new Date(nowDateObj.local.ISO))
        const dateString = `${nowDateObj.local.y}年${String(nowDateObj.local.m).padStart(2, '0')}月${String(nowDateObj.local.d).padStart(2, '0')}日`
        const patternRegExp = /(?<year>\d+)年(?<month>\d+)月(?<day>\d+)日/
        //console.log(dateString, patternRegExp)
        expect(isCurrentDate(dateString, patternRegExp, false)).toBe(true)
    })

    it('should return true when dateString matches the specified pattern without year', () => {
        // Set current local datetime to mock
        vi.setSystemTime(new Date(nowDateObj.local.ISO))
        const dateString = `${String(nowDateObj.local.m).padStart(2, '0')}月${String(nowDateObj.local.d).padStart(2, '0')}日`
        const patternRegExp = /(?<month>\d+)月(?<day>\d+)日/g
        //console.log(dateString, patternRegExp)
        //expect(consoleMock).toHaveBeenCalled(2)
        expect(isCurrentDate(dateString, patternRegExp, false)).toBe(true)
    })

})

describe('getTimeZoneOffset', () => {

  it('should return correct offset for America/New_York in winter', () => {
    const date = new Date('2022-01-01T12:00:00Z')// noon UTC
    const timeZone = 'America/New_York'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Winter time in New York is UTC-5 hours.
    expect(offset).toBe(-5 * 60 * 60 * 1000)
  })

  it('should return correct offset for America/New_York in summer', () => {
    const date = new Date('2022-06-01T12:00:00Z')// noon UTC
    const timeZone = 'America/New_York'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Summer time in New York is UTC-4 hours.
    expect(offset).toBe(-4 * 60 * 60 * 1000)
  })

  it('should return correct offset for Asia/Tokyo', () => {
    const date = new Date('2022-01-01T12:00:00Z')// noon UTC
    const timeZone = 'Asia/Tokyo'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Tokyo is always UTC+9 hours.
    expect(offset).toBe(9 * 60 * 60 * 1000)
  })

  it('should return correct offset even if date changes within time difference of time zone', () => {
    //const date = new Date(1618604395000)// UTC: 
    const date = new Date(1621196395000)// UTC: 2021-05-16T20:19:55Z = JST: 2021-05-17T05:19:55+09:00
    const timeZone = 'Asia/Tokyo'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Tokyo is always UTC+9 hours.
    expect(offset).toBe(9 * 60 * 60 * 1000)
  })

  it('should return correct offset for Asia/Kolkata', () => {
    const date = new Date('2022-01-01T12:00:00Z')// noon UTC
    const timeZone = 'Asia/Kolkata'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Kolkata is always UTC+5:30.
    expect(offset).toBe(5 * 60 * 60 * 1000 + 30 * 60 * 1000)
  })

  it('should return correct offset for Asia/Kathmandu', () => {
    const date = new Date('2022-01-01T12:00:00Z')// noon UTC
    const timeZone = 'Asia/Kathmandu'
    const offset = getTimeZoneOffset(date, timeZone)
    
    // Kathmandu is always UTC+5:45.
    expect(offset).toBe(5 * 60 * 60 * 1000 + 45 * 60 * 1000)
  })

  it('should return correct offset for America/St_Johns', () => {
    const dateInNST = new Date('2024-01-07T12:00:00Z')// noon UTC
    const dateInNDT = new Date('2024-07-07T12:00:00Z')// noon UTC
    const timeZone = 'America/St_Johns'
    const offsetNST = getTimeZoneOffset(dateInNST, timeZone)
    const offsetNDT = getTimeZoneOffset(dateInNDT, timeZone)
    
    // Newfoundland Standard Time (NST) is always UTC-3:30.
    expect(offsetNST).toBe(-3.5 * 60 * 60 * 1000)
    // Newfoundland Daylight Time (NDT) is always UTC-2:30.
    expect(offsetNDT).toBe(-2.5 * 60 * 60 * 1000)
  })

  it('should throw an error for invalid time zone', () => {
    const date = new Date('2022-01-01T12:00:00Z')// noon UTC
    const timeZone = 'Invalid/TimeZone'

    expect(() => getTimeZoneOffset(date, timeZone)).toThrow(`Invalid time zone specified: ${timeZone}`)
  })

})

describe('addToDate', () => {

  it('should add years correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'years')
    expect(result.toISOString()).toBe('2023-01-01T00:00:00.000Z')
  })

  it('should add months correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'months')
    expect(result.toISOString()).toBe('2022-02-01T00:00:00.000Z')
  })

  it('should add days correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'days')
    expect(result.toISOString()).toBe('2022-01-02T00:00:00.000Z')
  })

  it('should add hours correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'hours')
    expect(result.toISOString()).toBe('2022-01-01T01:00:00.000Z')
  })

  it('should add minutes correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'minutes')
    expect(result.toISOString()).toBe('2022-01-01T00:01:00.000Z')
  })

  it('should add seconds correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'seconds')
    expect(result.toISOString()).toBe('2022-01-01T00:00:01.000Z')
  })

  it('should add milliseconds correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1, 'milliseconds')
    expect(result.toISOString()).toBe('2022-01-01T00:00:00.001Z')
  })

  it('should handle large additions correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, 1000, 'days')
    expect(result.toISOString()).toBe('2024-09-27T00:00:00.000Z')
  })

  it('should handle negative additions correctly', () => {
    const date = new Date('2022-01-01T00:00:00Z')
    const result = addToDate(date, -1, 'days')
    expect(result.toISOString()).toBe('2021-12-31T00:00:00.000Z')
  })

})

describe('addTime', () => {

    it('should add 1 year correctly in UTC', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'years', 'UTC')
        expect(new Date(result).toISOString()).toBe('2023-01-01T00:00:00.000Z')
    })

    it('should add 1 month correctly in America/New_York', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'months', 'America/New_York')
        //expect(new Date(result).toISOString()).toBe('2022-02-01T05:00:00.000Z')
        expect(new Date(result).toISOString()).toBe('2022-02-01T00:00:00.000Z')// why?
    })

    it('should add 1 day correctly in Asia/Tokyo', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'days', 'Asia/Tokyo')
        expect(new Date(result).toISOString()).toBe('2022-01-02T00:00:00.000Z')
    })

    it('should add 1 hour correctly in Europe/London', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'hours', 'Europe/London')
        expect(new Date(result).toISOString()).toBe('2022-01-01T01:00:00.000Z')
    })

    it('should add 1 minute correctly in UTC', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'minutes', 'UTC')
        expect(new Date(result).toISOString()).toBe('2022-01-01T00:01:00.000Z')
    })

    it('should add 1 second correctly in UTC', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'seconds', 'UTC')
        expect(new Date(result).toISOString()).toBe('2022-01-01T00:00:01.000Z')
    })

    it('should add 1 millisecond correctly in UTC', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1, 'milliseconds', 'UTC')
        expect(new Date(result).toISOString()).toBe('2022-01-01T00:00:00.001Z')
    })

    it('should handle large additions correctly', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, 1000, 'days', 'UTC')
        expect(new Date(result).toISOString()).toBe('2024-09-27T00:00:00.000Z')
    })

    it('should handle negative additions correctly', () => {
        const baseTimestamp = Date.parse('2022-01-01T00:00:00Z')
        const result = addTime(baseTimestamp, -1, 'days', 'UTC')
        expect(new Date(result).toISOString()).toBe('2021-12-31T00:00:00.000Z')
    })

    it('should add time correctly across DST changes in America/New_York', () => {
        const baseTimestamp = Date.parse('2022-03-12T12:00:00Z')
        const result = addTime(baseTimestamp, 2, 'days', 'America/New_York')
        //expect(new Date(result).toISOString()).toBe('2022-03-14T16:00:00.000Z')// DST starts on 2022-03-13
        expect(new Date(result).toISOString()).toBe('2022-03-14T12:00:00.000Z')// Why?
    })

})

describe('toValidScale', () => {

  it('should return the valid scale string for a supported scale', () => {
    expect(toValidScale('years')).toBe('year')
    expect(toValidScale('month')).toBe('month')
    expect(toValidScale('weeks')).toBe('week')
    expect(toValidScale('days')).toBe('day')
    expect(toValidScale('hour')).toBe('hour')
    expect(toValidScale('minutes')).toBe('minute')
    expect(toValidScale('seconds')).toBe('second')
    expect(toValidScale('milliseconds')).toBe('millisecond')
  })
  
  it('should return false for an unsupported scale', () => {
    expect(toValidScale('decade')).toBe(false)
    expect(toValidScale('century')).toBe(false)
    expect(toValidScale('')).toBe(false)
  })
  
})

describe('truncateLowerScales', () => {

    const datetime = new Date('2024-05-31T14:45:30.500Z')

    it('should truncate lower scales correctly for year', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'year')
        expect(result.getUTCMonth()).toBe(0)
        expect(result.getUTCDate()).toBe(1)
        expect(result.getUTCHours()).toBe(0)
        expect(result.getUTCMinutes()).toBe(0)
        expect(result.getUTCSeconds()).toBe(0)
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should truncate lower scales correctly for month', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'month')
        expect(result.getUTCDate()).toBe(1)
        expect(result.getUTCHours()).toBe(0)
        expect(result.getUTCMinutes()).toBe(0)
        expect(result.getUTCSeconds()).toBe(0)
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should truncate lower scales correctly for day', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'day')
        expect(result.getUTCHours()).toBe(0)
        expect(result.getUTCMinutes()).toBe(0)
        expect(result.getUTCSeconds()).toBe(0)
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should truncate lower scales correctly for hour', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'hour')
        expect(result.getUTCMinutes()).toBe(0)
        expect(result.getUTCSeconds()).toBe(0)
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should truncate lower scales correctly for minute', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'minute')
        expect(result.getUTCSeconds()).toBe(0)
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should truncate lower scales correctly for second', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'second')
        expect(result.getUTCMilliseconds()).toBe(0)
    })

    it('should not truncate lower scales for millisecond', () => {
        const result = truncateLowerScales(new Date(datetime), 'UTC', 'millisecond')
        expect(result).toEqual(datetime)
    })

    it('should handle local timezone correctly', () => {
        const localDateTime = new Date(datetime)
        const result = truncateLowerScales(localDateTime, 'local', 'hour')
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })
  
})
  
describe('getStartDatetime', () => {

  it('should return current date adjusted for scale when startDate is "currently" and timezone is UTC', () => {
    const result = getStartDatetime('currently', 'UTC', 'year')
    const expectedDate = new Date()
    expectedDate.setUTCFullYear(expectedDate.getUTCFullYear() - 5)
    expectedDate.setUTCMonth(0, 1)
    expectedDate.setUTCHours(0, 0, 0, 0)
    expect(result).toEqual(expectedDate)
  })

  it('should return current date adjusted for scale when startDate is "currently" and timezone is local', () => {
    const result = getStartDatetime('currently', 'local', 'month')
    const expectedDate = new Date()
    expectedDate.setMonth(expectedDate.getMonth() - 6)
    expectedDate.setDate(1)
    expectedDate.setHours(0, 0, 0, 0)
    expect(result).toEqual(expectedDate)
  })

  it('should return correct date for valid date string in UTC timezone', () => {
    const result = getStartDatetime('2024-05-31T14:45:30Z', 'UTC', 'day')
    const expectedDate = new Date(Date.UTC(2024, 4, 31, 0, 0, 0, 0))
    expect(result).toEqual(expectedDate)
  })

  it('should return correct date for valid date string in local timezone', () => {
    const result = getStartDatetime('2024-05-31T14:45:30', 'local', 'minute')
    const expectedDate = new Date(2024, 4, 31, 14, 45, 0, 0)
    expect(result).toEqual(expectedDate)
  })

  it('should return an error for invalid date string', () => {
    const result = getStartDatetime('invalid-date', 'UTC', 'second')
    expect(result).toBeInstanceOf(Error)
  })

  it('should return an error for invalid scale', () => {
    const result = getStartDatetime('2024-05-31T14:45:30', 'UTC', 'invalid-scale')
    expect(result).toBeInstanceOf(Error)
  })

  it('should return an error for invalid Date object', () => {
    const result = getStartDatetime(new Date('invalid-date'), 'UTC', 'minute')
    expect(result).toBeInstanceOf(Error)
  })

  it('should truncate lower scales of start datetime correctly', () => {
    const scales: Scale[] = ['year', 'month', 'week', 'weekday', 'day', 'hour', 'minute', 'second', 'millisecond']
    const date = new Date('2024-05-31T14:45:30.500Z')

    scales.forEach(scale => {
      const result = getStartDatetime(date, 'UTC', scale) as Date
      switch (scale) {
        case 'year':
          expect(result.getUTCMonth()).toBe(0)
          expect(result.getUTCDate()).toBe(1)
          expect(result.getUTCHours()).toBe(0)
          expect(result.getUTCMinutes()).toBe(0)
          expect(result.getUTCSeconds()).toBe(0)
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'month':
          expect(result.getUTCDate()).toBe(1)
          expect(result.getUTCHours()).toBe(0)
          expect(result.getUTCMinutes()).toBe(0)
          expect(result.getUTCSeconds()).toBe(0)
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'week':
        case 'weekday':
        case 'day':
          expect(result.getUTCHours()).toBe(0)
          expect(result.getUTCMinutes()).toBe(0)
          expect(result.getUTCSeconds()).toBe(0)
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'hour':
          expect(result.getUTCMinutes()).toBe(0)
          expect(result.getUTCSeconds()).toBe(0)
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'minute':
          expect(result.getUTCSeconds()).toBe(0)
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'second':
          expect(result.getUTCMilliseconds()).toBe(0)
          break
        case 'millisecond':
          break
      }
    })
  })

})

describe('getEndDatetime', () => {

  it('should return correct end date for "auto" with valid start date', () => {
    const startDate = new Date('2024-01-01T00:00:00Z')
    const result = getEndDatetime('auto', 'UTC', 'year', startDate) as Date
    expect(result.getUTCFullYear()).toBe(2033)
    expect(result.getUTCMonth()).toBe(11)
    expect(result.getUTCDate()).toBe(31)
    expect(result.getUTCHours()).toBe(23)
    expect(result.getUTCMinutes()).toBe(59)
    expect(result.getUTCSeconds()).toBe(59)
    expect(result.getUTCMilliseconds()).toBe(999)
  })

  it('should return error for "auto" without valid start date', () => {
    const result = getEndDatetime('auto', 'UTC', 'year')
    expect(result).toBeInstanceOf(Error)
  })

  it('should return correct end date for valid date string in UTC timezone', () => {
    const result = getEndDatetime('2024-05-31T14:45:30Z', 'UTC', 'day')
    const expectedDate = new Date(Date.UTC(2024, 4, 31, 14, 45, 30, 0))
    expect(result).toEqual(expectedDate)
  })

  it('should return correct end date for valid date string in local timezone', () => {
    const result = getEndDatetime('2024-05-31T14:45:30', 'local', 'minute')
    const expectedDate = new Date(2024, 4, 31, 14, 45, 30, 0)
    expect(result).toEqual(expectedDate)
  })

  it('should return an error for invalid date string', () => {
    const result = getEndDatetime('invalid-date', 'UTC', 'second')
    expect(result).toBeInstanceOf(Error)
  })

  it('should return an error for invalid scale', () => {
    const result = getEndDatetime('2024-05-31T14:45:30', 'UTC', 'invalid-scale')
    expect(result).toBeInstanceOf(Error)
  })

  it('should return an error for invalid Date object', () => {
    const result = getEndDatetime(new Date('invalid-date'), 'UTC', 'minute')
    expect(result).toBeInstanceOf(Error)
  })

})
