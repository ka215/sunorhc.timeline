// Component render method dedicated to SunorhcTimeline library
// Methods:
// convertToPixels, getMinParticles, createLandmarkElement, createSidebar, createSidebarItems, 
// createRuler, createRulerItems,
// Types:
// SetStartDatatimeReturnType, SetEndDatatimeReturnType

import { Scale, LandmarkRole, SidebarRole, EventNode, Particles, Measures, RulerOptions, EventChecker } from '@/types/definitions'
import { isEmptyObject, isURLOrPath, sprintf } from './common'
import { addTime, parseDateTime } from './datetime'
import { setAtts, setStyles, setContent, getRect } from './dom'
// For debug when development.
import { devLogger } from './logger'
const logger = devLogger()

/**
 * Converts CSS size values to pixels.
 * Supported units are "px", "rem", "em", "vw", "vh".
 *
 * @param {string | number | undefined} value - The CSS size value to convert.
 * @returns The converted value in pixels.
 */
export const convertToPixels = (value?: string | number): number => {
    if (!value) {
        return 0
    }
    if (typeof value === 'number') {
        return value
    }

    const numericValue = parseFloat(String(value))
    const unit = String(value).match(/[\d.\-\+]*\s*(.*)/)?.[1]
    
    if (unit === 'px') {
        return numericValue
    } else if (unit === 'rem') {
        const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
        return numericValue * htmlFontSize
    } else if (unit === 'em' || unit === '%') {
        const parentFontSize = parseFloat(getComputedStyle(document.body).fontSize)
        return unit === 'em' ? numericValue * parentFontSize : numericValue / 100 * parentFontSize
    } else if (unit === 'vw') {
        return (numericValue * window.innerWidth) / 100
    } else if (unit === 'vh') {
        return (numericValue * window.innerHeight) / 100
    }
    
    return 0
}

/**
 * Calculates the number of items in each scale between two dates.
 * The calculated number will be an integer value rounded up to the nearest floating point.
 * 
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @param {string | undefined} scale - The scale string.
 * @returns {Particles | number} - An object containing the difference between the two dates.
 */
