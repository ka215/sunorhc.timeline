// DOM event helper methods
// Methods:
// dragScroll, wheelScroll, doAlignment

import { EventNodes, EventNode } from '@/types/definitions'
import { getRect, setContent, setStyles } from './dom'

/**
 * Register event listeners that scroll by dragging when the main canvas of the timeline overflows.
 *  
 * @param {HTMLDivElement} timelineElement - Element containing an instance of the timeline.
 */
export const dragScroll = (timelineElement: HTMLDivElement): void => {
    const scrollableElement: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    // Elements to synchronize with main canvas scrolling.
    const scrollableSidebarElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-sidebar[data-sidebar-overflow="true"]')!)
    //console.log('scrollableSidebarElements:', scrollableSidebarElements)

    // Handle scrolling the based main canvas element.
    if (scrollableElement) {
        let isDown = false
        let startX: number
        let startY: number
        let scrollLeft: number
        let scrollTop: number

        scrollableElement.addEventListener('mousedown', (e: MouseEvent) => {
            isDown = true
            // The added class does not affect the operation, but is assigned for checking the status on the DOM.
            scrollableElement.classList.add('draggable')
            if (scrollableSidebarElements.length > 0) {
                scrollableSidebarElements.forEach(elm => elm.classList.add('draggable'))
            }
            startX = e.pageX - scrollableElement.offsetLeft
            startY = e.pageY - scrollableElement.offsetTop
            scrollLeft = scrollableElement.scrollLeft
            scrollTop = scrollableElement.scrollTop
        })

        scrollableElement.addEventListener('mouseleave', () => {
            isDown = false
            scrollableElement.classList.remove('draggable')
            if (scrollableSidebarElements.length > 0) {
                scrollableSidebarElements.forEach(elm => elm.classList.remove('draggable'))
            }
        })

        scrollableElement.addEventListener('mouseup', () => {
            isDown = false
            scrollableElement.classList.remove('draggable')
            if (scrollableSidebarElements.length > 0) {
                scrollableSidebarElements.forEach(elm => elm.classList.remove('draggable'))
            }
        })

        scrollableElement.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isDown) return
            e.preventDefault()
            const x = e.pageX - scrollableElement.offsetLeft
            const y = e.pageY - scrollableElement.offsetTop
            const walkX = x - startX
            const walkY = y - startY
            scrollableElement.scrollLeft = scrollLeft - walkX
            //console.log('dragScrolling:', scrollableElement, scrollableSidebarElements)
            // Scroll synchronization of sidebar elements is vertical only.
            if (scrollableSidebarElements.length > 0) {
                scrollableElement.scrollTop = scrollTop - walkY
                scrollableSidebarElements.forEach(elm => elm.scrollTop = scrollTop - walkY)
            }
        })
    }
}

/**
 * Register event listeners that scroll by mouse wheeling with sync main canvas when the sidebar of the timeline overflows.
 * 
 * @param {HTMLDivElement} timelineElement - Element containing an instance of the timeline.
 */
export const wheelScroll = (timelineElement: HTMLDivElement): void => {
    const wheelableBaseElement: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    // Elements to synchronize with main canvas wheel scrolling.
    const wheelableSidebarElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-sidebar[data-sidebar-overflow="true"]')!)
    const wheelableElements: HTMLDivElement[] = [wheelableBaseElement, ...wheelableSidebarElements]
    //console.log('Called wheelScroll', wheelableElements)

    const toggleWheelableClass = (isEnable: boolean): void => {
        wheelableElements.forEach(elm => {
            if (isEnable) {
                elm.classList.add('wheelable')
            } else {
                elm.classList.remove('wheelable')
            }
        })
    }

    // Handle wheel scrolling the based main canvas element.
    if (wheelableBaseElement) {
        let isFocused = false

        wheelableElements.forEach(elm => {
            elm.addEventListener('mouseenter', (e: MouseEvent) => {
                isFocused = true
                toggleWheelableClass(isFocused)
            })

            elm.addEventListener('mouseleave', (e: MouseEvent) => {
                isFocused = false
                toggleWheelableClass(isFocused)
            })

            elm.addEventListener('wheel', (e: WheelEvent) => {
                if (!isFocused) return
                e.preventDefault()
                Array.from(timelineElement.querySelectorAll('.wheelable')!).forEach(elm => {
                    if (elm instanceof HTMLElement) {
                        //console.log('Do wheel scrolling!', elm.outerHTML)
                        elm.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'smooth' })
                    }
                })
            })
        })

    }
}

/**
 * Event handler to move the horizontal position of the main canvas of the timeline to the specified position.
 * 
 * @param {HTMLDivElement} timelineElement - Element containing an instance of the timeline.
 * @param {Alignment} position 
 */
