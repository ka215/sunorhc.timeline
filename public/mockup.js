
const init = function() {
    // Define global variables
    window.$sunorhc = window.hasOwnProperty('$sunorhc') ? window.$sunorhc : {}

    // Load data
    fetchData('./mockup.json').then(response => {
        // Set variables
        $sunorhc.version = response.version

    })
    .catch(error => {
        // When error
        console.error(error)
    })
    .finally(() => {
        // Mount application
        console.log($sunorhc)
        testRender('mySunorhcTimeline')
    })
}

/**
 * Asynchronously post as a wrapper for the Fetch API
 * @param  {string} [url='']  - URL of the request destination
 * @param  {string} [method='get'] - Set method to fetch
 * @param  {Object} [data={}] - The key-value type object of data to send
 * @param  {string} [datatype='json'] - Response data type (defaults to JSON)
 * @param  {number} [timeout=15000] - Set timeout in fetching (defaults to after 15 sec)
 * @return {Object} The response of fetch request is returned as a promise object
 */
async function fetchData( url = '', method = 'get', data = {}, datatype = 'json', timeout = 15000 ) {
    const controller = new AbortController(),
          timeoutId  = setTimeout(() => { controller.abort() }, timeout )
    let params   = new URLSearchParams(),
        sendData = {}
    
    //console.log('fetchData::before:', url, method, data)
    if ( !url || !/^(get|post|put|delete|patch)$/i.test(method) ) {
        //return Promise.reject( new Error( 'Invalid argument(s) given.' ) )
        return Promise.reject( { type: 'bad_request', status: 400, message: 'Invalid argument(s) given.' } )
    }

    sendData = {
        method: method,
        mode: 'cors',// no-cors, *cors, same-origin
        cache: 'no-cache',// *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit',// include, *same-origin, omit
        //headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',// manual, *follow, error
        referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        signal: controller.signal,
        //body: JSON.stringify( data ),
    }   
    if ( data ) {
        for ( let key in data ) {
            if ( Object.prototype.hasOwnProperty.call( data, key ) ) {
                params.append( key, data[key] )
            }
        }
    }
    if ( 'get' !== method ) {
        sendData.body = params
    }
    try {
        const response = await fetch( url, sendData )
        if ( !response.ok ) {
            //return Promise.reject( new Error( `status: ${response.status}, message: ${response.statusText}` ) )
            const errObj = await response.json()
            return Promise.reject( { code: errObj.code, status: errObj.data.status, message: errObj.message } )
        } else {
            const retval = datatype === 'json' ? await response.json() : await response.text()
            return Promise.resolve( retval )
        }
    } finally {
        clearTimeout( timeoutId )
    }
}

// For test
function isNumberString(numstr) {
    return typeof numstr === 'string' && numstr !== '' && !isNaN(numstr)
}

function isBooleanString(boolstr) {
    return typeof boolstr === 'string' && boolstr !== '' && /^(true|false)$/i.test(boolstr)
}

function getRect(element, property = '') {
    const _RECT_OBJ = element.getBoundingClientRect()
    if (property === '') {
        return _RECT_OBJ
    } else if (Object.getPrototypeOf(_RECT_OBJ).hasOwnProperty(property)) {
        return _RECT_OBJ[property]
    } else {
        return false
    }
}

function getAttr(element, attribute = '') {
    const _ATTS = element.getAttributeNames()
    // const isNumberString = n => typeof n === 'string' && n !== '' && !isNaN(n)
    // const isBooleanString = b => typeof b === 'string' && b !== '' && /^(true|false)$/i.test(b)
    if (_ATTS.length == 0) {
        return undefined
    }
    if (attribute === '') {
        let _obj = {}
        _ATTS.forEach(item => {
            let _val = element.getAttribute(item)
            _obj[item] = isNumberString(_val)
                ? Number(_val) : (isBooleanString(_val)
                ? /^true$/i.test(_val) : _val)
        })
        return _obj
    } else if (_ATTS.includes(attribute)) {
        let _val = element.getAttribute(attribute)
        return isNumberString(_val)
            ? Number(_val) : (isBooleanString(_val)
            ? /^true$/i.test(_val) : _val)
    } else {
        return undefined
    }
}

function setAttr(elements, attributes = {}) {
    const _ELMS = (elements instanceof Array) ? elements : [elements]
    _ELMS.map(elm => {
        for (const _key in attributes) {
            elm.setAttribute(_key, attributes[_key])
        }
    })
}

function setCss(elements, styles = '') {
    const _ELMS = (elements instanceof Array) ? elements : [elements]
    _ELMS.map(elm => {
        if (styles instanceof Object) {
            for (const _prop in styles) {
                elm.style[_prop] = styles[_prop]
            }
        } else {
            elm.style.cssText = String(styles)
        }
    })
}

