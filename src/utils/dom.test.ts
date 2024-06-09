import { isElement, getRect, getAtts, setAtts, removeAtts, setStyles, setContent, strToNode, replaceTagName, replaceAttribute, wrapChildNodes, isHidden, hide, show, toggleClass, reflow, watcher } from './dom'
import { Window } from 'happy-dom'
//import { JSDOM } from 'jsdom'
import $ from 'jquery'

describe('isElement', () => {

    it('should handle null', () => {
        expect(isElement(null)).toEqual(false)
    })

    it('should handle undefined', () => {
        expect(isElement(undefined as any)).toEqual(false)
    })
    
    it(`should handle 'null'`, () => {
        expect(isElement('null')).toEqual(false)
    })
    
    it(`should handle 'undefined'`, () => {
        expect(isElement('undefined')).toEqual(false)
    })
    
    it('should handle empty strings', () => {
        expect(isElement('')).toEqual(false)
    })
    
    it('should handle normal strings', () => {
        expect(isElement('test')).toEqual(false)
    })
    
    it('should handle numbers', () => {
        expect(isElement(33)).toEqual(false)
    })
    
    it('should handle boolean', () => {
        expect(isElement(true)).toEqual(false)
    })
  
    it('should handle a value of "true"', () => {
        expect(isElement('true')).toEqual(false)
    })
    
    it('should handle a value of "false"', () => {
        expect(isElement('false')).toEqual(false)
    })

    it('should handle empty object', () => {
        expect(isElement({})).toEqual(false)
    })

    it('should handle a shallow object', () => {
        expect(isElement({ str: 'str', boo: true, num: 3 })).toEqual(false)
    })
    
    it('should handle a deep object', () => {
        expect(isElement({ str: 'str', boo: true, num: 3, arr: [1, 2, 3], obj: { one: { two: { three: 3 } } } }))
        .toEqual(false)
    })
    
    it('should handle arrays', () => {
        expect(isElement(['str', true, 3 ])).toEqual(false)
    })

    it('should handle arrays may have a tailing comma', () => {
        expect(isElement(['str', true, 3, ])).toEqual(false)
    })

    it('should handle Symbol', () => {
        expect(isElement(Symbol('test'))).toEqual(false)
    })
    
    it('should handle iterator object', () => {
        function* makeIterator() {
            yield 1;
            yield 2;
        }
        const iterator = makeIterator()
        expect(isElement(iterator)).toEqual(false)
    })

    it('should handle DOM element', () => {
        const element = document.createElement('p')
        expect(isElement(element)).toEqual(true)
    })

    it('returns true for a valid HTML element', () => {
        const element = document.createElement('div')
        expect(isElement(element)).toBe(true)
    })

    it('returns true for a jQuery object', () => {
        const element = $('<div></div>')
        expect(isElement(element)).toBe(true)
    })

    it('returns false for undefined', () => {
        expect(isElement(undefined)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isElement(null)).toBe(false)
    })

    it('returns false for an empty object', () => {
        expect(isElement({})).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isElement('div')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isElement(123)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isElement(true)).toBe(false)
    })

})