export const doAlignment = (timelineElement: HTMLDivElement, position: string | number): void => {
    // type Alignment = number | 'left' | 'begin' | 'center' | 'right' | 'end' | 'current' | 'currently' | 'latest';
    if (!timelineElement || !/^(\d+|left|begin|center|right|end|current(|ly)|latest)$/.test(String(position))) {
        return
    }
    // `fullWidth` must be the entire scrollable width of the target element.
    const fullWidth = (timelineElement.querySelector('.sunorhc-timeline-nodes')! as HTMLDivElement).scrollWidth
    const targetElement: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    // `visibleWidth` is the visible layout width of the target element.
    // This is an "offsetWidth", so this value includes the element's width, padding, border, and vertical scrollbar (if present).
    const visibleWidth = targetElement.offsetWidth
    console.log('Called doAlignment:', position, fullWidth, visibleWidth)

    switch(position) {
        case 'left':
        case 'begin':
            // Align to the starting point (left edge) of the ruler.
            break
        case 'center':
            // Align with the center of the ruler.
            if (targetElement.scrollLeft > 0) {
                // Initialize scroll start position. (for the Mozilla browser etc.)
                targetElement.scrollTo({ left: 0 })
            }
            const toLeft = Math.abs((visibleWidth / 2) - (fullWidth / 2))
            targetElement.scrollBy({ top: 0, left: toLeft, behavior: 'smooth' })
            break
        case 'right':
        case 'end':
            // Align to the ending point (right edge) of the ruler.
            break
        case 'current':
        case 'currently':
            // Centers that point of the ruler when contains the current datetime.
            break
        case 'latest':
            // Place focus on the most recent event node.
            break
        default:
            // Places focus on the event node with the specified event ID.
            break
    }
}

/**
 * Register the event listeners to display a tooltip on mouseover on an event node.
 * 
 * @param {HTMLDivElement} timelineElement 
 * @param {EventNodes} eventNodes 
 */
export const onHoverTooltip = (timelineElement: HTMLDivElement, eventNodes: EventNodes): void => {
    let isShownTooltip = false
    const fragment: DocumentFragment = document.createDocumentFragment()
    const timelineMainCanvas: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    //const eventNodesCanvas: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-nodes')!
    const eventNodeElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-event-node')!)
    const containerRect = getRect(timelineMainCanvas) as DOMRect
    eventNodeElements.forEach((eventNode: HTMLDivElement) => {
        eventNode.addEventListener('mouseleave', (e: MouseEvent) => {
            const selfElement = e.target! as HTMLDivElement
            const tooltipElement = selfElement.querySelector('.tooltip')! as HTMLDivElement
            if (tooltipElement) {
                selfElement.removeChild(tooltipElement)
            }
            isShownTooltip = false
        })
        eventNode.addEventListener('mouseover', (e: MouseEvent) => {
            if (isShownTooltip) return
            e.preventDefault()
            const selfElement = e.target! as HTMLDivElement
            const eventId = selfElement.dataset!.eventId
            const matchedEventNodes = (eventNodes as EventNode[]).filter((item: any) => item.eventId === eventId)
            if (matchedEventNodes.length > 0) {
                const eventNode = matchedEventNodes.shift()!
                const eventNodeElementRect = getRect(selfElement) as DOMRect
                const tooltipElement = document.createElement('div')
                tooltipElement.classList.add('tooltip')
                setStyles(tooltipElement, { top: `${(eventNodeElementRect.height / -2)}px`, left: `${(eventNodeElementRect.width / -2)}px` })
                // <li>StartBaseX: ${eventNode.extends?.startBaseX ?? 'Undefined'}, EndBaseX: ${eventNode.extends?.endBaseX ?? 'Undefined'}</li>\
                setContent(tooltipElement, `<ul>\
                <li>${eventNode.start} ～ ${eventNode.end || 'Undefined'}<li>\
                <li>X: ${eventNode.x}, Width:&nbsp; ${eventNode.w || 'Undefined'}</li>\
                <li>Y: ${eventNode.y}, Height: ${eventNode.h || 'Undefined'}</li>\
                <li>EventId: <span style="color:#f87171;font-weight:600;">${eventNode.eventId}</span></li>\
                <li>${eventNode.label || 'Untitled'}</li>\
                </ul>`, false)
                fragment.append(tooltipElement)
                selfElement.append(fragment)
                const tooltipRect = getRect(tooltipElement) as DOMRect
                let tooltipX = (tooltipRect.width - eventNodeElementRect.width) / -2
                if (eventNode.x! < 0) {
                    if (eventNode.w! + eventNode.x! > timelineMainCanvas.offsetWidth) {
                        tooltipX = (e.pageX + containerRect.left + timelineMainCanvas.scrollLeft) / 2 - eventNode.x!
                    } else {
                        tooltipX = eventNodeElementRect.width - ((tooltipRect.width - e.pageX) / -2)
                    }
                }
                let tooltipY = eventNode.h || eventNodeElementRect.height
                //console.log('onHoverTooltip::X:', tooltipX, eventNode.x, eventNode.w, eventNodeElementRect.x, eventNodeElementRect.width, tooltipRect.x, mouseX, mouseY, timelineMainCanvas.offsetWidth, tooltipX)
                //console.log('onHoverTooltip::Y:', tooltipY, eventNode.y, eventNode.h, eventNodeElementRect.y, eventNodeElementRect.height, tooltipRect.y, tooltipRect.height)
                //console.log('onHoverTooltip:', eventNode, canvasRect, eventNodeElementRect, tooltipRect, tooltipX, tooltipY, e.pageX, e.pageY, eventNode.x!)
                setStyles(tooltipElement, `--tooltip-y: ${tooltipY}px; --tooltip-x: ${tooltipX}px;`)
                //await Promise.resolve(setStyles(tooltipElement, `--tooltip-y: ${tooltipY}px; --tooltip-x: ${tooltipX}px;`))
                //.then(() => {
                    tooltipElement.classList.add('shown')
                    isShownTooltip = true
                //})
            }
        })
    })
}
