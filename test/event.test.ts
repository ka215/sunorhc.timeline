import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { dragScroll, wheelScroll, doAlignment } from '../src/utils/event'
import { Window } from 'happy-dom'

describe('dragScroll', () => {
  let timelineElement: HTMLDivElement
  let scrollableElement: HTMLDivElement
  let sidebarElement1: HTMLDivElement
  let sidebarElement2: HTMLDivElement

  beforeEach(() => {
    timelineElement = document.createElement('div')
    
    scrollableElement = document.createElement('div')
    scrollableElement.classList.add('sunorhc-timeline-main-canvas')
    
    sidebarElement1 = document.createElement('div')
    sidebarElement1.classList.add('sunorhc-timeline-sidebar')
    sidebarElement1.dataset.sidebarOverflow = 'true'
    
    sidebarElement2 = document.createElement('div')
    sidebarElement2.classList.add('sunorhc-timeline-sidebar')
    sidebarElement2.dataset.sidebarOverflow = 'true'
    
    timelineElement.append(scrollableElement, sidebarElement1, sidebarElement2)
    
    document.body.appendChild(timelineElement)
    
    dragScroll(timelineElement)
  })

  afterEach(() => {
    document.body.removeChild(timelineElement)
  })

  it('should register mousedown event listener', () => {
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true })
    scrollableElement.dispatchEvent(mousedownEvent)
    expect(scrollableElement.classList.contains('draggable')).toBe(true)
  })

  it('should register mouseup event listener', () => {
    scrollableElement.classList.add('draggable')
    const mouseupEvent = new MouseEvent('mouseup', { bubbles: true })
    scrollableElement.dispatchEvent(mouseupEvent)
    expect(scrollableElement.classList.contains('draggable')).toBe(false)
  })

  it('should register mouseleave event listener', () => {
    scrollableElement.classList.add('draggable')
    const mouseleaveEvent = new MouseEvent('mouseleave', { bubbles: true })
    scrollableElement.dispatchEvent(mouseleaveEvent)
    expect(scrollableElement.classList.contains('draggable')).toBe(false)
  })

  it('should register mousemove event listener and scroll correctly', () => {
    const initialScrollLeft = 100
    const initialScrollTop = 100
    scrollableElement.scrollLeft = initialScrollLeft
    scrollableElement.scrollTop = initialScrollTop
    
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true});
    (mousedownEvent as any).pageX = 200;
    (mousedownEvent as any).pageY = 200
    scrollableElement.dispatchEvent(mousedownEvent)
    
    const mousemoveEvent = new MouseEvent('mousemove', { bubbles: true});
    (mousemoveEvent as any).pageX = 220;
    (mousemoveEvent as any).pageY = 220
    scrollableElement.dispatchEvent(mousemoveEvent)
    
    expect(scrollableElement.scrollLeft).toBe(initialScrollLeft - 20)
    expect(scrollableElement.scrollTop).toBe(initialScrollTop - 20)
    expect(sidebarElement1.scrollTop).toBe(initialScrollTop - 20)
    expect(sidebarElement2.scrollTop).toBe(initialScrollTop - 20)
  })

  it('should handle sidebar elements scrolling correctly', () => {
    sidebarElement1.scrollTop = 100
    sidebarElement2.scrollTop = 100
    
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true});
    (mousedownEvent as any).pageX = 200;
    (mousedownEvent as any).pageY = 200
    scrollableElement.dispatchEvent(mousedownEvent)
    
    const mousemoveEvent = new MouseEvent('mousemove', { bubbles: true});
    (mousemoveEvent as any).pageX = 220;
    (mousemoveEvent as any).pageY = 220
    scrollableElement.dispatchEvent(mousemoveEvent)
    
    expect(sidebarElement1.scrollTop).toBe(-20)
    expect(sidebarElement2.scrollTop).toBe(-20)
  })
})