describe('getRect', () => {

    const window = new Window({
        url: 'https://localhost:8080',
        height: 1080,
        width: 1920,
        settings: {
            navigator: {
                userAgent: 'Mozilla/5.0 (X11; Linux x64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/2.0.0'
            }
        }
    })
    const document = window.document

    beforeAll(async () => {
        document.body.innerHTML = '<div id="test-elm" class="container"></div>'
        const container = document.querySelector('.container')
        const button = document.createElement('button')
        container!.appendChild(button)

        await window.happyDOM.waitUntilComplete()
        //console.log(document.body.innerHTML)
    })
    
    afterAll(() => {
        window.happyDOM.close()
    })
    
    it('should handle undefined', () => {
        expect(getRect(undefined as unknown as HTMLElement)).toBeFalsy()
    })

    it('should handle empty strings', () => {
        expect(getRect('' as unknown as HTMLElement)).toBeFalsy()
    })

    it('should handle object', () => {
        expect(getRect({ id: 1, name: "Joe" } as unknown as HTMLElement)).toBeFalsy()
    })

    it('should handle element', () => {
        document.body.innerHTML = '<div id="test-elm" style="width:100px;height:100px;"></div>'
        const targetElm = document.getElementById('test-elm') as unknown as HTMLDivElement
        const rect = getRect(targetElm)
        //console.log(targetElm, rect)
        expect(rect).toBeTypeOf('object')
        expect(rect).toEqual(expect.objectContaining({
            x: expect.any(Number),
            y: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            top: expect.any(Number),
            right: expect.any(Number),
            bottom: expect.any(Number),
            left: expect.any(Number)
        }))
    })

    it('returns false if targetElement is not an HTMLElement', () => {
        const notHTMLElement = 'not an element'
        expect(getRect(notHTMLElement as unknown as HTMLElement)).toBe(false)
    })

    it('returns DOMRect object if targetElement is an HTMLElement', () => {
        const targetElement = document.createElement('div')
        document.body.appendChild(targetElement)
        const rect = getRect(targetElement as unknown as HTMLElement)
        //console.log(rect)
        expect(rect).toBeInstanceOf(DOMRect)
        expect(rect).toMatchObject({
            x: expect.any(Number),
            y: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            top: expect.any(Number),
            right: expect.any(Number),
            bottom: expect.any(Number),
            left: expect.any(Number)
        })
    })

    it('returns the specified property of DOMRect object if property is provided', () => {
        const targetElement = document.createElement('div')
        targetElement.style.width = '100px'
        targetElement.style.height = '100px'
        document.body.appendChild(targetElement)
        // Mock to assert that fired `getBoundingClientRect`
        const DOMRectMock = vi.spyOn(targetElement, 'getBoundingClientRect').mockImplementation(() => {
            return new DOMRect(0, 0, 100, 100)
        })

        const rectWidth = getRect(targetElement as unknown as HTMLDivElement, 'width')
        const rectHeight = getRect(targetElement as unknown as HTMLDivElement, 'height')
        
        expect(rectWidth).toBe(100)
        expect(rectHeight).toBe(100)

        document.body.removeChild(targetElement)
        // Reset mock
        DOMRectMock.mockReset()
    })

    it('returns entire DOMRect object if property is not provided', () => {
        const targetElement = document.createElement('div')
        targetElement.style.width = '100px'
        targetElement.style.height = '100px'
        document.body.appendChild(targetElement)
        // Mock to assert that fired `getBoundingClientRect`
        const DOMRectMock = vi.spyOn(targetElement, 'getBoundingClientRect').mockImplementation(() => {
            return new DOMRect(0, 0, 100, 100)
        })

        const rect = getRect(targetElement as unknown as HTMLDivElement) as DOMRect
        
        expect(rect).toBeInstanceOf(DOMRect)
        expect(rect.width).toBe(100)
        expect(rect.height).toBe(100)

        document.body.removeChild(targetElement)
        // Reset mock
        DOMRectMock.mockReset()
    })

})

