// DOM event helper methods
// Methods:
// dragScroll, wheelScroll, doAlignment, onHoverTooltip, dblclickZoom, clickOpener, 

import { Scale, EventNodes, Action, EventNode, TimelineOptions } from '@/types/definitions'
import { isEmptyObject, isURLOrPath } from './common'
import { getRect, getAtts, setAtts, setContent, setStyles, isElement } from './dom'
import { fetchData } from './files'
import { findEvents, truncateLowerRulerItems, fillTemplate} from './helper'
import { toValidScale, parseDateTime, getStartDatetime, getEndDatetime } from './datetime'

/**
 * Register event listeners that scroll by dragging when the main canvas of the timeline overflows.
 *  
 * @param {HTMLDivElement} timelineElement - Element containing an instance of the timeline.
 */
export const dragScroll = (timelineElement: HTMLDivElement): void => {
    const scrollableElement: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    // Elements to synchronize with main canvas scrolling.
    const scrollableSidebarElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-sidebar[data-sidebar-overflow="true"]')!)

    // Handle scrolling the based main canvas element.
    if (scrollableElement) {
        let isDown = false
        let startX: number
        let startY: number
        let scrollLeft: number
        let scrollTop: number

        const startDragging = (clientX: number, clientY: number) => {
            isDown = true
            // The added class does not affect the operation, but is assigned for checking the status on the DOM.
            scrollableElement.classList.add('draggable')
            if (scrollableSidebarElements.length > 0) {
                scrollableSidebarElements.forEach(elm => elm.classList.add('draggable'))
            }
            startX = clientX - scrollableElement.offsetLeft
            startY = clientY - scrollableElement.offsetTop
            scrollLeft = scrollableElement.scrollLeft
            scrollTop = scrollableElement.scrollTop
        }

        const stopDragging = () => {
            isDown = false
            scrollableElement.classList.remove('draggable')
            if (scrollableSidebarElements.length > 0) {
                scrollableSidebarElements.forEach(elm => elm.classList.remove('draggable'))
            }
        }

        const handleDragging = (clientX: number, clientY: number) => {
            if (!isDown) return
            const x = clientX - scrollableElement.offsetLeft
            const y = clientY - scrollableElement.offsetTop
            const walkX = x - startX
            const walkY = y - startY
            scrollableElement.scrollLeft = scrollLeft - walkX
            //console.log('handleDragging:', scrollableElement, scrollableSidebarElements)
            // Scroll synchronization of sidebar elements is vertical only.
            if (scrollableSidebarElements.length > 0) {
                scrollableElement.scrollTop = scrollTop - walkY
                scrollableSidebarElements.forEach(elm => elm.scrollTop = scrollTop - walkY)
            }
        }

        // Mouse events
        scrollableElement.addEventListener('mousedown', (e: MouseEvent) => {
            startDragging(e.pageX, e.pageY)
        })

        scrollableElement.addEventListener('mouseleave', () => {
            stopDragging()
        })

        scrollableElement.addEventListener('mouseup', () => {
            stopDragging()
        })

        scrollableElement.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isDown) return
            e.preventDefault()
            handleDragging(e.pageX, e.pageY)
        })

        // Touch events
        scrollableElement.addEventListener('touchstart', (e: TouchEvent) => {
            const touch = e.touches[0]
            startDragging(touch.clientX, touch.clientY)
        })

        scrollableElement.addEventListener('touchend', () => {
            stopDragging()
        })

        scrollableElement.addEventListener('touchcancel', () => {
            stopDragging()
        })

        scrollableElement.addEventListener('touchmove', (e: TouchEvent) => {
            if (!isDown) return
            e.preventDefault()
            const touch = e.touches[0]
            handleDragging(touch.clientX, touch.clientY)
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
            elm.addEventListener('mouseenter', () => {
                isFocused = true
                toggleWheelableClass(isFocused)
            })

            elm.addEventListener('mouseleave', () => {
                isFocused = false
                toggleWheelableClass(isFocused)
            })

            elm.addEventListener('wheel', (e: WheelEvent) => {
                if (!isFocused) return
                e.preventDefault()
                Array.from(timelineElement.querySelectorAll('.wheelable')!).forEach(wheelableElm => {
                    if (wheelableElm instanceof HTMLElement) {
                        //console.log('Do wheel scrolling!', elm.outerHTML)
                        wheelableElm.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'smooth' })
                    }
                })
            })

            // Touch events
            let touchStartY: number
            let touchStartX: number

            elm.addEventListener('touchstart', (e: TouchEvent) => {
                const touch = e.touches[0]
                touchStartX = touch.clientX
                touchStartY = touch.clientY
            })

            elm.addEventListener('touchmove', (e: TouchEvent) => {
                if (e.touches.length !== 1) return
                const touch = e.touches[0]
                const touchEndX = touch.clientX
                const touchEndY = touch.clientY
                const deltaX = touchStartX - touchEndX
                const deltaY = touchStartY - touchEndY
                Array.from(timelineElement.querySelectorAll('.wheelable')!).forEach(wheelableElm => {
                    if (wheelableElm instanceof HTMLElement) {
                        wheelableElm.scrollBy({ top: deltaY, left: deltaX, behavior: 'smooth' })
                    }
                })

                touchStartX = touchEndX
                touchStartY = touchEndY
            })

            elm.addEventListener('touchend', () => {
                // Optionally handle touch end if needed
            })

            elm.addEventListener('touchcancel', () => {
                // Optionally handle touch cancel if needed
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
            if (targetElement.scrollLeft > 0) {
                targetElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
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
            if (targetElement.scrollLeft < fullWidth) {
                targetElement.scrollTo({ top: 0, left: fullWidth, behavior: 'smooth' })
            }
            break
        case 'current':
        case 'currently':
            // Centers that point of the ruler when contains the current datetime.
            const currentPositionElement = timelineElement.querySelector('[data-ruler-grain="min"] > [data-item-present-time="true"]') as HTMLElement
            if (currentPositionElement) {
                targetElement.scrollTo({ top: 0, left: currentPositionElement.offsetLeft, behavior: 'smooth' })
                currentPositionElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }))
            }
            break
        case 'latest':
            // Place focus on the most recent event node.
            const latestEvent = findEvents(timelineElement.id, { latest: true })
            if (isElement(latestEvent)) {
                latestEvent.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }))
                targetElement.scrollTo({ top: 0, left: latestEvent.offsetLeft, behavior: 'smooth' })
            }
            break
        default:
            // Places focus on the event node with the specified event ID.
            const targetEvent = findEvents(timelineElement.id, { id: position })
            if (isElement(targetEvent)) {
                targetEvent.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }))
                targetElement.scrollTo({ top: 0, left: targetEvent.offsetLeft, behavior: 'smooth' })
            }
            break
    }
}