export const getParticles = (startDate: Date, endDate: Date, scale?: string): Particles | number => {
    // Convert start and end dates to UTC to handle daylight saving time
    const startUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), startDate.getUTCHours(), startDate.getUTCMinutes(), startDate.getUTCSeconds(), startDate.getUTCMilliseconds()))
    const endUTC = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds(), endDate.getUTCMilliseconds()))

    // Calculate the time difference in milliseconds.
    const timeInMilliseconds = endUTC.getTime() - startUTC.getTime()

    // Calculate milliseconds, seconds, minutes, hours, days, and weeks.
    const milliseconds = timeInMilliseconds
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    let   days = Math.floor(hours /24)
    const weeks = Math.floor(days / 7)

    // Extract the year and month of the start and end dates to calculate the year and month.
    const startYear = startUTC.getUTCFullYear()
    const startMonth = startUTC.getUTCMonth()
    const endYear = endUTC.getUTCFullYear()
    const endMonth = endUTC.getUTCMonth()

    // Calculate the year difference and month difference.
    let years = endYear - startYear
    // (end) - (start): Since the current year is not included, finally require +1.
    // 2025 - 2024 = 1
    // 2024 - 2024 = 0 
    // 2026 - 2022 = 4 
    let months = endMonth - startMonth + (years * 12)
    // (end) - (start): Since the current month is not included, finally require +1.
    // 2025-02 - 2024-05: (2 - 5 = -3) + 1 * 12   = 9
    // 2024-01 - 2023-12: (1 - 12 = -11) + 1 * 12 = 1
    // 2024-09 - 2024-02: (9 - 2 = 7) + 0 * 12    = 7
    // 2026-03 - 2022-04: (3 - 4 = -1) + 4 * 12   = 47
    // years = Math.ceil(months / 12)
    // 2025-02 - 2024-05: 9 / 12  = 0.75  = 1
    // 2024-01 - 2023-12: 1 / 12  = 0.833 = 1
    // 2024-12 - 2024-01: 11 / 12 = 0.916 = 1
    // 2026-03 - 2022-04: 47 / 12 = 3.916 = 4
    const monthIndex = months % 12

    // Calculate days, hours, minutes, seconds and milliseconds with precision.
    const adjustedEndDate = new Date(startUTC.getTime())
    adjustedEndDate.setUTCFullYear(startUTC.getUTCFullYear() + years, monthIndex, 1)

    // Calculate the difference in days.
    let dayDiff = endUTC.getUTCDate() - adjustedEndDate.getUTCDate()
    adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + dayDiff)

    const hourDiff = endUTC.getUTCHours() - adjustedEndDate.getUTCHours()
    adjustedEndDate.setUTCHours(adjustedEndDate.getUTCHours() + hourDiff)

    const minuteDiff = endUTC.getUTCMinutes() - adjustedEndDate.getUTCMinutes()
    adjustedEndDate.setUTCMinutes(adjustedEndDate.getUTCMinutes() + minuteDiff)

    const secondDiff = endUTC.getUTCSeconds() - adjustedEndDate.getUTCSeconds()
    adjustedEndDate.setUTCSeconds(adjustedEndDate.getUTCSeconds() + secondDiff)

    const millisecondDiff = endUTC.getUTCMilliseconds() - adjustedEndDate.getUTCMilliseconds()

    if (Math.max(hourDiff, minuteDiff, secondDiff, millisecondDiff, 0) > 0) {
        days += 1
    }

    const minParticles = {
        years: years + 1,// includes current year
        months: months + 1,// includes current year
        weeks: weeks + 1,// includes current week
        days: days,
        weekdays: days,// same days
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
    } as Particles

    if (scale && /^(year|month|week|(week|)day|hour|minute|(milli|)second)s?$/i.test(scale)) {
        const scaleStr = scale.toLowerCase()
        const propName = scaleStr.endsWith('s') ? scaleStr : scaleStr + 's'
        if (minParticles.hasOwnProperty(propName)) {
            return minParticles[(propName as keyof Particles)]
        }
    }
    return minParticles
}

/**
 * Generate header or footer content elements.
 * 
 * @param {string} role - Which "header" or "footer" as role strings.
 * @param {LandmarkRole} landmarkOptions 
 * @returns 
 */
export const createLandmarkElement = (role: string, landmarkOptions: LandmarkRole): HTMLDivElement => {
    const addCustomStyles = (options: { [key:string]: any }): string => {
        let customStyles: string[] = [], matches: any = null, parsedArr: string[] = []
        for (const key in options) {
            switch(key) {
                case 'textAlign':
                    matches = options[key].match(/^(?<alignment>(left|center|right))$/)
                    if (!!matches?.groups.alignment) {
                        customStyles.push(`text-align: ${matches.groups.alignment}`)
                    }
                    break
                case 'textColor':
                    customStyles.push(`color: ${options[key]}`)
                    break
                case 'textStyles':
                    parsedArr = options[key].split(';')
                    if (Array.isArray(parsedArr) && parsedArr.length > 0) {
                        customStyles.push(...parsedArr)
                    }
                    break
            }
        }
        if (customStyles.length > 0) {
            //console.log('createLandmark::addCustomStyles:', customStyles)
            return customStyles.join('; ')
        } else {
            return ''
        }
    }
    const landmarkElement = document.createElement('div')
    landmarkElement.classList.add(`sunorhc-timeline-${role}`)
    let elementAtts: { [key: string]: any } = {}
    if (!landmarkOptions.display) {
        elementAtts.hidden = 'true'
    }
    if (!!landmarkOptions.id && landmarkOptions.id !== '') {
        elementAtts.id = landmarkOptions.id
    }
    if (!!landmarkOptions.flexDirection && landmarkOptions.flexDirection !== '') {
        elementAtts['data-flex-direction'] = /^(column|row)$/.test(landmarkOptions.flexDirection) ? landmarkOptions.flexDirection : 'column'
    }
    setAtts(landmarkElement, elementAtts)
    if (!!landmarkOptions.label) {
        const wrapLabel = document.createElement(role === 'header' ? 'h2' : 'p')
        if (!!landmarkOptions.textClass && landmarkOptions.textClass !== '') {
            setAtts(wrapLabel, { class: landmarkOptions.textClass })
        }
        const customStyleString = addCustomStyles(landmarkOptions)
        //console.log(role, customStyleString)
        setStyles(wrapLabel, customStyleString)
        setContent(wrapLabel, landmarkOptions.label, false)
        landmarkElement.append(wrapLabel)
    }
    return landmarkElement
}