describe('getAtts', () => {

    // Mock HTMLInputElement
    const mockInputElement = {
        getAttributeNames: () => ['type', 'value', 'checked', 'disabled', 'data-custom'],
        getAttribute: (name: string) => {
            switch (name) {
                case 'type':
                    return 'checkbox'
                case 'value':
                    return '1'
                case 'checked':
                    return 'checked'
                case 'disabled':
                    return 'disabled'
                case 'data-custom':
                    return null
                default:
                    return null
            }
        },
    } as unknown as HTMLInputElement

    const window = new Window({
        url: 'https://localhost:8080',
        height: 1080,
        width: 1920,
        settings: {
            navigator: {
                userAgent: 'Mozilla/5.0 (X11; Linux x64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/2.0.0'
            }
        }
    })
    const document = window.document
    let mockElement: any
    let mockElement2: any

    beforeAll(async () => {

        mockElement = document.createElement('div')
        mockElement.setAttribute('data-id', '123')
        mockElement.setAttribute('data-value', 'true')
        mockElement.setAttribute('class', 'item item-2')
        mockElement.innerHTML = '<input id="test-input" type="checkbox" value="1" checked disabled>'
        mockElement2 = document.getElementById('test-input') as unknown as HTMLInputElement

        await window.happyDOM.waitUntilComplete()        
    })

    afterAll(async () => {
        await window.happyDOM.close()
    })

    it('should return undefined if the element has no attributes', () => {
        const element = document.createElement('p')
        const result = getAtts(element as unknown as HTMLParagraphElement)
        expect(result).toBeUndefined()
    });

    it('should return an object containing all attributes if no specific attribute is provided', () => {
        const result = getAtts(mockElement)
        expect(result).toEqual({
            'data-id': 123,
            'data-value': true,
            class: 'item item-2',
        })
    })

    it('should return an object containing all attributes if no specific attribute is provided (2)', () => {
        const result = getAtts(mockInputElement)
        expect(result).toEqual({
            'checked': 'checked',
            'data-custom': '',
            'disabled': 'disabled',
            'type': 'checkbox',
            'value': 1,
        })
    })

    it('should return the value of the specified attribute', () => {
        const result = getAtts(mockElement, 'data-id')
        expect(result).toBe(123)
    })

    it('should parse numeric string values', () => {
        const result = getAtts(mockElement, 'data-id')
        expect(result).toBe(123)
    })

    it('should parse boolean string values', () => {
        const result = getAtts(mockElement, 'data-value')
        expect(result).toBe(true)
    })

    it('should return undefined if the specified attribute does not exist', () => {
        const result = getAtts(mockElement, 'data-name')
        expect(result).toBeUndefined()
    })

    it('should return attribute name strings if the specified boolean attribute exists', () => {
        const result = getAtts(mockInputElement, 'disabled')
        expect(result).toBe('disabled')
    })

    it('should handle as empty string values if specified non-boolean attribute', () => {
        const result = getAtts(mockInputElement, 'data-custom')
        expect(result).toBe('')
    })

})

describe('setAtts', () => {

    it('sets attributes on a single element', () => {
        const element = document.createElement('div')
        const attributes = { 'class': 'test-class', 'data-id': '123' }

        setAtts(element, attributes)

        expect(element.getAttribute('class')).toBe('test-class')
        expect(element.getAttribute('data-id')).toBe('123')
    })

    it('sets attributes on an array of elements', () => {
        const element1 = document.createElement('div')
        const element2 = document.createElement('span')
        const elements = [element1, element2]

        const attributes = { 'class': 'test-class', 'data-id': '123' }

        setAtts(elements, attributes)

        elements.forEach(element => {
            expect(element.getAttribute('class')).toBe('test-class')
            expect(element.getAttribute('data-id')).toBe('123')
        })
    })

    it('should be not set the numeric attribute names', () => {
        const element = document.createElement('div')
        const attributes = { 0: 'test-0', '1': 'test-1' }

        setAtts(element, attributes)

        expect(element.getAttribute('0')).toBeNull()
        expect(element.getAttribute('1')).toBeNull()
    })

    it('should handle boolean attributes as same other attributes', () => {
        const element = document.createElement('input')
        const attributes = { type: 'checkbox', value: '', checked: 'true', readonly: 'false', disabled: 'null', hidden: 'undefined' }

        setAtts(element, attributes)

        expect(element.getAttribute('type')).toBe('checkbox')
        expect(element.getAttribute('value')).toBe('')
        expect(element.getAttribute('checked')).toBe('true')
        expect(element.getAttribute('readonly')).toBe('false')
        expect(element.getAttribute('disabled')).toBe('null')
        expect(element.getAttribute('hidden')).toBe('undefined')
    })

})

