// DOM-related general-purpose helper methods
// Methods:
// isElement, getRect, getAtts, setAtts, removeAtts, setStyles, setContent, strToNode, replaceTagName, 
// replaceAttribute, wrapChildNodes, isHidden, hide, show, toggleClass, reflow, watcher

import { isNumberString, isBooleanString } from './common'

/**
 * Finds whether the given variable is an element of HTML.
 * 
 * @param {any} node 
 * @returns {boolean}
 */
export const isElement = (node: any): boolean => {
    return !(!node || !(node.nodeName || node.prop && node.attr && node.find))
}

/**
 * Retrieves a DOMRect object providing information about the size 
 * of given an element and its position relative to the viewport.
 * This function as a wrapper of  Element.getBoundingClientRect() 
 * method.
 * 
 * @param {HTMLElement} targetElement 
 * @param {RectProperties} property
 * @returns {DOMRect | number | boolean}
 */
type RectProperties = 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'
export const getRect = (targetElement: HTMLElement, property?: RectProperties): DOMRect | number | boolean => {
    if (!isElement(targetElement)) {
        return false
    }
   
    const rectObj: DOMRect = targetElement.getBoundingClientRect()
    
    return property ? rectObj[property] : rectObj
}

/**
 * Gets the attribute of the specified element and returns the value 
 * of the specified attribute if it exists. If no attributes are specified,
 * returns all attributes and their values as objects.
 * 
 * @param {HTMLElement} targetElement 
 * @param {string} attribute 
 * @returns {string | number | boolean | object | undefined}
 */
export const getAtts = (targetElement: HTMLElement, attribute: string = ''): string | number | boolean | object | undefined => {
    const attributeNames = targetElement.getAttributeNames()
    
    if (attributeNames.length === 0) {
        return
    }

    if (attribute === '') {
        const attributes: Record<string, string | number | boolean> = {}
        attributeNames.forEach(name => {
            const value = targetElement.getAttribute(name)
            if (value !== null) {
                attributes[name] = isNumberString(value) ? Number(value) : isBooleanString(value) ? /^true$/i.test(value) : value
            } else {
                // If the boolean attribute exists, getAttribute returns the attribute name, otherwise it returns null.
                attributes[name] = ''
            }
        })
        return attributes
    }

    if (attributeNames.includes(attribute)) {
        const value = targetElement.getAttribute(attribute)
        if (value !== null) {
            return isNumberString(value) ? Number(value) : isBooleanString(value) ? /^true$/i.test(value) : value
        } else {
            // If the boolean attribute exists, getAttribute returns the attribute name, otherwise it returns null.
            return ''
        }
    }
}

/**
 * Sets attributes on the specified element or elements.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements.
 * @param {Object.<string, string>} attributes - An object containing attribute name and value pairs.
 */
export const setAtts = (targetElements: HTMLElement | HTMLElement[], attributes: Record<string, string>): void => {
    (Array.isArray(targetElements) ? targetElements : [targetElements]).forEach(elm => {
        for (const key in attributes) {
            if (typeof key === 'string' && !/^[-+]?\d+$/.test(key) && Object.prototype.hasOwnProperty.call(attributes, key)) {
                elm.setAttribute(key, attributes[key])
            }
        }
    })
}

/**
 * Remove attributes from the specified element or elements.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements.
 * @param {string | string[]} attributes - The name of the attribute or an array of attribute names to be removed.
 */
export const removeAtts = (targetElements: HTMLElement | HTMLElement[], attributes: string | string[]): void => {
    (Array.isArray(targetElements) ? targetElements : [targetElements]).forEach(elm => {
        (Array.isArray(attributes) ? attributes : [attributes]).forEach(att => {
            if (elm.hasAttribute(att)) {
                elm.removeAttribute(att)
            }
        })
    })
}

/**
 * Sets CSS styles on the specified element or elements.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements.
 * @param {string | Record<string, string>} styles - The CSS styles to be applied. This can be either a CSS string or an object containing style properties and values.
 */
export const setStyles = (targetElements: HTMLElement | HTMLElement[], styles: string | Record<string, string>): void => {
    (Array.isArray(targetElements) ? targetElements : [targetElements]).forEach((elm: HTMLElement) => {
        if (typeof styles === 'object') {
            for (const prop in styles) {
                if (Object.prototype.hasOwnProperty.call(styles, prop)) {
                    (elm.style as any)[prop as keyof CSSStyleDeclaration] = styles[prop]
                }
            }
        } else {
            elm.style.cssText = String(styles)
        }
    })
}

/**
 * Injects content into the specified element or element ID.
 * If `isText` is set to false, content is injected as HTML.
 * 
 * @param {HTMLElement | string} targetElement - The target element or element ID.
 * @param {string} content - The content to inject.
 * @param {boolean | undefined} isText - (Optional) If true, injects content as text. If false, injects content as HTML. Default is true.
 */