/**
 * Generates a container element to store sidebar list items.
 * 
 * @param {string} position - The only strings allowed are "left" or "right"
 * @param {Measures} measurements 
 * @returns {HTMLDivElement | undefined}
 */
export const createSidebar = (position: string, measurements: Measures): HTMLDivElement | undefined => {
    if (!/^(left|right)$/i.test(position)) {
        return
    }
    const sidebarElement = document.createElement('div')
    sidebarElement.classList.add('sunorhc-timeline-sidebar')
    setAtts(sidebarElement, {
        'data-sidebar-position': position,
        'data-sidebar-max-width': measurements.sidebarWidth.toString(),
        'data-sidebar-max-height': measurements.sidebarHeight.toString(),
    })
    setStyles(sidebarElement, `
        --sidebar-max-width: ${measurements.sidebarWidth}px;
        margin-top: ${measurements.sidebarOffsetTop}px;
        margin-bottom: ${measurements.sidebarOffsetBottom}px;
    `)

    return sidebarElement
}

/**
 * Generates list items according to given sidebar options.
 * 
 * @param {SidebarRole} sidebarOptions 
 * @returns {HTMLUListElement}
 */
export const createSidebarItems = (sidebarOptions: SidebarRole): HTMLUListElement => {
    const ulElement = document.createElement('ul')
    ulElement.classList.add('sunorhc-timeline-sidebar-items')
    setAtts(ulElement, { 'data-alternate-rows': 'true' })

    if (sidebarOptions.hasOwnProperty('items') && sidebarOptions.items.length > 0) {
        sidebarOptions.items.forEach((item: { [key:string]: any }, idx: number) => {
            const liElement = document.createElement('li')
            const addCustomStyles = (element: HTMLElement, item: { [key:string]: any }, skipPosition: boolean = false): void => {
                let customStyles: string = '', matches: any
                if (!!item.textPosition && item.textPosition !== '' && !skipPosition) {
                    matches = item.textPosition.match(/^(?<valign>(center|top|bottom)?)\s+(?<halign>(center|left|right)?)$/)
                    if (!!matches?.groups.valign) {
                        customStyles += `vertical-align: ${matches.groups.valign};`
                    }
                    if (!!matches?.groups.halign) {
                        customStyles += `text-align: ${matches.groups.halign};`
                    }
                }
                if (!!item.textColor && item.textColor !== '') {
                    customStyles += `color: ${item.textColor};`
                }
                if (!!item.textStyles && item.textStyles !== '') {
                    customStyles += item.textStyles
                }
                if (customStyles !== '') {
                    //console.log('addCustomStyles:', item, matches, customStyles)
                    setStyles(element, customStyles)
                }
            }
            let wrapElement: HTMLSpanElement, textElement: HTMLSpanElement, imgElement: any, 
                liAtts = { 'tabindex': String(idx + 1) } as { [key:string]: any }
            if (!!item.group && item.group !== '') {
                liAtts['data-sidebar-item-group'] = item.group
            }
            if (!!item.action && item.action !== '') {
                liAtts['data-sidebar-item-action'] = isURLOrPath(item.action) ?  `location.assign('${item.action}')` : item.action
            }
            if (!!item.onClick && typeof item.onClick === 'boolean') {
                liAtts['onClick'] = 'Function(`return ${this.dataset.sidebarItemAction}`)()'
            }
            setAtts(liElement, liAtts)
            setStyles(liElement, { height: String(sidebarOptions.itemHeight || '80px') })
            switch(true) {
                case /^text$/i.test(item.type):
                    textElement = document.createElement('span')
                    setAtts(textElement, {
                        'data-sidebar-item-type': item.type,
                        'data-text-overflow': item.textOverflow ? 'hidden' : 'static',
                        'title': item.label,
                    })
                    addCustomStyles(textElement, item)
                    setContent(textElement, item.label)
                    liElement.append(textElement)
                    break
                case /^avatar$/i.test(item.type):
                case /^icon$/i.test(item.type):
                    wrapElement = document.createElement('span')
                    setAtts(wrapElement, { 'data-sidebar-item-type': item.type })
                    if (item.type === 'avatar') {
                        imgElement  = new Image() as HTMLImageElement
                        imgElement.src = item.src
                        setStyles(wrapElement, { height: '100%', width: 'auto' })
                    } else {
                        imgElement = document.createElement('i') as HTMLElement
                        setAtts(imgElement, { class: item.iconClass || '' })
                        imgElement.textContent = item.iconContent || ''
                        setAtts(wrapElement, { class: item.iconWrapClass || '' })
                    }
                    wrapElement.append(imgElement)
                    if (!item.label || item.label === '') {
                        liElement.append(wrapElement)
                    } else {
                        textElement = document.createElement('span')
                        setAtts(textElement, {
                            'data-sidebar-item-type': 'text',
                            'data-text-overflow': item.textOverflow ? 'hidden' : 'static',
                            'title': item.label,
                        })
                        addCustomStyles(textElement, item)
                        setContent(textElement, item.label)
                        liElement.append(wrapElement, textElement)
                    }
                    break
                case /^image$/i.test(item.type):
                    wrapElement = document.createElement('span')
                    setAtts(wrapElement, {
                        'data-sidebar-item-type': item.type,
                        'data-image-src': item.src,
                    })
                    setStyles(wrapElement, `--bg-image: url('${item.src}')`)
                    if (!item.label || item.label === '') {
                        liElement.append(wrapElement)
                    } else {
                        textElement = document.createElement('span')
                        setAtts(textElement, {
                            'data-sidebar-item-type': 'caption',
                            'data-caption-position': item.textPosition || 'center',
                            'data-caption-color': item.textColor || '',
                            'data-caption-overflow': item.textOverflow ? 'hidden' : 'static',
                            'title': item.label,
                        })
                        addCustomStyles(textElement, item, true)
                        setContent(textElement, `<span>${item.label}</span>`, false)
                        liElement.append(wrapElement, textElement)
                    }
                    break
            }
            ulElement.append(liElement)
        })
    }
    //console.log('createSidebarItems:', ulElement, sidebarOptions)
    return ulElement
}