describe('removeAtts', () => {

    it('removes a single attribute from a single element', () => {
        // Create a mock element
        const element = document.createElement('div')
        element.setAttribute('data-test', 'value')

        // Remove the attribute
        removeAtts(element, 'data-test')

        // Expect the attribute to be removed
        expect(element.hasAttribute('data-test')).toBe(false)
    })

    it('removes multiple attributes from a single element', () => {
        // Create a mock element
        const element = document.createElement('div')
        element.setAttribute('data-test1', 'value1')
        element.setAttribute('data-test2', 'value2')

        // Remove the attributes
        removeAtts(element, ['data-test1', 'data-test2'])

        // Expect the attributes to be removed
        expect(element.hasAttribute('data-test1')).toBe(false)
        expect(element.hasAttribute('data-test2')).toBe(false)
    })

    it('removes a single attribute from multiple elements', () => {
        // Create mock elements
        const element1 = document.createElement('div')
        const element2 = document.createElement('div')
        element1.setAttribute('data-test', 'value')
        element2.setAttribute('data-test', 'value')

        // Remove the attribute from multiple elements
        removeAtts([element1, element2], 'data-test')

        // Expect the attribute to be removed from both elements
        expect(element1.hasAttribute('data-test')).toBe(false)
        expect(element2.hasAttribute('data-test')).toBe(false)
    })

    it('removes multiple attributes from multiple elements', () => {
        // Create mock elements
        const element1 = document.createElement('div')
        const element2 = document.createElement('div')
        element1.setAttribute('data-test1', 'value1')
        element1.setAttribute('data-test2', 'value2')
        element2.setAttribute('data-test1', 'value1')
        element2.setAttribute('data-test2', 'value2')

        // Remove the attributes from multiple elements
        removeAtts([element1, element2], ['data-test1', 'data-test2'])

        // Expect the attributes to be removed from both elements
        expect(element1.hasAttribute('data-test1')).toBe(false)
        expect(element1.hasAttribute('data-test2')).toBe(false)
        expect(element2.hasAttribute('data-test1')).toBe(false)
        expect(element2.hasAttribute('data-test2')).toBe(false)
    })

})

describe('setStyles', () => {

    it('applies CSS styles to a single element', () => {
        // Create a mock element
        const mockElement = document.createElement('div')

        // Apply styles using setStyles function
        setStyles(mockElement, { color: 'red', fontSize: '16px' })

        // Check if styles are applied correctly
        expect(mockElement.style.color).toBe('red')
        expect(mockElement.style.fontSize).toBe('16px')
    })

    it('applies CSS styles to an array of elements', () => {
        // Create mock elements
        const mockElements = [
            document.createElement('div'),
            document.createElement('span'),
            document.createElement('p')
        ]

        // Apply styles using setStyles function
        setStyles(mockElements, 'color: blue; font-weight: bold;')

        // Check if styles are applied correctly to all elements
        mockElements.forEach(elm => {
            expect(elm.style.color).toBe('blue')
            expect(elm.style.fontWeight).toBe('bold')
        })
    })

})

describe('setContent', () => {

    const window = new Window({
        url: 'https://localhost:8080',
        height: 1080,
        width: 1920,
        settings: {
            navigator: {
                userAgent: 'Mozilla/5.0 (X11; Linux x64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/2.0.0'
            }
        }
    })
    global.document = window.document as unknown as Document

    beforeEach(() => {
        // Set up a div element with an ID for testing
        document.body.innerHTML = `<div id="testDiv"></div><div id="testElement"></div>`
        //console.log(document.body.innerHTML)
    })

    it('injects content as text into the specified element', () => {
        // Call setContent with text content
        setContent('testDiv', 'Hello, world!', true)

        // Check if the content is injected correctly
        const targetElement = document.getElementById('testDiv')!
        expect(targetElement.textContent).toBe('Hello, world!')
    })

    it('injects content as HTML into the specified element', () => {
        // Call setContent with HTML content
        setContent('testDiv', '<strong>Hello, world!</strong>', false)

        // Check if the content is injected correctly
        const targetElement = document.getElementById('testDiv')!
        expect(targetElement.innerHTML).toBe('<strong>Hello, world!</strong>')
    })

    it('injects content as text into the specified HTMLElement', () => {
        // Create a div element for testing
        const divElement = document.createElement('div')
        divElement.id = 'newDiv'
        document.body.appendChild(divElement)

        // Call setContent with text content and HTMLElement
        setContent(divElement as unknown as HTMLDivElement, 'Hello, world!', true)

        // Check if the content is injected correctly
        expect(divElement.textContent).toBe('Hello, world!')
    })

    it('injects content as HTML into the specified HTMLElement', () => {
        // Create a div element for testing
        const divElement = document.createElement('div')
        divElement.id = 'newDiv'
        document.body.appendChild(divElement)

        // Call setContent with HTML content and HTMLElement
        setContent(divElement, '<strong>Hello, world!</strong>', false)

        // Check if the content is injected correctly
        expect(divElement.innerHTML).toBe('<strong>Hello, world!</strong>')
    })

    it('injects content as text with 3rd argument omitted', () => {
        const targetElement = document.getElementById('testElement')!
        setContent(targetElement, 'Test Content')
        expect(targetElement.textContent).toBe('Test Content')
    })

    it('injects content as text by using element id specified with 3rd argument omitted', () => {
        setContent('testElement', 'Test Content')
        const targetElement = document.getElementById('testElement')!
        expect(targetElement.textContent).toBe('Test Content')
    })

    it('injects content as HTML into an element that does not exists', () => {
        const targetElement = document.getElementById('notExistsElement')!
        expect(setContent(targetElement, '<p>Test Content</p>', false)).toBe(undefined)
        expect(targetElement?.innerHTML).toBe(undefined)
    })

    it('injects content by default into an element ID that does not exists', () => {
        expect(setContent('notExistsElement', 'Test Content')).toBe(undefined)
        const targetElement = document.getElementById('notExistsElement')!
        expect(targetElement?.textContent).toBe(undefined)
    })

})