export const setContent = (targetElement: HTMLElement | string, content: string, isText: boolean | undefined = true): void => {
    if (typeof targetElement === 'string') {
        targetElement = document.getElementById(targetElement)! as HTMLElement
    }
    if (targetElement instanceof HTMLElement) {
        if (isText) {
            targetElement.textContent = content
        } else {
            targetElement.innerHTML = content
        }
    }
}

/**
 * Parses a string into a DOM node using the DOMParser.
 * 
 * @param {string} str - The string to parse into a DOM node.
 * @returns {Node} - The parsed DOM node.
 */
export const strToNode = (str: string): Node => {
    const parser = new DOMParser()
    return parser.parseFromString(str, "text/html").body.firstChild!
}

/**
 * Replaces the tag name of the specified element with the given tag name.
 * 
 * @param {HTMLElement} targetElement - The target element whose tag name will be replaced.
 * @param {string} tagName - The new tag name to replace the existing one.
 * @returns {HTMLElement | undefined} - The replaced element with the new tag name, or undefined if failure.
 */
export const replaceTagName = (targetElement: HTMLElement, tagName: string): HTMLElement | undefined => {
    if (!(targetElement instanceof HTMLElement)) {
        return undefined
    }

    const replacement = document.createElement(tagName)

    Array.from(targetElement.attributes).forEach(attribute => {
        const { name, value } = attribute
        if (value) replacement.setAttribute(name, value)
    })

    while (targetElement.firstChild) {
        replacement.appendChild(targetElement.firstChild)
    }

    if (targetElement.parentNode) {
        targetElement.parentNode.replaceChild(replacement, targetElement)
    }

    return replacement
}

/**
 * Replaces the specified attribute of the element with a new one.
 * 
 * @param {HTMLElement} targetElement - The target element whose attribute will be replaced.
 * @param {string} attributeName - The name of the attribute to be replaced.
 * @param {string} replacementName - The name of the replacement attribute.
 * @returns {Record<string, string> | undefined} - An object containing the previous attribute value under the replaced attribute name.
 */
export const replaceAttribute = (targetElement: HTMLElement, attributeName: string, replacementName: string): Record<string, string> | undefined => {
    if (!(targetElement instanceof HTMLElement)) {
        return undefined
    }

    const attrValue = targetElement.getAttribute(attributeName)
    const prevAttr: Record<string, string> = {}

    if (!attrValue) {
        //return prevAttr
        return undefined
    }

    targetElement.setAttribute(replacementName, attrValue)
    targetElement.removeAttribute(attributeName)

    prevAttr[attributeName] = attrValue

    return prevAttr
}

/**
 * Wraps the child elements or text nodes of the specified element with the specified element.
 * 
 * @param {HTMLElement} parentElement - The parent element to wrap the child elements or text nodes around.
 * @param {string} wrapperTag - The tag name of the wrapper element to use.
 * @returns {void}
 */
export const wrapChildNodes = (parentElement: HTMLElement, wrapperTag: string): void => {
    if (wrapperTag === '') {
        return
    }
    // Get the child nodes of a parent element.
    const childNodes = Array.from(parentElement.childNodes)

    // Remove the original child nodes (to replace them with the wrapper element).
    childNodes.forEach(child => parentElement.removeChild(child))

    // Wrap each child node.
    childNodes.forEach(child => {
       // Create a new wrapper element.
       const wrapper = document.createElement(wrapperTag)

       // Adding a child node to a wrapper element.
       wrapper.appendChild(child)

       // Add a wrapper element to the parent element.
       parentElement.appendChild(wrapper)
    })
}

/**
 * Checks if the specified element is currently hidden.
 * 
 * @param {HTMLElement} targetElement - The target element to check.
 * @param {string[]} [checkProperties] - Optional array of CSS properties to check for visibility.
 * @returns {boolean} - True if the element is hidden, otherwise false.
 */
export const isHidden = (targetElement: HTMLElement, checkProperties?: string[]): boolean => {
    if (!(targetElement instanceof HTMLElement)) {
        return false
    }

    const elmStyles = window.getComputedStyle(targetElement)
    let elmStatus: Record<string, any> = {}

    checkProperties = checkProperties || ['display', 'opacity', 'visibility']

    checkProperties.forEach(prop => {
        elmStatus[prop] = elmStyles.getPropertyValue(prop)
    })

    elmStatus.hidden = targetElement.hasAttribute('hidden')

    return elmStatus.hidden || elmStatus.display === 'none' || elmStatus.opacity === '0' || elmStatus.visibility === 'hidden'
}

/**
 * Hides the specified element or elements by setting their display style to 'none'.
 * Note: This method uses `replaceAttribute()` and `setStyles()` methods.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements to hide.
 */