/**
 * Generates a container element to store ruler list items.
 * 
 * @param {string} position - The only strings allowed are "top" or "bottom"
 * @param {Measures} measurements 
 * @returns {HTMLDivElement | undefined}
 */
export const createRuler = (position: string, measurements: Measures): HTMLDivElement | undefined => {
    if (!/^(top|bottom)$/i.test(position)) {
        return
    }
    const rulerElement = document.createElement('div')
    rulerElement.classList.add('sunorhc-timeline-ruler')
    setAtts(rulerElement, {
        'data-ruler-position': position,
        'data-ruler-rows': String(/^top$/i.test(position) ? measurements.rulerTopRows : measurements.rulerBottomRows),
        'data-ruler-max-cols': measurements.rulerMaxCols.toString(),
        'data-alternate-rows': 'true',
    })

    return rulerElement
}

/**
 * Generates list items according to given ruler options.
 * 
 * @param {RulerOptions} rulerOptions 
 * @returns {HTMLUListElement}
 */
export const createRulerItems = (rulerOptions: RulerOptions): HTMLUListElement => {
    const ulElement = document.createElement('ul')
    ulElement.classList.add('sunorhc-timeline-ruler-row')
    setAtts(ulElement, {
        'data-ruler-type':  rulerOptions.scale,
        'data-ruler-order': rulerOptions.order.toString(),
    })
    setStyles(ulElement, `--min-grain-width: ${rulerOptions.minGrainWidth}px;`)
    if (rulerOptions.order == rulerOptions.config.rows.length) {
        setAtts(ulElement, { 'data-ruler-grain': rulerOptions.placement === 'top' ? 'min' : 'max' })
        ulElement.classList.add('last-order-row')
    } else if (rulerOptions.order == 1) {
        setAtts(ulElement, { 'data-ruler-grain': rulerOptions.placement === 'top' ? 'max' : 'min' })
    }

    if (rulerOptions.hasOwnProperty('maxCols') && rulerOptions.maxCols > 0) {
        const fragment: DocumentFragment = document.createDocumentFragment()
        const weekdays: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']// sun = 0
        //const particleKey = ensureEndsWithS(rulerOptions.scale)
        //const particle = rulerOptions.particles[particleKey]
        let colspan: number = 0,
            listItems: { [key: string]: any } = {},
            key: string | undefined = undefined,
            content: string | undefined = undefined

        for (let i = 0; i < rulerOptions.maxCols; i++) {
            const decorations = !!rulerOptions.filters ? rulerOptions.filters.decorations! : undefined 
            const monthNames = !!rulerOptions.filters ? rulerOptions.filters.monthNames! : undefined
            const dayNames = !!rulerOptions.filters ? rulerOptions.filters.dayNames! : undefined
            const calcDate = addTime(rulerOptions.startDate.ts * 1000, i, rulerOptions.globalScale, rulerOptions.timezone)
            const rulerItemDate = parseDateTime(new Date(calcDate), rulerOptions.timezone, monthNames, dayNames)
            colspan++
            let validScale = rulerOptions.scale.toLowerCase()
            validScale = (validScale.endsWith('s') ? validScale.slice(0, -1) : validScale) as Scale
            switch(validScale) {
                case 'year':
                    key = rulerItemDate?.y(4)
                    content = rulerItemDate?.y(1)
                    break
                case 'month':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}`
                    if (!!rulerOptions.filters && rulerOptions.filters.monthFormat === 'name') {
                        content = rulerItemDate?.mn(rulerOptions.filters.abbreviateMonthNameLength || 0, rulerOptions.filters.fullStop || false)
                    } else {
                        content = rulerItemDate?.m(1)
                    }
                    break
                case 'week':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.w(2)}`
                    content = rulerItemDate?.w(1)
                    break
                case 'day':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}`//,${rulerItemDate?.wd(3).toLowerCase()}`
                    key = `${key},${weekdays[new Date(key).getUTCDay()]}`
                    content = rulerItemDate?.d(1)
                    break
                case 'weekday':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}`//,${rulerItemDate?.wd(3).toLowerCase()}`
                    key = `${key},${weekdays[new Date(key).getUTCDay()]}`
                    if (!!rulerOptions.filters) {
                        content = rulerItemDate?.wd(rulerOptions.filters.abbreviateDayNameLength || 0, rulerOptions.filters.fullStop || false)
                    } else {
                        content = rulerItemDate?.wd()
                    }
                    break
                case 'hour':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}T${rulerItemDate?.h(2)}`
                    content = rulerItemDate?.h(1)
                    break
                case 'minute':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}T${rulerItemDate?.h(2)}:${rulerItemDate?.mi(2)}`
                    content = rulerItemDate?.mi(1)
                    break
                case 'second':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}T${rulerItemDate?.h(2)}:${rulerItemDate?.mi(2)}:${rulerItemDate?.s(2)}`
                    content = rulerItemDate?.s(1)
                    break
                case 'millisecond':
                    key = `${rulerItemDate?.y(4)}-${rulerItemDate?.m(2)}-${rulerItemDate?.d(2)}T${rulerItemDate?.h(2)}:${rulerItemDate?.mi(2)}:${rulerItemDate?.s(2)}.${rulerItemDate?.ms(3)}`
                    content = rulerItemDate?.ms(3)
                    break
            }
            if (!!decorations && !!decorations[validScale]) {
                content = `${decorations[validScale]!.prefix || ''}${content}${decorations[validScale]!.suffix || ''}`
                if (!!decorations[validScale]!.replacer) {
                    content = sprintf(decorations[validScale]!.replacer!, content)
                }
            }
            if (!!key) {
                if (Object.prototype.hasOwnProperty.call(listItems, key)) {
                    listItems[key].colspan = colspan
                } else {
                    colspan = 1
                    listItems[key] = { colspan: colspan, content: content }
                }
            }
        }
        //console.log('createRulerItems:', rulerOptions, rulerOptions.scale, listItems)
        if (!isEmptyObject(listItems)) {
            for (const prop in listItems) {
                const liElement = document.createElement('li')
                let liAtts: { [key: string]: string } = { 'data-item-datetime': prop }
                if (listItems[prop].colspan > 1) {
                    liAtts['data-item-colspan'] = String(listItems[prop].colspan)
                    const colspanWidth = rulerOptions.minGrainWidth * listItems[prop].colspan
                    liAtts['style'] = `width: ${colspanWidth}px;`
                } else {
                    liAtts['style'] = `width: auto;`
                }
                if (rulerOptions.config.rowHeight) {
                    liAtts['style'] += ` --ruler-row-height: ${rulerOptions.config.rowHeight};`
                }
                if (rulerOptions.config.fontSize) {
                    liAtts['style'] += ` --ruler-item-font: ${rulerOptions.config.fontSize};`
                }
                if (rulerOptions.config.textColor) {
                    liAtts['style'] += ` --ruler-text-color: ${rulerOptions.config.textColor};`
                }
                if (rulerOptions.config.backgroundColor) {
                    liAtts['style'] += ` --ruler-bg-color: ${rulerOptions.config.backgroundColor};`
                }
                setAtts(liElement, liAtts)
                setContent(liElement, listItems[prop].content, false)
                fragment.append(liElement)
            }
            ulElement.append(fragment)
        }
    }
    return ulElement
}

/**
 * Sort the array of EventNode objects in descending order of y value and descending order of area value.
 * The sorted event nodes will be optimized in rendering order.
 * 
 * @param {T[]} records 
 * @returns 
 */
export const sortEventNodes = <T extends EventNode>(records: T[]): T[] => {
    return records.sort((a: T, b: T): number => {
        // First, sort by descending y value.
        const aY = a.hasOwnProperty('y') ? a.y : 0
        const bY = b.hasOwnProperty('y') ? b.y : 0
        if (aY !== bY) {
            return bY! - aY!
        }
    
        // Then sort by descending area value of width(w) * height(h).
        const areaA = (a.w ?? 1) * (a.h ?? 1)
        const areaB = (b.w ?? 1) * (b.h ?? 1)
        return areaB - areaA
    })
}

/**
 * Checks the status of the event data, then returns the result as a report object.
 *
 * @param {EventNode} eventNode 
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @param {number} startRangeTime
 * @param {number} endRangeTime
 * @returns {EventChecker}
 */
export const checkEventState = (eventNode: EventNode, containerWidth: number, containerHeight: number, startRangeTime: number, endRangeTime: number): EventChecker => {
    const eventStartTime = eventNode.hasOwnProperty('s') ? eventNode.s!.ts : -1
    const eventEndTime   = eventNode.hasOwnProperty('e') ? eventNode.e!.ts : eventStartTime
    let report = {
        containerSize: { width: containerWidth, height: containerHeight },
        eventX: eventNode.x,
        eventY: eventNode.y,
        eventWidth: eventNode.w,
        eventHeight: eventNode.h,
        eventDisplayArea: (eventNode.w ?? 0) * (eventNode.h ?? 0),
        startBeforeRange: (eventNode.x! < 0) || (eventStartTime < startRangeTime),
        startAfterRange: (eventNode.x! >= containerWidth) || (eventStartTime >= endRangeTime),
        endBeforeRange: (eventNode.x! + eventNode.w! <= 0) || (eventEndTime <= startRangeTime),
        endAfterRange: (eventNode.x! + eventNode.w! > containerWidth) || (eventEndTime > endRangeTime),
        isOutOfRange: (eventNode.x! >= containerWidth) || (eventNode.x! + eventNode.w! <= 0),
        eventLessThanRow: eventNode.y! < 0,
        eventExceedingRows: eventNode.y! >= containerHeight,
        isOutOfRows: (eventNode.y! < 0) || (eventNode.y! >= containerHeight),
        isEnableEvent: false,
    } as EventChecker
    report.isEnableEvent = !report.isOutOfRange && !report.isOutOfRows
    return report
}

/**
 * Place the valid events in a container element for displaying events.
 * 
 * @param {HTMLDivElement} containerElement 
 * @param {EventNode[]} eventNodes 
 */
export const placeEventNodes = (containerElement: HTMLDivElement, eventNodes: EventNode[]): void => {
    const fragment: DocumentFragment = document.createDocumentFragment()
    // Sort event nodes by rendering order.
    const sortedEventNodes = sortEventNodes(eventNodes)
    //console.log('placeEventNodes::sorted:', sortedEventNodes, eventNodes)

    const containerRect = getRect(containerElement) as DOMRect
    const containerWidth  = containerRect.width
    const containerHeight = containerRect.height
    const startRangeTime  = Number(containerElement.dataset.rangeStart)
    const endRangeTime    = Number(containerElement.dataset.rangeEnd)

    sortedEventNodes.forEach((evt: EventNode) => {
        const checker = checkEventState(evt, containerWidth, containerHeight, startRangeTime, endRangeTime)
        if (!checker.isEnableEvent) {
            // Skip handling of an event out of range of the timeline.
            logger.log('placeEventNodes::%caborted:%c', 'color:brown;font-weight:600;', 'color:black;font-weight:400;', checker, evt)
            return
        }
        logger.log('placeEventNodes::%cenabled:%c', 'color:green;font-weight:600;', 'color:black;font-weight:400;', checker, evt)
        const eventNodeElement = document.createElement('div')
        eventNodeElement.classList.add('sunorhc-timeline-event-node')
        setAtts(eventNodeElement, { 'data-event-id': evt.eventId!.toString() })
        const styles = [
            `--event-node-height: ${evt.h || 8}px`,
            `--event-node-width: ${evt.w || 8}px`,
            `--event-node-y: ${evt.y || 0}px`,
            `--event-node-x: ${evt.x || 0}px`,
            `--event-node-text-color: ${evt.textColor || 'inherit'}`,
            `--event-node-bg-color: ${evt.backgroundColor || 'inherit'}`,
            `--event-node-border-width: ${evt.borderWidth || 1}px`,
            `--event-node-border-color: ${evt.borderColor || 'inherit'}`,
            `--event-node-border-radius: ${!evt.hasOwnProperty('end') ? '50%' : '2.5px'}`,
            //`--event-node-text-color-hovered: ${}`,
            //`--event-node-bg-color-hovered: ${}`,
            //`--event-node-border-color-hovered: ${}`,
        ]
        setStyles(eventNodeElement, styles.join('; '))
        if (evt.hasOwnProperty('end')) {
            eventNodeElement.classList.add('bar-type')
            if (checker.startBeforeRange) {
                eventNodeElement.classList.add('before-start')
            }
            if (checker.endAfterRange) {
                eventNodeElement.classList.add('after-end')
            }
            if (evt.hasOwnProperty('label') && evt.label !== '') {
                setContent(eventNodeElement, `<span>${evt.label}</span>`, false)
            }
        }
        fragment.append(eventNodeElement)
        containerElement.append(fragment)
    })
    //logger.log('placeEventNodes:', containerElement)
}