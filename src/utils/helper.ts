// Helper methods dedicated to Sunorhc.Timeline library.
// Methods:
// optimizeEventNode 

import LZString from 'lz-string'
import { Scale, PointerSize, StorageType, EventNode, TimelineOptions, Measures, StageRange, DateTimeObject } from '@/types/definitions'
import { isEmptyObject, inRange, hash, deepCloneObject } from './common'
import { getWeekNumber, parseDateTime } from './datetime'
//import { serialize, deserialize } from './serialization'

/**
 * Returns optimized value that calculating the vertical position of events.
 * 
 * @param {Partial<EventNode>} obj 
 * @param {StageRange} range 
 * @param {TimelineOptions} options 
 * @returns {number}
 */
export const getBaseRowCoordinate = (obj: Partial<EventNode>, range: StageRange, options: TimelineOptions): number => {
    // Calculating and optimizing the vertical position of events:
    // - row:   An index number of row (start from 1) in sidebar items. If row is 0, it will belong the first 
    //          item in the sidebar. If specified, the event can be forced to place to the row of the specified 
    //          index number.
    // - group: Sidebar group name to which the event belongs. If there is a group enabled on the sidebar side, 
    //          the event will be placed in that sidebar group's row and grouping will occur.
    let baseRowCoordinates: number = -1// base point coordinates of row
    if (obj.hasOwnProperty('row')) {
        // If row exists, this value takes precedence.
        if (typeof obj.row === 'number' && !Number.isNaN(obj.row)) {
            if (obj.row >= 0/* && obj.row <= range.maxRows*/) {
                baseRowCoordinates = range.rowHeight * (obj.row > 0 ? obj.row - 1 : obj.row)
            } else {
                // Event is out of sidebar range.
                baseRowCoordinates = range.rowHeight * -1
            }
        }
    }
    if (baseRowCoordinates === -1) {
        if (obj.hasOwnProperty('group')) {
            // When group only is set.
            const matchedGroupIndex = options.sidebar.items.findIndex((elm: any) => elm.hasOwnProperty('group') && elm.group === obj.group)
            if (matchedGroupIndex !== -1) {
                baseRowCoordinates = range.rowHeight * matchedGroupIndex
            }
        } else {
            // When row and group are not set.
            baseRowCoordinates = 0
        }
    }
    return baseRowCoordinates
}

/**
 * Calculate the relative position within the timestamp range of the start and end of the specified timestamp and 
 * return converted pixels value as based X coordinate.
 * 
 * @param {number} eventTimestamp - Timestamp value of the position you want to obtain (unit: seconds)
 * @param {number} startRangeTimestamp - Container range start timestamp value (unit: seconds)
 * @param {number} endRangeTimestamp - Container range end timestamp value (unit: seconds)
 * @param {number} rangeWidth - Width of container range (unit: pixels)
 * @returns {number} - Horizontal position of the specified timestamp in the container range (unit: pixels)
 */
export const getBaseX = (
    eventTimestamp: number,
    startRangeTimestamp: number,
    endRangeTimestamp: number,
    rangeWidth: number,
    minScaleWidth: number,
): number => {
    if (startRangeTimestamp === endRangeTimestamp) {
        throw new Error('start and end of range timestamp cannot be the same.')
    }

    let relativeX: number
    if (eventTimestamp < startRangeTimestamp) {
        // Event timestamp is before the start range
        relativeX = 0
    } else if (eventTimestamp > endRangeTimestamp) {
        // Event timestamp is after the end range
        relativeX = rangeWidth
    } else {
        // Event timestamp is within the range
        relativeX = (eventTimestamp - startRangeTimestamp) / (endRangeTimestamp - startRangeTimestamp) * rangeWidth
    }
    //console.log('getBX!!!', relativeX, relativeX / minScaleWidth, new Date(eventTimestamp * 1000).toISOString(), new Date(startRangeTimestamp * 1000).toISOString(), new Date(endRangeTimestamp * 1000).toISOString())
    return Math.floor(relativeX / minScaleWidth) * minScaleWidth
}

/**
 * Calculates the relative exact position of a datetime below a given scale, returning it as a number of pixels 
 * from a base X coordinate.
 * 
 * @param {DateTimeObject} dateObj 
 * @param {Scale} scale 
 * @param {StageRange} range
 * @returns {number}
 */