/*
export const onStickyRulerItems = (timelineElement: HTMLDivElement): void => {
    const overflowContainer = timelineElement.querySelector('.sunorhc-timeline-main-canvas')! as HTMLDivElement
    if (overflowContainer.offsetWidth > overflowContainer.scrollWidth) {
        return
    }
    const rulerItems = overflowContainer.querySelectorAll('.sunorhc-timeline-ruler-row > li[data-item-colspan]')
    console.log('onStickyRulerItems:', rulerItems, overflowContainer.offsetWidth, overflowContainer.scrollWidth)
    Array.from(rulerItems).forEach((rulerItem) => {
        const stickyRulerItem = rulerItem as HTMLLIElement
        wrapChildNodes(stickyRulerItem, 'span')
        stickyRulerItem.classList.add('sticky-ruler-item')
        setAtts(stickyRulerItem, { 'data-initial-offset-left': stickyRulerItem.offsetLeft.toString() })
    })

    overflowContainer.addEventListener('scroll', () => {
        const scrollLeft = overflowContainer.scrollLeft
        const visibleWidth = overflowContainer.offsetWidth - 2
        Array.from(rulerItems).forEach((rulerItem) => {
            const stickyRulerItem = rulerItem as HTMLLIElement
            const initialOffsetLeft = Number(stickyRulerItem.dataset.initialOffsetLeft)
            const stickyLeft = Math.floor((visibleWidth - (stickyRulerItem.firstChild as HTMLSpanElement)!.offsetWidth) / 2)
            const stickyPosition = Math.max(/*initialOffsetLeft,* / stickyLeft, scrollLeft)
            //stickyRulerItem.style.position = 'relative'
            //stickyRulerItem.style.left = `${stickyPosition}px`
        })
    })
}
*/

/**
 * Register the event listeners to display a tooltip on mouseover on an event node.
 * 
 * @param {HTMLDivElement} timelineElement 
 * @param {TimelineOptions} timelineOptions
 * @param {EventNodes} eventNodes 
 */