describe('wheelScroll', () => {
  let timelineElement: HTMLDivElement
  let mainCanvas: HTMLDivElement
  let sidebar1: HTMLDivElement
  let sidebar2: HTMLDivElement

  beforeEach(() => {
    timelineElement = document.createElement('div')
    
    mainCanvas = document.createElement('div')
    mainCanvas.classList.add('sunorhc-timeline-main-canvas')
    
    sidebar1 = document.createElement('div')
    sidebar1.classList.add('sunorhc-timeline-sidebar')
    sidebar1.dataset.sidebarOverflow = 'true'
    
    sidebar2 = document.createElement('div')
    sidebar2.classList.add('sunorhc-timeline-sidebar')
    sidebar2.dataset.sidebarOverflow = 'true'
    
    timelineElement.append(mainCanvas, sidebar1, sidebar2)
    document.body.appendChild(timelineElement)

    // Mock scrollBy method
    // Note: "scrollBy" is not supported in the node environment or some browsers such as IE11, so it must be mocked.
    const originalScrollBy = HTMLDivElement.prototype.scrollBy
    HTMLDivElement.prototype.scrollBy = function (options?: ScrollToOptions | number, y?: number): void {
        if (typeof options === 'number') {
            this.scrollLeft += options
            if (y !== undefined) this.scrollTop += y
        } else if (options) {
            if (options.left !== undefined) this.scrollLeft += options.left
            if (options.top !== undefined) this.scrollTop += options.top
        }
    }
    
    wheelScroll(timelineElement);

    // Store original scrollBy method to restore it later
    (mainCanvas as any).originalScrollBy = originalScrollBy
  })

  afterEach(() => {
    document.body.removeChild(timelineElement)
    // Restore the original scrollBy method
    if (mainCanvas && (mainCanvas as any).originalScrollBy) {
        HTMLDivElement.prototype.scrollBy = (mainCanvas as any).originalScrollBy
    }
  })

  it('should add wheelable class on mouse enter and remove on mouse leave', () => {
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
    mainCanvas.dispatchEvent(mouseEnterEvent)
    expect(mainCanvas.classList.contains('wheelable')).toBe(true)
    expect(sidebar1.classList.contains('wheelable')).toBe(true)
    expect(sidebar2.classList.contains('wheelable')).toBe(true)

    const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
    mainCanvas.dispatchEvent(mouseLeaveEvent)
    expect(mainCanvas.classList.contains('wheelable')).toBe(false)
    expect(sidebar1.classList.contains('wheelable')).toBe(false)
    expect(sidebar2.classList.contains('wheelable')).toBe(false)
  })

  it('should handle wheel event and scroll correctly', () => {
    const initialScrollLeft = 100
    const initialScrollTop = 100
    
    mainCanvas.scrollLeft = initialScrollLeft
    mainCanvas.scrollTop = initialScrollTop
    sidebar1.scrollTop = initialScrollTop
    sidebar2.scrollTop = initialScrollTop
    
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
    mainCanvas.dispatchEvent(mouseEnterEvent)
    
    const wheelEvent = new WheelEvent('wheel', { bubbles: true });
    (wheelEvent as any).deltaX = 20;
    (wheelEvent as any).deltaY = 20
    mainCanvas.dispatchEvent(wheelEvent)
    
    expect(mainCanvas.scrollLeft).toBe(initialScrollLeft + 20)
    expect(mainCanvas.scrollTop).toBe(initialScrollTop + 20)
    expect(sidebar1.scrollTop).toBe(initialScrollTop + 20)
    expect(sidebar2.scrollTop).toBe(initialScrollTop + 20)
  })

  it('should not scroll if not focused', () => {
    const initialScrollLeft = 100
    const initialScrollTop = 100

    mainCanvas.scrollLeft = initialScrollLeft
    mainCanvas.scrollTop = initialScrollTop
    sidebar1.scrollTop = initialScrollTop
    sidebar2.scrollTop = initialScrollTop

    const wheelEvent = new WheelEvent('wheel', { bubbles: true });
    (wheelEvent as any).deltaX = 20;
    (wheelEvent as any).deltaY = 20
    mainCanvas.dispatchEvent(wheelEvent)

    expect(mainCanvas.scrollLeft).toBe(initialScrollLeft)
    expect(mainCanvas.scrollTop).toBe(initialScrollTop)
    expect(sidebar1.scrollTop).toBe(initialScrollTop)
    expect(sidebar2.scrollTop).toBe(initialScrollTop)
  })

  it('should scroll all wheelable elements synchronously', () => {
    const initialScrollTop = 100
    mainCanvas.scrollTop = initialScrollTop
    sidebar1.scrollTop = initialScrollTop
    sidebar2.scrollTop = initialScrollTop

    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
    mainCanvas.dispatchEvent(mouseEnterEvent)

    const wheelEvent = new WheelEvent('wheel', { bubbles: true });
    (wheelEvent as any).deltaY = 30;
    mainCanvas.dispatchEvent(wheelEvent)

    expect(mainCanvas.scrollTop).toBe(initialScrollTop + 30)
    expect(sidebar1.scrollTop).toBe(initialScrollTop + 30)
    expect(sidebar2.scrollTop).toBe(initialScrollTop + 30)
  })
})