export const getPreciseX = (dateObj: DateTimeObject, scale: Scale, range: StageRange): number => {
    if (isEmptyObject(range) || range.width <= 0 || (range.hasOwnProperty('endDate') && range.startDate.ts === range.endDate.ts)) {
        throw new Error('Could not get the coordinate due to illegal range.')
    }
    const scaleWidth = range.minScaleWidth
    let relativeX: number = 0
    let lowerTimes: number
    let scalePerMilliseconds: number = 0
    let preciseX: number = -1

    if (dateObj.ts < range.startDate.ts) {
        // Event timestamp is before the start range timestamp.
        preciseX = 0
    } else if (dateObj.ts > range.endDate.ts) {
        // Event timestamp is after the end range timestamp.
        preciseX = range.width
    }

    switch(scale) {
        case 'year':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowYear = range.startDate[scale] + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(nowYear, 0, 1))
                if (dateObj.year === baseDate.getUTCFullYear()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, nowYear, baseX, baseDate.getUTCFullYear())
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                const startOfYear = new Date(Date.UTC(dateObj.year, 0, 1))
                const eventDate = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day))
                const diffInMilliseconds = eventDate.getTime() - startOfYear.getTime()
                const daysInYear = (new Date(Date.UTC(dateObj.year + 1, 0, 0)).getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000) + 1
                //console.log(`getPX!!!?::${dateObj.ISO}:`, startOfYear.toISOString(), diffInMilliseconds, daysInYear)
                lowerTimes = diffInMilliseconds + (dateObj.hours * 60 * 60 * 1000) + (dateObj.minutes * 60 * 1000) + (dateObj.seconds * 1000) + dateObj.milliseconds
                scalePerMilliseconds = daysInYear * 24 * 60 * 60 * 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'month':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowMonth = range.startDate[scale] + i - 1
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, nowMonth, 1))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, nowMonth, baseX, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                const daysInMonth = new Date(dateObj.year, dateObj.month, 0).getDate()
                const PixelPerDays = (dateObj.day - 1) / daysInMonth * scaleWidth // relative days as based X amount pixels
                // YYYY-01-01 -> 0 / 31 * 100 = 0; YYYY-01-31 -> 30 / 31 * 100 = 96.774
                lowerTimes = (dateObj.hours * 60 * 60 * 1000) + (dateObj.minutes * 60 * 1000) + (dateObj.seconds * 1000) + dateObj.milliseconds // relative time of milliseconds
                scalePerMilliseconds = lowerTimes / (daysInMonth * 24 * 60 * 60 * 1000)
                // 00:00:00.000 -> (0 + 0 + 0 + 0) / 31 * 86400000 = 0; 23:59:59.999 -> (82800000 + 3540000 + 59000 + 999 = 86399999) / (31 * 86400000 = 2678400000) = 0.032 
                preciseX = scalePerMilliseconds * scaleWidth + PixelPerDays + relativeX
                // YYYY-01-01T00:00:00.000 -> 0 * 100 + 0 = 0; YYYY-01-31T23:59:59.999 -> 0.032 * 100 + 96.774 = 99.999
                //console.log(`getPX!!!::${dateObj.ISO}:`, daysInMonth, dateObj.day, dateObj.day / daysInMonth, PixelPerDays, lowerTimes, scalePerMilliseconds, preciseX, relativeX)
            }
            break
        case 'week':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowDay = range.startDate.day + i * 7
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, nowDay))
                const nowWeekNumber = getWeekNumber(baseDate)
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && inRange(dateObj.weeks, nowWeekNumber - 1, nowWeekNumber + 1)) {
                    let startDayInWeek = baseDate.getUTCDate()
                    //console.log(`getPX!!!::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, startDayInWeek, nowDay, baseX, dateObj.day - startDayInWeek)
                    relativeX = baseX + ((dateObj.day - startDayInWeek) / 7 * scaleWidth)
                    break
                }
            }
            if (preciseX === -1) {
                lowerTimes = (dateObj.hours * 60 * 60 * 1000) + (dateObj.minutes * 60 * 1000) + (dateObj.seconds * 1000) + dateObj.milliseconds
                scalePerMilliseconds = 7 * 24 * 60 * 60 * 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'weekday':
        case 'day':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowDay = range.startDate.day + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, nowDay))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && dateObj.day === baseDate.getUTCDate()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, nowDay, baseX)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                lowerTimes = (dateObj.hours * 60 * 60 * 1000) + (dateObj.minutes * 60 * 1000) + (dateObj.seconds * 1000) + dateObj.milliseconds
                scalePerMilliseconds = 24 * 60 * 60 * 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'hour':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowHour = range.startDate.hours + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, range.startDate.day, nowHour))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && dateObj.day === baseDate.getUTCDate() && dateObj.hours === baseDate.getUTCHours()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, baseDate.getUTCDate(), baseDate.getUTCHours(), nowHour, baseX)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                lowerTimes = (dateObj.minutes * 60 * 1000) + (dateObj.seconds * 1000) + dateObj.milliseconds
                scalePerMilliseconds = 60 * 60 * 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'minute':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowMinute = range.startDate.minutes + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, range.startDate.day, range.startDate.hours, nowMinute))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && dateObj.day === baseDate.getUTCDate() && dateObj.hours === baseDate.getUTCHours() && dateObj.minutes === baseDate.getUTCMinutes()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, baseDate.getUTCDate(), baseDate.getUTCHours(), nowHour, baseX)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                lowerTimes = (dateObj.seconds * 1000) + dateObj.milliseconds
                scalePerMilliseconds = 60 * 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'second':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowSecond = range.startDate.seconds + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, range.startDate.day, range.startDate.hours, range.startDate.minutes, nowSecond))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && dateObj.day === baseDate.getUTCDate() && dateObj.hours === baseDate.getUTCHours() && dateObj.minutes === baseDate.getUTCMinutes() && dateObj.seconds === baseDate.getUTCSeconds()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, baseDate.getUTCDate(), baseDate.getUTCHours(), nowHour, baseX)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                lowerTimes = dateObj.milliseconds
                scalePerMilliseconds = 1000
                preciseX = lowerTimes / scalePerMilliseconds * scaleWidth + relativeX
            }
            break
        case 'millisecond':
            // Calculate the relative base position within a range based on a global scale.
            for (let i = 0; i < Math.ceil(range.width / scaleWidth); i++) {
                const nowMillisecond = range.startDate.milliseconds + i
                const baseX = scaleWidth * i
                const baseDate = new Date(Date.UTC(range.startDate.year, range.startDate.month - 1, range.startDate.day, range.startDate.hours, range.startDate.minutes, range.startDate.seconds, nowMillisecond))
                if (dateObj.year === baseDate.getUTCFullYear() && dateObj.month === baseDate.getUTCMonth() + 1 && dateObj.day === baseDate.getUTCDate() && dateObj.hours === baseDate.getUTCHours() && dateObj.minutes === baseDate.getUTCMinutes() && dateObj.seconds === baseDate.getUTCSeconds() && dateObj.milliseconds === baseDate.getUTCMilliseconds()) {
                    //console.log(`getPX!!!?::${dateObj.ISO}:`, baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, baseDate.getUTCDate(), baseDate.getUTCHours(), nowHour, baseX)
                    relativeX = baseX
                    break
                }
            }
            if (preciseX === -1) {
                preciseX = relativeX
            }
            break
    }
    return Math.round(preciseX * 1000) / 1000
}