describe('strToNode', () => {

    it('parses a string into a DOM node', () => {
        const str = '<div>Hello, world!</div>'
        const node = strToNode(str)
        expect(node instanceof Node).toBe(true)
        expect(node.nodeName).toBe('DIV')
        expect(node.textContent).toBe('Hello, world!')
    })

})

describe('replaceTagName', () => {

    const window = new Window({
        url: 'https://localhost:8080',
        height: 1080,
        width: 1920,
        settings: {
            navigator: {
                userAgent: 'Mozilla/5.0 (X11; Linux x64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/2.0.0'
            }
        }
    })
    global.document = window.document as unknown as Document

    beforeEach(() => {
        // Set up a div element with an ID for testing
        document.body.innerHTML = `<div id="testDiv"></div><div id="testElement" class="test-class" readonly></div>`
        //console.log(document.body.innerHTML)
    })

    it('replaces the tag name of the element', () => {
        const element = document.getElementById('testElement')!
        element.setAttribute('class', 'test-class')
        element.textContent = 'Test content'

        const replacement = replaceTagName(element, 'span')!

        expect(replacement.tagName).toBe('SPAN')
        expect(replacement.getAttribute('id')).toBe('testElement')
        expect(replacement.getAttribute('class')).toBe('test-class')
        expect(replacement.getAttribute('readonly')).toBeNull()
        expect(replacement.textContent).toBe('Test content')
    })

    it('returns the undefined if the target element does not exist', () => {
        const result = replaceTagName(document.getElementById('notExistsElement')!, 'span')
        expect(result).toBeUndefined()
    })

    it('returns the undefined if the target element does not an HTMLElement', () => {
        const result = replaceTagName({} as HTMLElement, 'span')!
        expect(result).toBeUndefined()
    })

})

describe('replaceAttribute', () => {
    let element: HTMLElement

    beforeEach(() => {
        // Create new element every test.
        element = document.createElement('div')
        element.setAttribute('data-original', 'original value')
    })

    it('replaces the specified attribute with a new one and returns the previous value', () => {
        const prevAttr = replaceAttribute(element, 'data-original', 'data-replacement')

        // Check if new attributes were added and old attributes removed.
        expect(element.getAttribute('data-replacement')).toBe('original value')
        expect(element.getAttribute('data-original')).toBeNull()

        // Check if the method returns the correct previous attribute value.
        expect(prevAttr).toEqual({ 'data-original': 'original value' })
    })

    it('returns an empty object if the element is not an HTMLElement or the attribute does not exist', () => {
        // Call by passing a different element type.
        const prevAttr1 = replaceAttribute(null as any, 'data-original', 'data-replacement')
        
        // Call if attribute does not exist.
        const prevAttr2 = replaceAttribute(element, 'non-existent', 'data-replacement')

        expect(prevAttr1).toBeUndefined()
        expect(prevAttr2).toBeUndefined()
    })

})

