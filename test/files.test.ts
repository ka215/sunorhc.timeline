import { describe, expect, it, afterAll, vi } from 'vitest'
import { fetchData } from '../src/utils/files'

describe('fetchData', () => {
    //let global: { [key: string]: any } = {}

    afterAll(() => {
        vi.resetAllMocks()
        //global.fetch.mockClear()
    })

    it('returns data from a successful fetch', async () => {
        // Mock successful response
        const mockData = { data: 'mock data' }
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
        }) as Promise<Response>)

        // Call fetchData with mock options
        const result = await fetchData({
            url: 'https://example.com/api/data',
            method: 'get',
            data: {},
            datatype: 'json',
            timeout: 5000,
        })

        // Expect result to match mock data
        expect(result).toEqual(mockData)
    })

    it('handles error response from fetch', async () => {
        // Mock error response
        const mockError = { code: 'error_code', status: 500, message: 'Internal Server Error' }
        global.fetch = vi.fn(() => Promise.resolve({
            ok: false,
            json: () => Promise.resolve(mockError),
        }) as Promise<Response>)

        // Call fetchData with mock options
        try {
            await fetchData({
                url: 'https://example.com/api/data',
                method: 'get',
                data: {},
                datatype: 'json',
                timeout: 5000,
            })
        } catch (error) {
            // Expect error to match mock error
            expect(error).toEqual(mockError)
        }
    })

})