/**
 * Calculates the optimal height of the event node according to the stage on which it is placed.
 * 
 * @param {PointerSize | undefined} size - Number of pixels or pointer size strings.
 * @param {StageRange} range - An object that has been defined the stage range sizes.
 * @returns {number} - Height of an event node (unit: pixels).
 */
export const getNodeHeight = (size: PointerSize | undefined = 'md', range: StageRange): number => {
    const minHeight = Math.min(range.minScaleWidth, range.rowHeight) / 10
    const sizeStr = String(size)
    const maxHeight = range.rowHeight - 2
    let nodeHeight: number

    switch (sizeStr.toLowerCase()) {
        case 'xs':
            nodeHeight = Math.max(16, Math.floor(minHeight * 2.667))
            break
        case 'sm':
            nodeHeight = Math.max(22, Math.floor(minHeight * 3.667))
            break
        case 'lg':
            nodeHeight = Math.max(48, Math.floor(range.rowHeight * 0.6))
            break
        case 'xl':
            nodeHeight = Math.min(72, Math.floor(range.rowHeight * 0.72), maxHeight)
            break
        default:
            if (/^\d+$/.test(sizeStr)) {
                nodeHeight = Math.min(parseInt(sizeStr, 10), maxHeight)
            } else {
                nodeHeight = Math.max(36, minHeight * 6)
            }
            break
    }
    return Math.round(nodeHeight * 1000) / 1000
}