describe('wrapChildNodes', () => {
    let parentElement: HTMLElement

    beforeEach(() => {
        // Create a new parent element for each test.
        parentElement = document.createElement('div')
    })

    it('should wrap text nodes and element nodes with the specified wrapper tag', () => {
        parentElement.innerHTML = 'Text node<p>Paragraph</p><span>Span</span>'

        wrapChildNodes(parentElement, 'div')

        expect(parentElement.children.length).toBe(3)
        expect(parentElement.children[0].tagName).toBe('DIV')
        expect(parentElement.children[0].textContent).toBe('Text node')
        expect(parentElement.children[1].tagName).toBe('DIV')
        expect(parentElement.children[1].innerHTML).toBe('<p>Paragraph</p>')
        expect(parentElement.children[2].tagName).toBe('DIV')
        expect(parentElement.children[2].innerHTML).toBe('<span>Span</span>')
    })

    it('should handle empty parent element', () => {
        wrapChildNodes(parentElement, 'div')
        expect(parentElement.children.length).toBe(0)
    })

    it('should handle parent element with only text nodes', () => {
        parentElement.innerHTML = 'Text node 1 Text node 2'

        wrapChildNodes(parentElement, 'span')

        expect(parentElement.children.length).toBe(1)
        expect(parentElement.children[0].tagName).toBe('SPAN')
        expect(parentElement.children[0].textContent).toBe('Text node 1 Text node 2')
    })

    it('should handle parent element with only element nodes', () => {
        parentElement.innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p>'

        wrapChildNodes(parentElement, 'div')

        expect(parentElement.children.length).toBe(2)
        expect(parentElement.children[0].tagName).toBe('DIV')
        expect(parentElement.children[0].innerHTML).toBe('<p>Paragraph 1</p>')
        expect(parentElement.children[1].tagName).toBe('DIV')
        expect(parentElement.children[1].innerHTML).toBe('<p>Paragraph 2</p>')
    })

    it('should not change the wrapper tag if it is empty', () => {
        parentElement.innerHTML = 'Text node<p>Paragraph</p><span>Span</span>'

        wrapChildNodes(parentElement, '')

        expect(parentElement.childNodes.length).toBe(3)
        expect(parentElement.childNodes[0].nodeName).toBe('#text')
        expect(parentElement.childNodes[0].nodeValue).toBe('Text node')
        expect(parentElement.childNodes[1].nodeName).toBe('P')
        expect(parentElement.childNodes[2].nodeName).toBe('SPAN')
    })

    it('should preserve the original order of nodes', () => {
        parentElement.innerHTML = '<p>Paragraph 1</p>Text node<span>Span</span>'

        wrapChildNodes(parentElement, 'section')

        expect(parentElement.children.length).toBe(3)
        expect(parentElement.children[0].tagName).toBe('SECTION')
        expect(parentElement.children[0].innerHTML).toBe('<p>Paragraph 1</p>')
        expect(parentElement.children[1].tagName).toBe('SECTION')
        expect(parentElement.children[1].textContent).toBe('Text node')
        expect(parentElement.children[2].tagName).toBe('SECTION')
        expect(parentElement.children[2].innerHTML).toBe('<span>Span</span>')
    })
})