export const onHoverTooltip = (timelineElement: HTMLDivElement, timelineOptions: TimelineOptions, eventNodes: EventNodes): void => {
    let isShownTooltip = false
    const fragment: DocumentFragment = document.createDocumentFragment()
    const timelineBody: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-body')!
    const eventNodeElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-event-node')!)
    const tooltipContainer = document.createElement('div')
    tooltipContainer.classList.add('sunorhc-timeline-tooltip-container')
    timelineBody.append(tooltipContainer)

    const hideTooltip = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        const tooltipElement = tooltipContainer.querySelector('.sunorhc-timeline-tooltip')! as HTMLDivElement
        if (tooltipElement) {
            tooltipContainer.removeChild(tooltipElement)
            setStyles(tooltipContainer, { zIndex: '-1' })
        }
        isShownTooltip = false
    }

    const showTooltip = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        let clientX: number, clientY: number // Coordinates relative to the top-left corner of the viewport (browser window).
        let offsetX: number, offsetY: number // The coordinates relative to the top-left corner of the element where the event occurred.
        let pageX: number, pageY: number // Coordinates relative to the top left corner of the entire document, so that the position remains correct even if the page is scrolled.
        let target: HTMLElement
        if (e instanceof MouseEvent) {
            target = e.target as HTMLElement
            clientX = e.clientX
            clientY = e.clientY
            offsetX = e.offsetX
            offsetY = e.offsetY
            pageX = e.pageX
            pageY = e.pageY
        } else if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                const touch = e.touches[0]
                clientX = touch.clientX
                clientY = touch.clientY
                pageX = touch.pageX
                pageY = touch.pageY
                target = touch.target as HTMLElement
                const rect = target.getBoundingClientRect()
                offsetX = touch.clientX - rect.left
                offsetY = touch.clientY - rect.top
            } else {
                return
            }
        }
        const Event = {
            type: e.type,
            clientX: clientX!, clientY: clientY!,
            offsetX: offsetX!, offsetY: offsetY!,
            pageX: pageX!, pageY: pageY!,
            target: target!,
        }
        const tooltipContainerRect = getRect(timelineElement.querySelector('.sunorhc-timeline-tooltip-container')!) as DOMRect
        const scrollLeft = window.scrollX
        const scrollTop = window.scrollY
        const viewArea = {
            left: tooltipContainerRect.left + scrollLeft,
            top: tooltipContainerRect.top + scrollTop,
            right: tooltipContainerRect.right + scrollLeft,
            bottom: tooltipContainerRect.bottom + scrollTop,
        }
        //console.log('showTooltip!!!:', Event, viewArea)

        const selfElement = Event.target as HTMLDivElement
        const eventId = selfElement.dataset!.eventId
        const matchedEventNodes = (eventNodes as EventNode[]).filter((item: any) => item.eventId === eventId)
        if (matchedEventNodes.length > 0) {
            const eventNode = matchedEventNodes.shift()!
            setStyles(tooltipContainer, { zIndex: '80' })
            const tooltipElement = document.createElement('div')
            tooltipElement.classList.add('sunorhc-timeline-tooltip')

            const tooltipTemplate = timelineOptions.effects.hasOwnProperty('template') && timelineOptions.effects.template?.hasOwnProperty('tooltip') 
                ? timelineOptions.effects.template.tooltip as string
                : `<label>%label%</label>`
            setContent(tooltipElement, fillTemplate(tooltipTemplate, eventNode), false)
            tooltipContainer.append(tooltipElement)
            fragment.append(tooltipContainer)
            timelineBody.append(fragment)
            const tooltipRect = getRect(tooltipElement) as DOMRect
            const gapMargin = 12
            let placementClass: string
            let positionStyles: string[]
            if (pageY! - viewArea.top >= viewArea.bottom - pageY!) {
                placementClass = 'top'
                positionStyles = [ `--tooltip-top: ${Math.ceil((pageY! - viewArea.top) - (tooltipRect.height + (gapMargin * 1.5)))}px`, `--tooltip-left: ${Math.ceil((pageX! - viewArea.left) - (tooltipRect.width / 2))}px` ]
            } else {
                placementClass = 'bottom'
                positionStyles = [ `--tooltip-top: ${Math.ceil((pageY! - viewArea.top) + gapMargin)}px`, `--tooltip-left: ${Math.ceil((pageX! - viewArea.left) - (tooltipRect.width / 2))}px` ]
            }
            if (pageX! - viewArea.left < tooltipRect.width / 2) {
                placementClass = 'right'
                positionStyles = [ `--tooltip-top: ${Math.ceil((pageY! - viewArea.top) - (tooltipRect.height / 2))}px`, `--tooltip-left: ${Math.ceil((pageX! - viewArea.left) + (gapMargin * 1.5))}px` ]
            }
            if (viewArea.right - pageX! < tooltipRect.width / 2) {
                placementClass = 'left'
                positionStyles = [ `--tooltip-top: ${Math.ceil((pageY! - viewArea.top) - (tooltipRect.height / 2))}px`, `--tooltip-left: ${Math.ceil((pageX! - viewArea.left) - (tooltipRect.width + (gapMargin * 1.5)))}px` ]
            }
            //console.log('showTooltip!!!::placement:', placementClass, positionStyles)
            tooltipElement.classList.add(placementClass)
            setStyles(tooltipElement, positionStyles.join('; '))
            tooltipElement.classList.add('shown')
            isShownTooltip = true
        }
    }
   
    eventNodeElements.forEach((eventNode: HTMLDivElement) => {
        eventNode.addEventListener('mouseout', (e: MouseEvent) => {
            hideTooltip(e)
        })

        eventNode.addEventListener('mouseover', (e: MouseEvent) => {
            if (isShownTooltip) return
            e.stopPropagation()
            //e.preventDefault()
            showTooltip(e)
        })

        // For touch device
        
        eventNode.addEventListener('touchend', (e: TouchEvent) => {
            hideTooltip(e)
        })

        eventNode.addEventListener('touchstart', (e: TouchEvent) => {
            if (isShownTooltip) return
            e.stopPropagation()
            //e.preventDefault()
            hideTooltip(e)
        })

    })
}