/**
 * Optimize loaded event node data for rendering on the DOM.
 * 
 * @param {Partial<EventNode>} baseObj 
 * @param {TimelineOptions} options 
 * @param {Record<string, any>} measurements 
 * @returns {Partial<EventNode>}
 */
export const optimizeEventNode = (
    baseObj: Partial<EventNode>,
    options: TimelineOptions,
    measurements: Measures
): Partial<EventNode> => {
    const globalScale = options.scale as Scale
    const newObj = deepCloneObject(baseObj)! as Partial<EventNode>
    
    // uid: You cannot set externally for the system internal value.
    //      This value must be strictly unique in the entire event list.
    newObj.uid = hash(String(window.performance.now()))

    const range: StageRange = {
        width: measurements.rulerActualWidth,
        height: measurements.sidebarHeight,
        minScaleWidth: Math.floor(measurements.rulerActualWidth / measurements.rulerMaxCols),
        maxRows: measurements.sidebarItems,
        rowHeight: measurements.sidebarItemHeight,
        startDate: measurements.startDate,
        sts: measurements.startDate?.ts || 0,
        scept: measurements.startDate?.cept || 0,
        endDate: measurements.endDate,
        ets: measurements.endDate?.ts || 0,
        ecept: measurements.endDate?.cept || 0,
    }
    if (!newObj.hasOwnProperty('s') || typeof newObj.s !== 'object') {
        newObj.x = newObj.y = -1
        newObj.w = newObj.h = 0
        return newObj as Partial<EventNode>
    }

    const startBaseY = getBaseRowCoordinate(newObj, range, options)
    const startBaseX = getBaseX(newObj.s!.ts, range.sts!, range.ets!, range.width, range.minScaleWidth)

    //newObj.extends = {}
    //newObj.extends.startBaseX = startBaseX

    //newObj.x = startBaseX + getPreciseX(newObj.s!, globalScale, range/*.minScaleWidth*/)
    newObj.x = getPreciseX(newObj.s!, globalScale, range)
    //console.log(`startX::${newObj.eventId}:`, range.width, range.minScaleWidth, startBaseX, newObj.x)

    newObj.h = Math.floor((getNodeHeight(newObj.size || 'md', range)) * 1000) / 1000
    if (!newObj.hasOwnProperty('end')) {
        newObj.h = Math.floor(newObj.h / 2 * 1000) / 1000
    }
    newObj.y = Math.floor((startBaseY + Math.floor((range.rowHeight - newObj.h) / 2)) * 1000) / 1000

    if (newObj.hasOwnProperty('end')) {
        const parsedEndDate = parseDateTime(newObj.end!, options.timezone)
        if (!!parsedEndDate) {
            // The bar-typed event node with start and end datetime.
            newObj.e = parsedEndDate
            //const endBaseX = getBaseX(newObj.e!.ts, range.sts!, range.ets!, range.width, range.minScaleWidth)
            //newObj.extends.endBaseX = endBaseX
            //const endX = (endBaseX - newObj.x >= range.minScaleWidth ? endBaseX - range.minScaleWidth : endBaseX) + getPreciseX(newObj.e!, globalScale, range.minScaleWidth)
            const endX = getPreciseX(newObj.e!, globalScale, range/*.minScaleWidth*/)
            //console.log(`!!!::${newObj.eventId}:`, startBaseX, newObj.x, endX, 'width:', endX - newObj.x)
            if (newObj.e.ts > newObj.s.ts) {
                if (endX >= range.width) {
                    newObj.w = Math.round((range.width - newObj.x) * 1000) / 1000
                //} else if (endX > 0) {
                //    newObj.w = Math.round((startBaseX + endX - newObj.x) * 1000) / 1000
                } else {
                    //console.log(`endX::${newObj.eventId}:`, startBaseX, endBaseX, endX, newObj.x)
                    //newObj.w = Math.round((endBaseX + endX - newObj.x) * 1000) / 1000
                    newObj.w = Math.round((endX - newObj.x) * 1000) / 1000
                }
            }
            //console.log(`endX::${newObj.eventId}:`, startBaseX, '+', endX, '=', startBaseX + endX, endBaseX, endBaseX - startBaseX)
            /*
            if (endX > newObj.x) {
                //newObj.w = Math.round((endX > range.width ? range.width - newObj.x : endX - newObj.x) * 1000) / 1000
                newObj.w = Math.round((endX > range.width ? range.width - newObj.x : endX - newObj.x) * 1000) / 1000
            }*/
        } else {
            // Handle as same the pointer-typed event node positioning when invalid end datetime.
            newObj.w = newObj.h
            if (newObj.x < range.width - newObj.w / 2) {
                newObj.x = Math.round((newObj.x - (newObj.w / 2)) * 1000) / 1000
            }
        }
    } else {
        // The pointer-typed event node with start datetime only.
        newObj.w = newObj.h
        if (newObj.x < range.width - newObj.w / 2) {
            newObj.x = Math.round((newObj.x - (newObj.w / 2)) * 1000) / 1000
        }
    }

    //console.log(`optimizeEventNode::${newObj.eventId}:`, newObj, range, newObj.x, newObj.y, newObj.w, newObj.h)
    return newObj as Partial<EventNode>
}