describe('isHidden', () => {
    let element: HTMLElement

    beforeEach(() => {
        // Create new element every test.
        element = document.createElement('div')
        document.body.appendChild(element)
    })

    afterEach(() => {
        // Remove element for testing every test finished.
        document.body.removeChild(element)
    })

    it('returns true if the element is hidden', () => {
        element.style.display = 'none'
        expect(isHidden(element)).toBe(true)
    })

    it('returns true if the element has the "hidden" attribute', () => {
        element.setAttribute('hidden', '')
        expect(isHidden(element)).toBe(true)
    })

    it('returns true if a "visibility" property is "hidden" that the element is hidden', () => {
        element.style.visibility = 'hidden'
        expect(isHidden(element)).toBe(true)
    })

    it('returns true if an "opacity" property is "0" that the element is hidden', () => {
        element.style.opacity = '0'
        expect(isHidden(element)).toBe(true)
    })

    it('returns false if never match the specified properties that the element is hidden', () => {
        element.style.display    = 'block'
        element.style.visibility = 'visible'
        element.style.opacity    = '0'
        expect(isHidden(element, ['display', 'hidden', 'visibility'])).toBe(false)
    })

    it('returns true if any of the specified properties indicate that the element is hidden', () => {
        element.style.display    = 'block'
        element.style.visibility = 'visible'
        element.style.opacity    = '1'
        element.setAttribute('hidden', '')
        expect(isHidden(element, ['display', 'hidden', 'visibility', 'opacity'])).toBe(true)
    })

    it('returns false if the element is not hidden', () => {
        expect(isHidden(element)).toBe(false)
    })

})

describe('hide', () => {
    let element: HTMLElement

    beforeEach(() => {
        // Create new element every test.
        element = document.createElement('div')
        document.body.appendChild(element)
    })

    afterEach(() => {
        // Remove element for testing every test finished.
        document.body.removeChild(element)
    })

    it('hides the specified element by setting its display style to "none"', () => {
        hide(element)

        // Check the style of an element to ensure it is hidden.
        expect(element.style.display).toBe('none')
    })

    it('caches the original style and class attributes', () => {
        element.style.width = '100px'
        element.className = 'test-class'

        hide(element)

        // Check that element styles and class attributes are cached.
        expect(element.getAttribute('data-cached-style')).toBe('width: 100px;')
        expect(element.getAttribute('data-cached-class')).toBe('test-class')
    })

})

describe('show', () => {
    let element: HTMLElement

    beforeEach(() => {
        // Create new element every test.
        element = document.createElement('div')
        element.setAttribute('data-cached-style', 'width: 100px;')
        element.setAttribute('data-cached-class', 'test-class')
        element.style.display = 'none'
        element.className = 'hidden'
        document.body.appendChild(element)
    })

    afterEach(() => {
        // Remove element for testing every test finished.
        document.body.removeChild(element)
    })

    it('shows the previously hidden element by restoring its original style and class attributes', () => {
        show(element)

        // Check that element styles and class attributes are restored.
        expect(element.style.display).not.toBe('none')
        expect(element.style.width).toBe('100px')
        expect(element.className).toContain('test-class')
    })

})

describe('toggleClass', () => {
    let element: HTMLElement

    beforeEach(() => {
        // Create a new div element for each test
        element = document.createElement('div')
        document.body.appendChild(element)
    })

    afterEach(() => {
        // Remove the created div element after each test
        document.body.removeChild(element)
    })

    it('should toggle a single class', () => {
        // Add a class initially
        element.classList.add('test-class')

        // Toggle the class
        toggleClass(element, 'test-class')

        // Expect the class to be removed
        expect(element.classList.contains('test-class')).toBe(false)

        // Toggle again
        toggleClass(element, 'test-class')

        // Expect the class to be added back
        expect(element.classList.contains('test-class')).toBe(true)
    })

    it('should toggle multiple classes', () => {
        // Add multiple classes initially
        element.classList.add('class1', 'class2')

        // Toggle the classes
        toggleClass(element, ['class1', 'class2'])

        // Expect the classes to be removed
        expect(element.classList.contains('class1')).toBe(false)
        expect(element.classList.contains('class2')).toBe(false)

        // Toggle again
        toggleClass(element, ['class1', 'class2'])

        // Expect the classes to be added back
        expect(element.classList.contains('class1')).toBe(true)
        expect(element.classList.contains('class2')).toBe(true)
    })

    it('should toggle classes based on the force parameter', () => {
        // Add a class initially
        element.classList.add('test-class')

        // Toggle with force parameter set to true
        toggleClass(element, 'test-class', true)

        // Expect the class to remain added
        expect(element.classList.contains('test-class')).toBe(true)

        // Toggle with force parameter set to false
        toggleClass(element, 'test-class', false)

        // Expect the class to be removed
        expect(element.classList.contains('test-class')).toBe(false)
    })

    it('should toggle classes based on the boolean value in the object', () => {
        // Add a class initially
        element.classList.add('test-class')

        // Toggle with an object containing class name and boolean value
        toggleClass(element, { 'test-class': false })

        // Expect the class to be removed
        expect(element.classList.contains('test-class')).toBe(false)

        // Toggle again
        toggleClass(element, { 'test-class': true })

        // Expect the class to be added back
        expect(element.classList.contains('test-class')).toBe(true)
    })

    it('should not toggle classes if target element does not exist', () => {
        // Toggle classes on a non-existent element
        const nonExistentElement = null
        toggleClass(nonExistentElement as unknown as HTMLElement, 'test-class')

        // Expect no error to be thrown
        // (Handling of non-existent element is done by not throwing an error)
        expect(true).toBe(true)
    })

    it('should not toggle classes if no class is specified', () => {
        // Toggle classes with no class specified
        toggleClass(element, [])

        // Expect no error to be thrown
        // (Handling of empty classes array is done by not throwing an error)
        expect(true).toBe(true)
    })

})

