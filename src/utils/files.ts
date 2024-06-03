// Product-independent general-purpose methods for file operations
// Methods:
// fetchData, 

/**
 * Fetch data using the specified URL and method.
 * This function serves as a wrapper for the Fetch API.
 * 
 * @param {FetchDataOptions} options - The options for fetching data.
 * @returns {Promise<any>} - A promise that resolves to the fetched data.
 */
interface FetchDataOptions {
    url?: string;
    method?: string;
    data?: Record<string, any>;
    datatype?: string;
    timeout?: number;// default to `5e3` ms (= 5 sec.)
}
export const fetchData = async ({
    url = '',
    method = 'get',
    data = {},
    datatype = 'json',
    timeout = 5e3
}: FetchDataOptions = {}): Promise<any> => {
    const controller = new AbortController()
    const timeoutId = timeout > 0 ? setTimeout(() => {
        controller.abort()
    }, timeout) : null

    if (!url || !/^(get|post|put|delete|patch)$/i.test(method)) {
        return Promise.reject({
            type: 'bad_request',
            status: 400,
            message: 'Invalid argument(s) given.'
        })
    }

    const params = new URLSearchParams()
    let sendData: RequestInit = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        signal: controller.signal
    }

    if (data) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                params.append(key, data[key])
            }
        }
    }

    if (method.toLowerCase() !== 'get') {
        sendData.body = params
    } else {
        if (params.toString()) {
            url += '?' + params
        }
    }

    try {
        const response = await fetch(url, sendData)
        if (response.ok) {
            const retval = datatype === 'json' ? await response.json() : await response.text()
            return Promise.resolve(retval)
        } else {
            const errObj = await response.json()
            return Promise.reject({
                code: errObj.code,
                status: errObj.status || errObj.statusText,
                message: errObj.message
            })
        }
    } catch (err) {
        if (err instanceof SyntaxError) {
            console.error(`Response is not valid ${datatype.toUpperCase()}.`)
        } else {
            console.error('Fetch error:', err)
        }
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
    }
}