/**
 * zoom the rendering scale by calculating into time from the double-click position on the event node canvas or 
 * ruler in the timeline.
 * This zooming action supports double tap and pinch gestures on touch devices.
 * 
 * @param {HTMLDivElement} timelineElement 
 * @param {TimelineOptions} timelineOptions 
 */
export const dblclickZoom = (timelineElement: HTMLDivElement, timelineOptions: TimelineOptions): void => {
    const zoomableBaseContainer: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    const zoomableElements = [
        ...Array.from(zoomableBaseContainer.querySelectorAll('.sunorhc-timeline-ruler')),
        zoomableBaseContainer.querySelector('.sunorhc-timeline-nodes'),
    ]

    let lastTouchEnd = 0

    const toDateFromOffsetX = (offsetX: number, scale: string): string => {
        const containerElement = zoomableBaseContainer.querySelector('.sunorhc-timeline-nodes')!
        const perX = offsetX / containerElement.clientWidth
        const startDate = getStartDatetime(timelineOptions.start, timelineOptions.timezone, timelineOptions.scale) as Date
        const endDate = getEndDatetime(timelineOptions.end, timelineOptions.timezone, timelineOptions.scale, startDate) as Date
        const parsedStartDate = parseDateTime(startDate, timelineOptions.timezone)
        const parsedEndDate   = parseDateTime(endDate, timelineOptions.timezone)
        const rangeTimes = parsedEndDate!.ts - parsedStartDate!.ts
        const targetTime = (perX * rangeTimes + parsedStartDate!.ts) * 1000
        const baseDate = new Date(targetTime)
        const pad = (num: number, size: number): string => String(num).padStart(size, '0')
        const year = baseDate.getUTCFullYear()
        const month = pad(baseDate.getUTCMonth() + 1, 2)
        const date = pad(baseDate.getUTCDate(), 2)
        const hour = pad(baseDate.getUTCHours(), 2)
        const minute = pad(baseDate.getUTCMinutes(), 2)
        const second = pad(baseDate.getUTCSeconds(), 2)
        const millisecond = pad(baseDate.getUTCMilliseconds(), 3)
        let dateStr: string = ''
        switch(scale) {
            case 'year':
                dateStr = year.toString()
                break
            case 'month':
                dateStr = `${year}-${month}`
                break
            case 'week':
            case 'weekday':
            case 'day':
                dateStr = `${year}-${month}-${date}`
                break
            case 'hour':
                dateStr = `${year}-${month}-${date}T${hour}`
                break
            case 'minute':
                dateStr = `${year}-${month}-${date}T${hour}:${minute}`
                break
            case 'second':
                dateStr = `${year}-${month}-${date}T${hour}:${minute}:${second}`
                break
            case 'millisecond':
                dateStr = `${year}-${month}-${date}T${hour}:${minute}:${second}.${millisecond}`
                break
        }
        return dateStr
    }

    const doZoom = (evt: MouseEvent | TouchEvent, offsetX: number) => {
        const targetElement = evt.target as HTMLElement
        /*
        const clientX = evt.pageX // Absolute X coordinates of the entire visible page.
        const clientY = evt.pageY // Absolute Y coordinates of the entire visible page.
        const offsetX = evt.offsetX // Relative X coordinates on the zoomableBaseContainer element.
        const offsetY = evt.offsetY // Relative Y coordinates on the zoomableBaseContainer element.
        */        
        let newStartDate: string = ''
        let newEndDate: string = 'auto'
        let previousScale: string | boolean = timelineOptions.scale
        let zoomToScale: string = ''
        let newMinGrainWidth = Number(timelineOptions.ruler.minGrainWidth)
        if (targetElement.nodeName === 'LI') {
            // Zoom to the scale range of the ruler item that is double-clicked.
            newStartDate = targetElement.dataset.itemDatetime || ''
            previousScale = toValidScale(targetElement.parentElement?.dataset.rulerType || '')
            if (!previousScale) {
                previousScale = timelineOptions.scale
            }
            //console.log('zoomToScale!!!::', newStartDate, newEndDate, previousScale)
        } else {
            // Zooms to the scale range of the minimum ruler grain to which the X-axis of the double-clicked node canvas belongs.
            newStartDate = toDateFromOffsetX(offsetX, previousScale)
            //console.log('zoomToSetting!!!::', newStartDate, newEndDate, previousScale)
        }
        let matches = null
        let baseDate = null
        let amount = null
        switch(previousScale) {
            case 'year':
                // newStartDate: /^(?<year>\d{1,4})$/
                zoomToScale = 'month'
                newStartDate = `${newStartDate}-01-01T00:00:00.000`
                newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 12)
                break
            case 'month':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})$/
                zoomToScale = 'day'
                matches = /^(?<year>\d{1,4})-(?<month>\d{2})$/.exec(newStartDate)
                if (!!matches && matches.groups) {
                    const { year, month } = matches.groups
                    const oneDay = new Date(new Date(Date.UTC(Number(year), Number(month), 1, 0, 0, 0)).getTime() - 1)
                    const monthDays = oneDay.getUTCDate()
                    //console.log('!!!:', matches, oneDay, monthDays)
                    newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / monthDays)
                    newEndDate = `${newStartDate}-${monthDays}T23:59:59.999`
                } else {
                    newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 30)
                }
                newStartDate = `${newStartDate}-01T00:00:00.000`
                break
            case 'week':
                // newStartDate: /^(?<year>\d{1,4})-(?<week>\d{2})$/
                zoomToScale = 'day'
                matches = /^(?<year>\d{1,4})-(?<week>\d{2})$/.exec(newStartDate)
                if (!!matches && matches.groups) {
                    const { year, week } = matches.groups
                    let weeknumber = 1
                    for (let d = 1; d <= Number(week) * 7; d++) {
                        const oneDay = new Date(Date.UTC(Number(year), 0, d, 0, 0, 0))
                        if (oneDay.getUTCDay() === timelineOptions.ruler.firstDayOfWeek) {
                            weeknumber++
                            if (weeknumber === Number(week)) {
                                newStartDate = oneDay.toISOString().replace(/Z$/, '')
                                newEndDate = `${year}-${String(oneDay.getUTCMonth() + 1).padStart(2, '0')}-${String(oneDay.getUTCDate() + 6).padStart(2, '0')}T23:59:59.999`
                                break
                            }
                        }
                    }
                }
                newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 7)
                break
            case 'weekday':
            case 'day':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2}),(?<weekday>\w{3})$/
                zoomToScale = 'hour'
                baseDate = newStartDate.replace(/(,\w+)$/, '')
                newStartDate = `${baseDate}T00:00:00.000`
                matches = /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(baseDate)
                if (!!matches && matches.groups) {
                    const { year, month, day } = matches.groups
                    amount = Number(day) + 1
                    newEndDate = `${year}-${month.padStart(2, '0')}-${String(amount).padStart(2, '0')}T00:00:00.000`
                }
                newMinGrainWidth = 60// Math.ceil(zoomableBaseContainer.clientWidth / 24)
                break
            case 'hour':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2})$/
                zoomToScale = 'minute'
                baseDate = newStartDate
                newStartDate = `${baseDate}:00:00.000`
                matches = /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2})$/.exec(baseDate)
                if (!!matches && matches.groups) {
                    const { year, month, day, hours } = matches.groups
                    amount = Number(hours) + 1
                    newEndDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${String(amount).padStart(2, '0')}:00:00.000`
                }
                newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 60)
                break
            case 'minute':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<minutes>\d{2})$/
                zoomToScale = 'second'
                baseDate = newStartDate
                newStartDate = `${baseDate}:00.000`
                matches = /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<minutes>\d{2})$/.exec(baseDate)
                if (!!matches && matches.groups) {
                    const { year, month, day, hours, minutes } = matches.groups
                    amount = Number(minutes) + 1
                    newEndDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${String(amount).padStart(2, '0')}:00.000`
                }
                newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 60)
                break
            case 'second':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})$/
                zoomToScale = 'millisecond'
                baseDate = newStartDate
                newStartDate = `${baseDate}.000`
                matches = /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})$/.exec(baseDate)
                if (!!matches && matches.groups) {
                    const { year, month, day, hours, minutes, seconds } = matches.groups
                    amount = Number(seconds) + 1
                    newEndDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${String(amount).padStart(2, '0')}.000`
                }
                newMinGrainWidth = Math.ceil(zoomableBaseContainer.clientWidth / 1000)
                break
            case 'millisecond':
                // newStartDate: /^(?<year>\d{1,4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})\.(?<milliseconds>\d{3})$/
            default:
                // Do not zoom at this scale.
                zoomToScale = timelineOptions.scale
                break
        }
        newStartDate += timelineOptions.timezone === 'UTC' ? 'Z' : ''
        newEndDate += newEndDate !== 'auto' && timelineOptions.timezone === 'UTC' ? 'Z' : ''
        const newRulerOptions = { ...timelineOptions.ruler }
        if (zoomToScale !== 'millisecond') {
            newRulerOptions.minGrainWidth = !!newMinGrainWidth && newMinGrainWidth < 48 ? 48 : newMinGrainWidth
        } else {
            newRulerOptions.minGrainWidth = !!newMinGrainWidth && newMinGrainWidth < 30 ? 30 : newMinGrainWidth
        }
        if (timelineOptions.ruler.hasOwnProperty('truncateLowers') && timelineOptions.ruler.truncateLowers) {
            if (newRulerOptions.hasOwnProperty('top') && newRulerOptions.top!.rows.length > 0) {
                newRulerOptions.top!.rows = truncateLowerRulerItems(zoomToScale as Scale, newRulerOptions.top!.rows)
            }
            if (newRulerOptions.hasOwnProperty('bottom') && newRulerOptions.bottom!.rows.length > 0) {
                newRulerOptions.bottom!.rows = truncateLowerRulerItems(zoomToScale as Scale, newRulerOptions.bottom!.rows)
            }
        }

        const zoomOptions = {
            prevScale: previousScale,
            scale: zoomToScale,
            start: newStartDate,
            end: newEndDate,
            ruler: newRulerOptions,
        }
        //console.log('Before Zoom!!!::', zoomOptions, timelineOptions.ruler)
        if ((window as Window).hasOwnProperty('SunorhcTimelineInstances')) {
            window.SunorhcTimelineInstances[timelineElement.id].zoom(zoomOptions)
        }
    }

    if (timelineOptions.debug && timelineOptions.extends?.zoomScaleTracker) {
        /*
         * We can enable zoom scale tracking in the extended options with debug mode to track the process of converting cursor coordinates 
         * to times in the timeline.
         * Option Settings: { zoomable: true, debug: true, extends: { zoomScaleTracker: true } }
         * Also we should prepare an element to display the track results: `<div class="zoom-scale-coordinates-tracker"></div>`
         */
        zoomableBaseContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-nodes')?.addEventListener('mousemove', (e: MouseEvent) => {
            const trackerElement = timelineElement.querySelector('.zoom-scale-coordinates-tracker')
            if (!trackerElement) {
                return
            }
            let trackerStyles: any = trackerElement.getAttribute('style')
            trackerStyles = trackerStyles?.split(';').map((style: string) => style.trim().replace(/^display\:\s?none$/, 'display: flex'))
            const toDateStr = toDateFromOffsetX(e.offsetX, timelineOptions.scale)
            trackerElement.innerHTML = `<ul>\
            <li><label>offsetX:</label><span style="color: blue;">${e.offsetX}</span>, <label>offsetY:</label><span style="color: blue;">${e.offsetY}</span></li>\
            <li><label>pageX:</label><span style="color: blue;">${e.pageX}</span>, <label>pageY:</label><span style="color: blue;">${e.pageY}</span></li>\
            <li><label>Date:</label> <span style="color: red;">${toDateStr}</span></li>\
            </ul>`
            trackerElement.setAttribute('style', trackerStyles!.join('; '))
        })
    }

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const touchDistance = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY) as number
            (e.target as HTMLElement).dataset.initialTouchDistance = touchDistance.toString()
        }
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            //const touchDistance = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY) as number
            const initialTouchDistance = parseFloat((e.target as HTMLElement).dataset.initialTouchDistance || '0')

            if (initialTouchDistance > 0) {
                const offsetX = (touch1.pageX + touch2.pageX) / 2 - zoomableBaseContainer.getBoundingClientRect().left
                doZoom(e, offsetX)
            }
        }
    }

    const handleDoubleTap = (e: TouchEvent) => {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
            const touch = e.changedTouches[0]
            const offsetX = touch.pageX - zoomableBaseContainer.getBoundingClientRect().left
            doZoom(e, offsetX)
        }
        lastTouchEnd = now
    }

    zoomableBaseContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    zoomableBaseContainer.addEventListener('touchmove', handleTouchMove, { passive: true })
    zoomableBaseContainer.addEventListener('touchend', handleDoubleTap, { passive: true })

    zoomableElements.forEach(zoomableElement => {
        (zoomableElement as HTMLElement)!.addEventListener('dblclick', (e: MouseEvent) => {
            const offsetX = e.offsetX
            doZoom(e, offsetX)
        })
    })

}

/**
 * Executes the specified action when the event node is clicked.
 * 
 * @param {HTMLDivElement} timelineElement 
 * @param {TimelineOptions} timelineOptions 
 * @param {EventNode[]} eventNodes 
 */
export const clickOpener = (timelineElement: HTMLDivElement, timelineOptions: TimelineOptions, eventNodes: EventNode[]): void => {
    let scrollPosition = 0

    const toggleModal = (event?: Event, toState: string = 'auto'): void => {
        if (event) {
            event.stopPropagation()
            //event.preventDefault()
        }
        const modalElement = document.getElementById('sunorhc-timeline-modal')
        if (!modalElement) {
            return
        }
        const modalDialogRef = modalElement.querySelector<HTMLDivElement>('.sunorhc-timeline-modal-dialog-ref')!
        const isShown = toState === 'auto' 
            ? modalDialogRef.classList.contains('shown')
            : !(toState === 'show')
        if (isShown) {
            modalDialogRef.classList.remove('shown')
            setTimeout(() => {
                setStyles(modalElement, { display: 'none' })
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' })
            }, 300)
        } else {
            setStyles(modalElement, { display: 'block' })
            scrollPosition = window.scrollY
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollPosition}px`
            document.body.style.width = `calc(100% - ${scrollbarWidth}px)`
            setTimeout(() => {
                modalDialogRef.classList.add('shown')
            }, 1)
        }
    }

    const isFunction = (obj: any, key: string): obj is { [key: string]: Function } => {
        return typeof obj[key] === 'function'
    }

    const getRemoteContent = async (eventData: EventNode): Promise<EventNode> => {
        if (eventData.hasOwnProperty('content') && isURLOrPath(eventData.content || '')) {
            let mustFetch = true
            const expiration = eventData.hasOwnProperty('expiration') ? eventData.expiration : 'none'
            if (eventData.hasOwnProperty('extends') && eventData.extends!.hasOwnProperty('remoteContent')) {
                // If cached remote content exists.
                // Set an expiration time cached event; a number is seconds from cached, always abort cache on open if "always", 
                // ever cached at no-expires on memory if "none".
                if (typeof expiration === 'number' && eventData.extends!.hasOwnProperty('cached')) {
                    mustFetch = new Date().getTime() > eventData.extends!.cached + expiration * 1000
                } else if (expiration !== 'always') {
                    mustFetch = false
                }
            }
            if (mustFetch) {
                const response = await fetchData({ url: eventData.content })
                //console.log('Open Event as Remote Got!!!:', response)
                if (response.hasOwnProperty('content')) {
                    if (!eventData.hasOwnProperty('extends')) {
                        eventData.extends = {
                            remoteContent: response.content.toString()
                        }
                    } else {
                        eventData.extends!.remoteContent = response.content.toString()
                    }
                    if (response.hasOwnProperty('label')) {
                        eventData.extends!.remoteLabel = response.label.toString()
                    }
                    if (typeof expiration === 'number') {
                        eventData.extends!.cached = new Date().getTime()
                    }
                }
            }
        } else {
            console.warn('Invalid remote URL from which content can be retrieved:', eventData.content)
        }
        return eventData
    }

    const eventOpen = async (action: Action, eventData: EventNode): Promise<void> => {
        try {
            //console.log('Open Event!!!:', action, eventData)
            if (eventData.hasOwnProperty('remote') && eventData.remote) {
                eventData = await getRemoteContent(eventData)
            }
            let injectContent = ''
            switch(action) {
                case 'modal':
                    // Displays a modal window and injects it with content.
                    let modalElement = document.getElementById('sunorhc-timeline-modal')
                    let modalConfig: Record<string, any> = {
                        size:   'medium',
                        header: undefined,
                        body:   undefined,
                        //footer: undefined,
                    }
                    let modalSize:   string = '500px'// Default to `medium`
                    let modalHeader: string = eventData.extends?.remoteLabel ? eventData.extends!.remoteLabel : eventData.label?.toString()
                    let modalBody:   string = eventData.extends?.remoteContent ? eventData.extends!.remoteContent : eventData.content?.toString()
                    let modalFooter: string = ''
                    if (timelineOptions.effects.hasOwnProperty('template') && timelineOptions.effects.template?.hasOwnProperty('modal') && !isEmptyObject( timelineOptions.effects.template?.modal )) {
                        modalConfig = { ...modalConfig, ...timelineOptions.effects.template.modal }
                    }
                    if (!modalElement) {
                        modalElement = document.createElement('div')
                        modalElement.id = 'sunorhc-timeline-modal'
                        modalElement.classList.add('sunorhc-timeline-modal-container')
                        setAtts(modalElement, { tabindex: '-1', role: 'dialog' })
                        switch (modalConfig.size) {
                            case 'full':
                                modalSize = '100vw'
                                break
                            case 'extralarge':
                                modalSize = 'calc(100% - 4rem)'
                                break
                            case 'large':
                                modalSize = '800px'
                                break
                            case 'medium':
                                modalSize = '500px'
                                break
                            case 'small':
                                modalSize = '300px'
                                break
                            default:
                                if (typeof modalConfig.size === 'number') {
                                    modalSize = `${modalConfig.size}px`
                                }
                                break
                        }
                        if (modalConfig.hasOwnProperty('header') && !!modalConfig.header && modalConfig.header !== '') {
                            modalHeader = fillTemplate(modalConfig.header, eventData)
                        }
                        if (modalConfig.hasOwnProperty('body') && !!modalConfig.body && modalConfig.body !== '') {
                            modalBody = fillTemplate(modalConfig.body, eventData)
                        }
                        if (!modalConfig.hasOwnProperty('footer') || modalConfig.footer === undefined) {
                            modalFooter = '<button type="button" class="sunorhc-timeline-modal-close">Close</button>'
                        } else if (modalConfig.footer === null || modalConfig.footer === '') {
                            modalFooter = ''
                        } else {
                            modalFooter = fillTemplate(modalConfig.footer, eventData)
                        }
                        //console.log('modalFooter?:', modalConfig.footer, modalFooter)
                        const modalDialogHTML = `\
\t<div class="sunorhc-timeline-modal-dialog-ref"></div>\
\t<div class="sunorhc-timeline-modal-dialog${modalConfig.size === 'full' ? ' fullsize' : ''}" style="--modal-width: ${modalSize};">\
\t\t<div class="sunorhc-timeline-modal-header">\
\t\t\t<h3 class="sunorhc-timeline-modal-title">${modalHeader}</h3>
\t\t\t<button type="button" class="sunorhc-timeline-modal-dismiss"><span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></span></button>\
\t\t</div>\
\t\t<div class="sunorhc-timeline-modal-body">${modalBody}</div>\
\t\t<div class="sunorhc-timeline-modal-footer"${modalFooter === '' ? ' style="display: none;"' : ''}>\
\t\t\t${modalFooter}\
\t\t</div>\
\t</div>`
                        setContent(modalElement, modalDialogHTML, false)
                        timelineElement.parentElement?.insertBefore(modalElement, timelineElement.nextSibling)
                        document.querySelector<HTMLButtonElement>('.sunorhc-timeline-modal-dismiss')!.addEventListener('click', (e: Event) => {
                            //console.log('dismiss click!!!:')
                            toggleModal(e)
                        })
                        document.querySelector<HTMLDivElement>('.sunorhc-timeline-modal-dialog-ref')!.addEventListener('click', (e: Event) => {
                            e.preventDefault()
                            //console.log('modalRef click!!!:', e.cancelable)
                            toggleModal(e)
                        })
                        document.querySelector<HTMLButtonElement>('.sunorhc-timeline-modal-close')?.addEventListener('click', (e: Event) => {
                            //console.log('close click!!!:')
                            toggleModal(e)
                        })
                    } else {
                        if (modalConfig.hasOwnProperty('header') && !!modalConfig.header && modalConfig.header !== '') {
                            modalHeader = fillTemplate(modalConfig.header, eventData)
                        }
                        if (modalConfig.hasOwnProperty('body') && !!modalConfig.body && modalConfig.body !== '') {
                            modalBody = fillTemplate(modalConfig.body, eventData)
                        }
                        setContent(modalElement.querySelector<HTMLElement>('.sunorhc-timeline-modal-title')!, modalHeader, false)
                        setContent(modalElement.querySelector<HTMLElement>('.sunorhc-timeline-modal-body')!, modalBody, false)
                        if (modalFooter !== '') {
                            setContent(modalElement.querySelector<HTMLElement>('.sunorhc-timeline-modal-footer')!, modalFooter, false)
                        }
                    }
                    toggleModal(undefined, 'show')
                    break
                /* case 'slider':
                    // Slides to reveal content in the timeline container-based display area.
                    // Note: not implemented in the current version.
                    break */
                case 'custom':
                    // Executes the specified custom action.
                    if (timelineOptions.effects.hasOwnProperty('template') && timelineOptions.effects.template?.hasOwnProperty('custom')) {
                        if (typeof timelineOptions.effects.template.custom === 'function') {
                            timelineOptions.effects.template.custom(eventData, timelineOptions)
                        } else if (typeof timelineOptions.effects.template.custom === 'string') {
                            let funcName = timelineOptions.effects.template.custom

                            console.log('custom handle as string:', funcName)
                            if (globalThis.hasOwnProperty(funcName) && isFunction(globalThis, funcName)) {
                                (globalThis as any)[funcName](eventData, timelineOptions)
                            } else {
                                throw new Error(`Function to be called could not be found: ${funcName}()`)
                            }
                        } else {
                            throw new Error('Invalid handler for processing the event detail data.')
                        }
                    }
                    break
                case 'normal':
                    // Insert content into a system-default element.
                    // That system-default element is defined: `<div id="sunorhc-timeline-event-details"></div>`
                    const eventDetailElement = document.getElementById('sunorhc-timeline-event-details')
                    if (eventDetailElement) {
                        const fixedLabel: string = eventData.extends?.remoteLabel ? eventData.extends!.remoteLabel : eventData.label?.toString()
                        const fixedContent: string = eventData.extends?.remoteContent ? eventData.extends!.remoteContent : eventData.content?.toString()
                        injectContent = `<h3>${fixedLabel || ''}</h3><p>${fixedContent || ''}</p>`
                        if (timelineOptions.effects.hasOwnProperty('template') && timelineOptions.effects.template!.details) {
                            const referEventData = {...eventData, ...{ label: fixedLabel, content: fixedContent }}
                            injectContent = fillTemplate(timelineOptions.effects.template!.details, referEventData)
                        }
                        setContent(eventDetailElement, injectContent, false)
                    } else {
                        throw new Error('No element into which timeline event details can be injected.')
                    }
                    break
                default:
                    throw new Error('Invalid action as event opener.')
            }
        } catch(error) {
            console.error('Failed to open the event:', error)
            return
        } finally {
            // After an event is opened, the callback function for that event is executed.
            //console.log('Common processes after opening an event.', eventData)
            if (eventData.hasOwnProperty('callback') && typeof eventData.callback === 'function') {
                eventData.callback(eventData)
            }
        }
    }

    const eventNodeElements: HTMLDivElement[] = Array.from(timelineElement.querySelectorAll('.sunorhc-timeline-event-node')!)
    eventNodeElements.forEach((eventNodeElement: HTMLDivElement) => {
        const styles = getAtts(eventNodeElement, 'style')!
        setAtts(eventNodeElement, { style: `${styles.toString().replace(/;$/, '')}; --event-node-cursor: pointer;` })
        eventNodeElement.addEventListener('click', (e: Event) => {
            const eventNode = <HTMLDivElement>e.target!
            const eventData = eventNodes.filter(elm => elm.eventId === eventNode.dataset.eventId).shift()
            //console.log('Event Clicked!!!:', eventNode)
            eventOpen(timelineOptions.effects.onClickEvent, eventData as EventNode)
        })
    })
}
