//import LZString from 'lz-string'
import * as Def from '@/types/definitions'
import { getBaseRowCoordinate, getBaseX, getPreciseX, getNodeHeight, optimizeEventNode, saveToStorage, loadFromStorage, removeToStorage } from './helper'

describe('getBaseRowCoordinate', () => {

    const stageRange: Def.StageRange = {
        width: 1000,
        height: 500,
        minScaleWidth: 100,
        maxRows: 10,
        rowHeight: 50,
        startDate: {},
        endDate: {}
    }

    const timelineOptions: Def.TimelineOptions = {
        start: '2022-01-01',
        end: '2022-12-31',
        timezone: 'UTC',
        scale: 'day',
        header: { display: false },
        footer: { display: false },
        sidebar: {
            placement: 'left',
            items: [
                { type: 'text', label: 'Item 1', group: 'group1' },
                { type: 'text', label: 'Item 2' },
                { type: 'text', label: 'Item 3', group: 'group2' }
            ]
        },
        ruler: {} as Def.RulerRole,
        events: 'Events',
        layout: {} as Def.Layouts,
        effects: {} as Def.Effects,
        theme: {},
        useStorage: 'sessionStorage',
        zoomable: true,
        debug: false
    }

    it('should return the correct coordinate when row is specified and greater than 0', () => {
        const obj = { row: 3 }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(100)
    })

    it('should return the correct coordinate when row is specified and equals 0', () => {
        const obj = { row: 0 }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(0)
    })

    it('should return the correct coordinate when row is specified and less than 0', () => {
        const obj = { row: -1 }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(-50)
    })

    it('should return the correct coordinate when row is specified and more than max rows', () => {
        const obj = { row: 4 }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(150)
    })

    it('should return the correct coordinate when group is specified and matches an item', () => {
        const obj = { group: 'group1' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(0)
    })

    it('should return the -1 as unmatched when group is specified and does not match any item', () => {
        const obj = { group: 'nonexistent' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(-1)
    })

    it('should return the correct coordinate when neither row nor group is specified', () => {
        const obj = {}
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(0)
    })

    it('should return the correct coordinate by using row takes precedence when both row and group is specified valid values', () => {
        const obj = { row: 2, group: 'group2' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(50)
    })

    it('should return the -1 as unmatched when both row and group is specified valid values', () => {
        const obj = { row: NaN, group: 'group3' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(-1)
    })

    it('should return the correct coordinate by using group when invalid row and valid group is specified', () => {
        const obj = { row: NaN, group: 'group2' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(100)
    })

    it('should return the correct coordinate by using row when valid row and invalid group is specified', () => {
        const obj = { row: 2, group: 'invalid-group' }
        const result = getBaseRowCoordinate(obj, stageRange, timelineOptions)
        expect(result).toBe(50)
    })

})

describe('getBaseX', () => {

    it('should throw an error if startRangeTimestamp and endRangeTimestamp are the same', () => {
        expect(() => getBaseX(1000, 1000, 1000, 100, 10)).toThrow('start and end of range timestamp cannot be the same')
    })

    it('should return 0 if eventTimestamp is before the start range', () => {
        const result = getBaseX(900, 1000, 2000, 100, 10)
        expect(result).toBe(0)
    })

    it('should return rangeWidth if eventTimestamp is after the end range', () => {
        const result = getBaseX(2100, 1000, 2000, 100, 10)
        expect(result).toBe(100)
    })

    it('should return correct X coordinate if eventTimestamp is within the range', () => {
        const checks = [
            { expect: [ 1500, 1000, 2000, 100, 10 ], result: 50 },
            { expect: [ 1250, 1000, 2000, 100, 10 ], result: 20 },
            { expect: [ 1750, 1000, 2000, 100, 10 ], result: 70 },
            { expect: [ 1716562800, 1715581952, 1718173952, 1860, 60 ], result: 660 },// 2024-05-25T00:00:00.000+09:00 in 2024-05-13T15:32:32.930+09:00 to 2024-06-12T15:32:32.930+09:00 as 1860px
            { expect: [ 63852159600, 63851178752, 63853770752, 1860, 60 ], result: 660 },// Same as above, however as the CE epoch value
            { expect: [ 63851760000, 63851202526, 63853794526, 1860, 60 ], result: 360 },// 2024-05-20T00:00:00.000Z in 2024-05-13T13:08:46.594Z to 2024-06-12T13:08:46.594Z as 1860px as the CEepoch value
            { expect: [ 63851760000, 63851155200, 63853747200, 1860, 60 ], result: 420 },// 2024-05-20T00:00:00.000Z in 2024-05-13T00:00:00.000Z to 2024-06-12T00:00:00.000Z as 1860px as the CEepoch value
        ]

        checks.forEach((item) => {
            const result = getBaseX(item.expect[0], item.expect[1], item.expect[2], item.expect[3], item.expect[4])
            expect(result).toBe(item.result)
        })
    })

    it('should handle edge cases where eventTimestamp is exactly the start or end of the range', () => {
        const resultStart = getBaseX(1000, 1000, 2000, 100, 10)
        expect(resultStart).toBe(0)

        const resultEnd = getBaseX(2000, 1000, 2000, 100, 10)
        expect(resultEnd).toBe(100)
    })

})

describe('getPreciseX', () => {

    it('should handle undefined', () => {
        expect(() => getPreciseX({} as Def.DateTimeObject, 'day' as Def.Scale, {} as Def.StageRange)).toThrowError('Could not get the coordinate due to illegal range.')
    })

})

describe('getNodeHeight', () => {

    const range: Def.StageRange = {
        width: 100,
        height: 100,
        minScaleWidth: 50,
        maxRows: 10,
        rowHeight: 50,
        startDate: {} as Def.DateTimeObject,
        endDate: {} as Def.DateTimeObject,
    }
    // minHeight = Math.min(50, 50) / 10 = 5
    // maxHeight = 50 - 2 = 48

    afterEach(() => {
        range.minScaleWidth = 50
        range.rowHeight = 50
    })

    it('should return correct height for size "xs"', () => {
        expect(getNodeHeight('xs', range)).toBe(16) // Math.max(16, Math.floor(5 * 2.667) = 13) = 16
        range.minScaleWidth = 100
        range.rowHeight = 100
        expect(getNodeHeight('xs', range)).toBe(26) // Math.max(16, Math.floor(10 * 2.667) = 26) = 26
    })

    it('should return correct height for size "sm"', () => {
        expect(getNodeHeight('sm', range)).toBe(22) // Math.max(22, Math.floor(5 * 3.667) = 18) = 22
        range.minScaleWidth = 80
        range.rowHeight = 80
        expect(getNodeHeight('sm', range)).toBe(29) // Math.max(22, Math.floor(8 * 3.667) = 29) = 29
    })

    it('should return correct height for size "md"', () => {
        expect(getNodeHeight('md', range)).toBe(36) // Math.max(36, Math.floor(5 * 6) = 30) = 36
        range.minScaleWidth = 80
        range.rowHeight = 100
        expect(getNodeHeight('md', range)).toBe(48) // Math.max(36, Math.floor(8 * 6) = 48) = 48
    })

    it('should return correct height for size "lg"', () => {
        expect(getNodeHeight('lg', range)).toBe(48) // Math.max(48, Math.floor(50 * 0.6) = 30) = 48
        range.minScaleWidth = 96
        range.rowHeight = 96
        expect(getNodeHeight('lg', range)).toBe(57) // Math.max(48, Math.floor(50 * 0.6) = 57) = 57
    })

    it('should return correct height for size "xl"', () => {
        expect(getNodeHeight('xl', range)).toBe(36) // Math.min(72, Math.floor(50 * 0.72) = 36, 48) = 36
        range.minScaleWidth = 120
        range.rowHeight = 120
        expect(getNodeHeight('xl', range)).toBe(72) // Math.min(72, Math.floor(120 * 0.72) = 86, 118) = 72
    })

    it('should return correct height for numeric size', () => {
        expect(getNodeHeight(0, range)).toBe(0)
        expect(getNodeHeight(1, range)).toBe(1)
        expect(getNodeHeight(40, range)).toBe(40)
        expect(getNodeHeight(50, range)).toBe(48) // maxHeight = 48
    })

    it('should return default height for negative numeric size', () => {
        expect(getNodeHeight(-1, range)).toBe(36) // Math.max(36, 50 / 10 * 6 = 30) = 36
        range.minScaleWidth = 100
        range.rowHeight = 100
        expect(getNodeHeight(-1, range)).toBe(60) // Math.max(36, 100 / 10 * 6 = 60) = 60
    })

    it('should return maxHeight if numeric size is greater than maxHeight', () => {
        expect(getNodeHeight(60, range)).toBe(48) // maxHeight = 48
        range.minScaleWidth = 60
        range.rowHeight = 80
        expect(getNodeHeight(60, range)).toBe(60)
        expect(getNodeHeight(80, range)).toBe(78) // maxHeight = 78
    })

    it('should return default height for invalid size', () => {
        expect(getNodeHeight('invalid' as any, range)).toBe(36) // Math.max(36, 50 / 10 * 6 = 30) = 36
        range.minScaleWidth = 100
        range.rowHeight = 100
        expect(getNodeHeight('invalid' as any, range)).toBe(60) // Math.max(36, 100 / 10 * 6 = 60) = 60
    })

    it('should return correct height for default size when size is omitted', () => {
        expect(getNodeHeight(undefined, range)).toBe(36) // The default value "md" is used.
    })

})

describe('optimizeEventNode', () => {

    it('should handle undefined', () => {
        expect(optimizeEventNode({} as Partial<Def.EventNode>, {} as Def.TimelineOptions, {} as Def.Measures)).toEqual({
            uid: expect.any(Number),
            x: -1,
            y: -1,
            w: 0,
            h: 0
        })
    })

})

const mockStorage = () => {
    const storage: { [key: string]: string } = {}
    return {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
        clear: () => { Object.keys(storage).forEach(key => delete storage[key]); }
    }
}

beforeEach(() => {
    vi.stubGlobal('sessionStorage', mockStorage())
    vi.stubGlobal('localStorage', mockStorage())
})

describe('saveToStorage', () => {

    it('should save a string to storage', () => {
        saveToStorage('localStorage', 'testKey', 'testData')
        const storedData = localStorage.getItem('testKey')
        expect(storedData).not.toBeNull()
    })

    it('should save an object to storage', () => {
        const data = { a: 1, b: 2 }
        saveToStorage('localStorage', 'testKey', data)
        const storedData = localStorage.getItem('testKey')
        expect(storedData).not.toBeNull()
    })

    it('should set an expiration for the data if specified', () => {
        saveToStorage('localStorage', 'testKey', 'testData', true)
        const expirationData = localStorage.getItem('testKey:expiration')
        expect(expirationData).not.toBeNull()
    })

})

describe('loadFromStorage', () => {

    it('should load data from storage', () => {
        saveToStorage('localStorage', 'testKey', 'testData')
        const loadedData = loadFromStorage('localStorage', 'testKey')
        expect(loadedData).toBe('testData')
    })

    it('should return null if data is not found', () => {
        const loadedData = loadFromStorage('localStorage', 'nonExistentKey')
        expect(loadedData).toBeNull()
    })

    it('should handle expired data', () => {
        saveToStorage('localStorage', 'testKey', 'testData', true)
        const expirationKey = 'testKey:expiration'
        const expirationData = JSON.parse(localStorage.getItem(expirationKey) || '{}')
        expirationData.cached -= 100000
        localStorage.setItem(expirationKey, JSON.stringify(expirationData))
        const loadedData = loadFromStorage('localStorage', 'testKey', 50000)
        expect(loadedData).toBeNull()
    })

    it('should handle data with unmatched hash', () => {
        saveToStorage('localStorage', 'testKey', 'testData', true)
        const expirationKey = 'testKey:expiration'
        const expirationData = JSON.parse(localStorage.getItem(expirationKey) || '{}')
        expirationData.hash = 'mismatchHash'
        localStorage.setItem(expirationKey, JSON.stringify(expirationData))
        const loadedData = loadFromStorage('localStorage', 'testKey', 50000)
        expect(loadedData).toBeNull()
    })

})

describe('removeToStorage', () => {

    it('should remove data from storage', () => {
        saveToStorage('localStorage', 'testKey', 'testData')
        removeToStorage('localStorage', 'testKey')
        const storedData = localStorage.getItem('testKey')
        expect(storedData).toBeNull()
    })

    it('should remove multiple keys from storage', () => {
        saveToStorage('localStorage', 'testKey1', 'testData1')
        saveToStorage('localStorage', 'testKey2', 'testData2')
        removeToStorage('localStorage', 'testKey1', 'testKey2')
        expect(localStorage.getItem('testKey1')).toBeNull()
        expect(localStorage.getItem('testKey2')).toBeNull()
    })

})