export const hide = (targetElements: HTMLElement | HTMLElement[]): void => {
    (Array.isArray(targetElements) ? targetElements : [targetElements]).forEach(elm => {
        replaceAttribute(elm, 'style', 'data-cached-style')
        replaceAttribute(elm, 'class', 'data-cached-class')
        setStyles(elm, 'display: none !important')
    })
}

/**
 * Shows the previously hidden elements by restoring their original styles and classes.
 * Note: This method uses `replaceAttribute()` method.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements to show.
 */
export const show = (targetElements: HTMLElement | HTMLElement[]): void => {
    (Array.isArray(targetElements) ? targetElements : [targetElements]).forEach(elm => {
        replaceAttribute(elm, 'data-cached-style', 'style')
        replaceAttribute(elm, 'data-cached-class', 'class')
    })
}

/**
 * Toggles CSS classes on the specified element.
 * 
 * @param {HTMLElement} targetElement - The target element on which to toggle classes.
 * @param {string | string[] | Record<string, boolean>} classes - The CSS class or classes to toggle.
 * @param {boolean} [force] - (Optional) If provided, specifies whether to add or remove the class. 
 *                            If true, adds the class; if false, removes the class. If omitted, toggles the class.
 */
export const toggleClass = (targetElement: HTMLElement, classes: string | string[] | Record<string, boolean>, force?: boolean): void => {
    // Handle only if the target element exists and the class is specified.
    if (targetElement instanceof HTMLElement && (Array.isArray(classes) ? classes.length > 0 : /^(string|object)$/.test(typeof classes))) {
        // Given classes cast to arraying.
        const classList = Array.isArray(classes) ? classes : [classes] as (string | Record<string, boolean>)[]

        // Handles classes toggling.
        classList.forEach(oneClass => {
            if (typeof oneClass === 'object') {
                // If the class has been specified of object type.
                for (const property in oneClass) {
                    if (typeof oneClass[property] === 'boolean') {
                        // Toggle class if property is boolean.
                        targetElement.classList.toggle(property, oneClass[property])
                    }
                }
            } else if (typeof oneClass === 'string') {
                // If the class is specified of string type.
                if (force === undefined) {
                    // Toggle class if force parameter is not specified.
                    targetElement.classList.toggle(oneClass)
                } else {
                    // Add or remove classes if force parameter is specified.
                    targetElement.classList.toggle(oneClass, force)
                }
            }
        })
    }
}

/**
 * Forces a reflow on the specified element to obtain accurate size information.
 * 
 * @param {HTMLElement} targetElement - The target element on which to perform reflow.
 * @returns {Promise<HTMLElement>} - A Promise that resolves with the target element after reflow.
 * @throws {Error} - Throws an error if the target element is not a valid HTMLElement.
 */
export const reflow = async (targetElement: HTMLElement): Promise<HTMLElement> => {
    return await new Promise((resolve, reject) => {
        if (targetElement instanceof HTMLElement) {
            // Forced reflow to obtain accurate size information for specified element.
            const discardValues: (number | CSSStyleDeclaration)[] = [
                window.getComputedStyle(targetElement),
                targetElement.offsetWidth,
                targetElement.offsetHeight,
                targetElement.scrollHeight,
            ]
            void discardValues
            //console.debug('Reflow element:', targetElement, discardValues)
            resolve(targetElement)
        } else {
            reject(new Error('The reflow target is not an element.'))
        }
    })
}

export type CallbackFunction = (mutation: MutationRecord, observer: MutationObserver) => void

/**
 * Watches the specified element.
 * This function serves as a wrapper for MutationObserver.
 * 
 * @param {HTMLElement | HTMLElement[]} targetElements - The target element or an array of target elements to watch.
 * @param {CallbackFunction} callback - The callback function to execute when mutations are observed.
 * @param {MutationObserverInit} [config={}] - (Optional) The configuration options for MutationObserver.
 * @returns {void}
 */
export const watcher = (targetElements: HTMLElement | HTMLElement[], callback: CallbackFunction, config: MutationObserverInit = {}): void => {
    // Convert targetElements to an array if it's not already an array
    const elements = Array.isArray(targetElements) ? targetElements : [targetElements]

    // Check if the callback function is valid
    if (!callback || typeof callback !== 'function') return

    // Default configuration options
    const options: MutationObserverInit = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        ...config
    }

    // Iterate through each target element
    elements.forEach(elm => {
        // Check if the target element is a valid HTML element
        if (!(elm instanceof HTMLElement)) {
            // Log an error message if the target element is not valid
            console.error('Watching target is not an HTML element.')
            return
        }

        // Create a new MutationObserver instance
        const observer = new MutationObserver(mutations => {
            // Execute the callback function for each observed mutation
            mutations.forEach(mutation => {
                callback(mutation, observer)
            })
        })

        // Start observing mutations on the target element with the specified configuration
        observer.observe(elm, options)
    })
}