/**
 * Save data to specified web storage.
 * 
 * @param {StorageType} storage - 'sessionStorage' or 'localStorage'
 * @param {string} key 
 * @param {any} data 
 * @param {boolean} hasExpiration - Whether the data to be stored has an expiration period; Default to false.
 */
export const saveToStorage = (storage: StorageType, key: string, data: any, hasExpiration: boolean = false): void => {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    } else if (typeof data !== 'string') {
        data = String(data)
    }
    const compressedString = LZString.compressToUTF16(data)
    const base64String = btoa(encodeURIComponent(compressedString));
    //console.log(base64String, base64String.length);
    (window[storage] as Storage).setItem(key, base64String)
    if (hasExpiration) {
        const expirationKey  = `${key}:expiration`
        const expirationData = JSON.stringify({ hash: hash(base64String), cached: new Date().getTime() });
        (window[storage] as Storage).setItem(expirationKey, expirationData)
    }
}

/**
 * Load data from specified web storage.
 * If the valid storage period expiredTime is specified, the expiration date of the saved data will be checked, 
 * the expired data will be discarded, and null will be returned.
 * 
 * @param {StorageType} storage - 'sessionStorage' or 'localStorage' 
 * @param {string} key 
 * @param {number} expiredTime - Time until expiration from stored (unit: milliseconds); Default to 0 is never expired.
 * @returns {any | null}
 */
export const loadFromStorage = (storage: StorageType, key: string, expiredTime: number = 0): any | null => {
    const rawData = (window[storage] as Storage).getItem(key)
    if (!rawData) {
        return null
    }
    if (expiredTime > 0) {
        // An expiration time is specified.
        const checkExpirationKey = `${key}:expiration`
        const rawExpirationData = (window[storage] as Storage).getItem(checkExpirationKey)
        if (rawExpirationData !== null) {
            const expirationData = JSON.parse(rawExpirationData)
            const nowTime = new Date().getTime()
            //console.log('getExpirationData:', expirationData, hash(rawData), nowTime, expirationData.cached + expiredTime >= nowTime, expirationData.hash !== hash(rawData))
            if (expirationData.cached + expiredTime < nowTime || expirationData.hash !== hash(rawData)) {
                // Abort cache data because expired or unmatched hash of cache.
                removeToStorage(storage, checkExpirationKey, key)
                return null
            }
        }
    }
    const compressedString = decodeURIComponent(atob(rawData))
    const decompressString = LZString.decompressFromUTF16(compressedString)
    if (!decompressString) {
        return null
    }
    try {
        return JSON.parse(decompressString)
    } catch (e) {
        return decompressString
    }
}

/**
 * Remove data from specified web storage. It can be multiple removing data at once too.
 * 
 * @param {StorageType} storage - 'sessionStorage' or 'localStorage'
 * @param {string[]} keys - You can specify multiple keys to delete data at once.
 */
export const removeToStorage = (storage: StorageType, ...keys: string[]): void => {
    keys.forEach((key: string) => {
        console.log('removeToStorage:', key, storage);
        (window[storage] as Storage).removeItem(key)
    })
}