describe('reflow', () => {

    it('forces reflow on the specified element', async () => {
        // Mock target element
        const targetElement = document.createElement('div')
        document.body.appendChild(targetElement)

        // Call reflow with the target element
        await expect(reflow(targetElement)).resolves.toBe(targetElement)

        // Clean up
        document.body.removeChild(targetElement)
    })

    it('throws error if target element is not valid', async () => {
        // Mock invalid target element
        const targetElement = null

        // Call reflow with the invalid target element
        await expect(reflow(targetElement as unknown as HTMLElement)).rejects.toThrowError('The reflow target is not an element.')
    })

})

describe.skip('watcher', () => {

    // Mock MutationObserver
    class MutationObserverMock {
        callback: MutationCallback
        constructor(callback: MutationCallback) {
            this.callback = callback
        }
        observe(target: Node, config: MutationObserverInit): void {}
    }

    // Mock HTMLElement
    const elementMock = document.createElement('div')
    const elementsArrayMock = [elementMock]

    // Mock callback function
    const callbackMock = vi.fn()

    // Test cases
    it('should observe mutations on the target element', () => {
        const observeSpy = vi.spyOn(MutationObserverMock.prototype, 'observe')

        // Call watcher function
        watcher(elementMock, callbackMock)

        // Assertion
        expect(observeSpy).toHaveBeenCalledWith(elementMock, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        })
    })

    it('should observe mutations on the array of target elements', () => {
        const observeSpy = vi.spyOn(MutationObserverMock.prototype, 'observe')

        // Call watcher function
        watcher(elementsArrayMock, callbackMock)

        // Assertion
        expect(observeSpy).toHaveBeenCalledWith(elementMock, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        })
    })

    it('should execute the callback function for each observed mutation', () => {
        // Mock MutationObserver instance
        const observerMock = new MutationObserverMock(callbackMock)

        // Call watcher function
        watcher(elementMock, callbackMock)

        // Mock mutations
        const mutationsMock = [
            { type: 'attributes' },
            { type: 'childList' }
        ]

        // Fire MutationObserver's callback
        observerMock.callback(mutationsMock)

        // Assertion
        expect(callbackMock).toHaveBeenCalledTimes(mutationsMock.length)
        expect(callbackMock).toHaveBeenCalledWith(mutationsMock[0], observerMock)
        expect(callbackMock).toHaveBeenCalledWith(mutationsMock[1], observerMock)
    })

    it('should log an error message if the target element is not valid', () => {
        // Mock console.error
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        // Call watcher function with an invalid element
        watcher(null, callbackMock)

        // Assertion
        expect(consoleErrorSpy).toHaveBeenCalledWith('Watching target is not an HTML element.')
    })

    it('should do nothing if the callback function is not valid', () => {
        // Call watcher function with an invalid callback
        watcher(elementMock, null)

        // Assertion
        expect(elementMock).toHaveBeenCalled()
    })

})
