// DOM event helper methods
// Methods:
// dragScroll, wheelScroll, doAlignment

import { EventNodes, EventNode, TimelineOptions } from '@/types/definitions'
import { getRect, setAtts, setContent, setStyles, wrapChildNodes } from './dom'
import { findEvents, truncateLowerScales } from './helper'
import { toValidScale, parseDateTime } from './datetime'

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
            const latestEvent = findEvents(timelineElement.id, { latest: true }, false)
            if (latestEvent) {
                latestEvent.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }))
                targetElement.scrollTo({ top: 0, left: latestEvent.offsetLeft, behavior: 'smooth' })
            }
            break
        default:
            // Places focus on the event node with the specified event ID.
            const targetEvent = findEvents(timelineElement.id, { id: position }, false)
            if (targetEvent) {
                targetEvent.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }))
                targetElement.scrollTo({ top: 0, left: targetEvent.offsetLeft, behavior: 'smooth' })
            }
            break
    }
}

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
            const stickyPosition = Math.max(/*initialOffsetLeft,*/ stickyLeft, scrollLeft)
            //stickyRulerItem.style.position = 'relative'
            //stickyRulerItem.style.left = `${stickyPosition}px`
        })
    })
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

export const dblclickZoom = (timelineElement: HTMLDivElement, timelineOptions: TimelineOptions): void => {
    const zoomableBaseContainer: HTMLDivElement = timelineElement.querySelector('.sunorhc-timeline-main-canvas')!
    const zoomableElements = [
        ...Array.from(zoomableBaseContainer.querySelectorAll('.sunorhc-timeline-ruler')),
        zoomableBaseContainer.querySelector('.sunorhc-timeline-nodes'),
    ]

    const toDateFromOffsetX = (offsetX: number, scale: string): string => {
        const containerElement = zoomableBaseContainer.querySelector('.sunorhc-timeline-nodes')!
        const perX = offsetX / containerElement.clientWidth
        const parsedStartDate = parseDateTime(timelineOptions.start, timelineOptions.timezone)
        const parsedEndDate   = parseDateTime(timelineOptions.end, timelineOptions.timezone)
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

    const doZoom = (evt: MouseEvent) => {
        const targetElement = evt.target as HTMLElement
        const clientX = evt.pageX // Absolute X coordinates of the entire visible page.
        const clientY = evt.pageY // Absolute Y coordinates of the entire visible page.
        const offsetX = evt.offsetX // Relative X coordinates on the zoomableBaseContainer element.
        const offsetY = evt.offsetY // Relative Y coordinates on the zoomableBaseContainer element.
        console.log('zoomReady!!::', targetElement.nodeName, clientX, clientY, offsetX, offsetY, evt, zoomableBaseContainer.clientWidth)
        
        let newStartDate: string = ''
        let newEndDate: string = 'auto'
        let previousScale: string | boolean = ''
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
            previousScale = timelineOptions.scale
            newStartDate = toDateFromOffsetX(offsetX, previousScale)
            console.log('zoomToSetting!!!::', newStartDate, newEndDate, previousScale)
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
                    console.log('!!!:', matches, oneDay, monthDays)
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
                newRulerOptions.top!.rows = truncateLowerScales(zoomToScale, newRulerOptions.top!.rows)
            }
            if (newRulerOptions.hasOwnProperty('bottom') && newRulerOptions.bottom!.rows.length > 0) {
                newRulerOptions.bottom!.rows = truncateLowerScales(zoomToScale, newRulerOptions.bottom!.rows)
            }
        }

        const zoomOptions = {
            prevScale: previousScale,
            scale: zoomToScale,
            start: newStartDate,
            end: newEndDate,
            ruler: newRulerOptions,
        }
        console.log('Before Zoom!!!::', zoomOptions, timelineOptions.ruler)
        if ((window as Window).hasOwnProperty('SunorhcTimelineInstances')) {
            window.SunorhcTimelineInstances[timelineElement.id].zoom(zoomOptions)
        }
    }

    zoomableBaseContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-nodes')?.addEventListener('mousemove', (e: MouseEvent) => {
        const toDateStr = toDateFromOffsetX(e.offsetX, timelineOptions.scale)
        console.log('offsetX: %s -> date: %s', e.offsetX, toDateStr)
    })

    zoomableElements.forEach(zoomableElement => {
        (zoomableElement as HTMLElement)!.addEventListener('dblclick', (e: MouseEvent) => {
            doZoom(e)
        })
    })

}