describe('doAlignment', () => {
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

  let timelineElement: any//HTMLDivElement
  let mainCanvas: any//HTMLDivElement
  let nodes: any//HTMLDivElement
  let originalScrollTo: any
  let originalScrollBy: any

  beforeEach(() => {
    timelineElement = document.createElement('div') as unknown as Node
    
    nodes = document.createElement('div') as unknown as Node
    nodes.classList.add('sunorhc-timeline-nodes')
    nodes.style.width = '2000px' // Example width, adjust as needed
    
    mainCanvas = document.createElement('div') as unknown as Node
    mainCanvas.classList.add('sunorhc-timeline-main-canvas')
    mainCanvas.style.width = '1000px' // Example visible width, adjust as needed
    mainCanvas.style.overflow = 'scroll' // Ensure it is scrollable
    mainCanvas.appendChild(nodes)

    timelineElement.appendChild(mainCanvas)
    document.body.appendChild(timelineElement)

    //console.log('fullWidth:', nodes.scrollWidth, 'visibleWidth:', mainCanvas.offsetWidth)

    // Mock scrollTo and scrollBy methods
    // Note: "scrollTo" and "scrollBy" is not supported in the node environment or some browsers such as IE11, so it must be mocked.
    originalScrollTo = HTMLDivElement.prototype.scrollTo
    HTMLDivElement.prototype.scrollTo = function (options?: ScrollToOptions | number, y?: number): void {
        if (typeof options === 'number') {
            this.scrollLeft += options
            if (y !== undefined) this.scrollTop += y
        } else if (options) {
            if (options.left !== undefined) this.scrollLeft += options.left
            if (options.top !== undefined) this.scrollTop += options.top
        }
    }
    originalScrollBy = HTMLDivElement.prototype.scrollBy
    HTMLDivElement.prototype.scrollBy = function (options?: ScrollToOptions | number, y?: number): void {
        console.log('scrollBy:', options, y)
        if (typeof options === 'number') {
            this.scrollLeft += options
            if (y !== undefined) this.scrollTop += y
        } else if (options) {
            if (options.left !== undefined) this.scrollLeft += options.left
            if (options.top !== undefined) this.scrollTop += options.top
        }
    }
  })

  afterEach(() => {
    document.body.removeChild(timelineElement)
    // Restore the original scrollTo method
    if (mainCanvas && (mainCanvas as any).originalScrollTo) {
        HTMLDivElement.prototype.scrollTo = (mainCanvas as any).originalScrollTo
    }
    // Restore the original scrollBy method
    if (mainCanvas && (mainCanvas as any).originalScrollBy) {
        HTMLDivElement.prototype.scrollBy = (mainCanvas as any).originalScrollBy
    }
  })

  it('should align to the center of the timeline', () => {
    const initialScrollTop = mainCanvas.scrollTop

    doAlignment(timelineElement, 'center');

    // Store original scrollBy method to restore it later
    (mainCanvas as any).originalScrollTo = originalScrollTo;
    (mainCanvas as any).originalScrollBy = originalScrollBy;

    expect(mainCanvas.scrollTop).toBe(initialScrollTop)
    expect(mainCanvas.scrollLeft).toBe((nodes.scrollWidth - mainCanvas.offsetWidth) / 2)
  })

  it('should return early for invalid positions', () => {
    const initialScrollLeft = mainCanvas.scrollLeft
    doAlignment(timelineElement, 'invalid')
    expect(mainCanvas.scrollLeft).toBe(initialScrollLeft)
  })

  it('should return early if timelineElement is not provided', () => {
    doAlignment(null as any, 'center') // Suppress type error for testing
    // Expect no error and no action
  })

  it('should align to the left of the timeline', () => {
    // You can add the expected behavior when aligning to 'left' or 'begin'
  })

  it('should align to the right of the timeline', () => {
    // You can add the expected behavior when aligning to 'right' or 'end'
  })

  it('should align to the current datetime', () => {
    // You can add the expected behavior when aligning to 'current' or 'currently'
  })

  it('should align to the latest event node', () => {
    // You can add the expected behavior when aligning to 'latest'
  })

  it('should focus on a specified event node ID', () => {
    // You can add the expected behavior when aligning to a specific event ID
  })
})