function testRender(id) {
    const STL_ELEMENT        = document.getElementById(id)
    const STL_RULER_TOP      = STL_ELEMENT.querySelector('.sunorhc-timeline-ruler[data-ruler-position="top"]')
    const STL_RULER_BOTTOM   = STL_ELEMENT.querySelector('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')
    const STL_SIDEBAR_LEFT   = STL_ELEMENT.querySelector('.sunorhc-timeline-sidebar[data-sidebar-position="left"]')
    const STL_SIDEBAR_RIGHT  = STL_ELEMENT.querySelector('.sunorhc-timeline-sidebar[data-sidebar-position="right"]')
    const STL_NODE_CONTAINER = STL_ELEMENT.querySelector('.sunorhc-timeline-nodes')

    const STL_SIDEBAR_SETTINGS = {
        offsetTop:      getRect(STL_RULER_TOP, 'height'),
        offsetBottom:   getRect(STL_RULER_BOTTOM, 'height'),
        maxWidthLeft:   getAttr(STL_SIDEBAR_LEFT, 'data-sidebar-max-width') || 'auto',
        maxWidthRight:  getAttr(STL_SIDEBAR_RIGHT, 'data-sidebar-max-width') || 'auto',
        maxHeightType:  getAttr(STL_SIDEBAR_LEFT, 'data-sidebar-max-height') || getAttr(STL_SIDEBAR_RIGHT, 'data-sidebar-max-height') || 'auto',
        maxHeightItems: [],
    }

    const STL_SIDEBAR_LEFT_ITEMS    = Array.from(STL_SIDEBAR_LEFT.querySelectorAll('.sunorhc-timeline-sidebar-items li'))
    const STL_SIDEBAR_RIGHT_ITEMS   = Array.from(STL_SIDEBAR_RIGHT.querySelectorAll('.sunorhc-timeline-sidebar-items li'))
    const STL_SIDEBAR_LEFT_HEIGHTS  = STL_SIDEBAR_LEFT_ITEMS.map(elm => getRect(elm, 'height'))
    const STL_SIDEBAR_RIGHT_HEIGHTS = STL_SIDEBAR_RIGHT_ITEMS.map(elm => getRect(elm, 'height'))
    STL_SIDEBAR_LEFT_HEIGHTS.forEach((h, i) => {
        const _type = STL_SIDEBAR_SETTINGS.maxHeightType
        let _setVal
        if (isNumberString(_type) || !isNaN(_type)) {
            _setVal = Number(_type)
        } else if ('min' === _type) {
            _setVal = Math.min(h, STL_SIDEBAR_RIGHT_HEIGHTS[i])
        } else {
            _setVal = Math.max(h, STL_SIDEBAR_RIGHT_HEIGHTS[i])
        }
        STL_SIDEBAR_SETTINGS.maxHeightItems[i] = _setVal
    })
    console.log(STL_SIDEBAR_LEFT_HEIGHTS, STL_SIDEBAR_RIGHT_HEIGHTS, STL_SIDEBAR_SETTINGS.maxHeightItems)
    STL_SIDEBAR_SETTINGS.maxHeightItems.forEach((v, i) => {
        setCss([ STL_SIDEBAR_LEFT_ITEMS[i], STL_SIDEBAR_RIGHT_ITEMS[i] ], `height: ${v}px`)
    })
    if (/^(\d{1,}|min)$/i.test(STL_SIDEBAR_SETTINGS.maxHeightType)) {
        const _avatar_images = Array.from(STL_SIDEBAR_LEFT.querySelectorAll('[data-sidebar-item-type="avatar"]:only-child'))
                               .concat(Array.from(STL_SIDEBAR_RIGHT.querySelectorAll('[data-sidebar-item-type="avatar"]:only-child')))
        setCss(_avatar_images, `height: 100%; width: auto;`)
    }

    Array.from(STL_ELEMENT.querySelectorAll('[data-text-overflow="hidden"]')).forEach(elm => {
        setAttr(elm, { title: elm.textContent })
    })

    //setCss(STL_SIDEBAR_LEFT, `padding-top: ${STL_SIDEBAR_SETTINGS.offsetTop}px; padding-bottom: ${STL_SIDEBAR_SETTINGS.offsetBottom}px;`)
    //setCss(STL_SIDEBAR_RIGHT, { paddingTop: `${STL_SIDEBAR_SETTINGS.offsetTop}px`, paddingBottom: `${STL_SIDEBAR_SETTINGS.offsetBottom}px` })
    //setCss([ STL_SIDEBAR_LEFT, STL_SIDEBAR_RIGHT ], `padding-top: ${STL_SIDEBAR_SETTINGS.offsetTop}px; padding-bottom: ${STL_SIDEBAR_SETTINGS.offsetBottom}px;`)
    setCss([ STL_SIDEBAR_LEFT, STL_SIDEBAR_RIGHT ], { paddingTop: `${STL_SIDEBAR_SETTINGS.offsetTop}px`, paddingBottom: `${STL_SIDEBAR_SETTINGS.offsetBottom}px` })

    //const STL_RULER_SETTINGS
    setCss(STL_NODE_CONTAINER, `height: calc(100% - ${STL_SIDEBAR_SETTINGS.offsetTop + STL_SIDEBAR_SETTINGS.offsetBottom}px);`)

    console.log(STL_SIDEBAR_LEFT_ITEMS, STL_SIDEBAR_SETTINGS, getAttr(STL_ELEMENT))


}

// Dispatcher
if ( document.readyState === 'complete' || ( document.readyState !== 'loading' && ! document.documentElement.doScroll ) ) {
    init()
} else
if ( document.addEventListener ) {
    document.addEventListener( 'DOMContentLoaded', init, false )
} else {
    window.onload = init
}
