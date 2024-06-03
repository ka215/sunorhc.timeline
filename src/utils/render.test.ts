// <reference path="globals.d.ts" />
import { Measures, EventNode, EventChecker, SidebarRole, RulerOptions } from '@/types/definitions'
import { convertToPixels, getParticles, createLandmarkElement, createSidebar, createSidebarItems, createRuler, createRulerItems, sortEventNodes, checkEventState } from './render'
import { Window, Node } from 'happy-dom'

describe('convertToPixels', () => {

    it('should convert "1rem" to pixels', () => {
        document.documentElement.style.fontSize = '16px' // Set root font size for the test
        expect(convertToPixels('1rem')).toBe(16) // Assuming the root font size is 16px
    })

    it('should convert "2em" to pixels', () => {
        document.body.style.fontSize = '20px' // Set body font size for the test
        expect(convertToPixels('2em')).toBe(40) // Assuming the body font size is 20px
    })

    it('should convert "62.5%" to pixels', () => {
      document.body.style.fontSize = '16px' // Set body font size for the test
      expect(convertToPixels('62.5%')).toBe(10) // Assuming the body font size is 10px
    })

    it('should convert "100vw" to pixels', () => {
        window.innerWidth = 800 // Set window width for the test
        expect(convertToPixels('100vw')).toBe(800) // Assuming the window width is 800px
    })

    it('should convert "50vh" to pixels', () => {
        window.innerHeight = 600 // Set window height for the test
        expect(convertToPixels('50vh')).toBe(300) // Assuming the window height is 600px
    })

    it('should return 0 for unsupported units', () => {
        expect(convertToPixels('14pt')).toBe(0)// Unsupported unit
    })

})

describe('getParticles', () => {

    it('should return the correct differences between two dates', () => {
        const startDate = new Date('2022-01-01T00:00:00Z')
        const endDate = new Date('2023-01-01T00:00:00Z')
        // 2022-01-01 ~ 2022-12-31 = 365 days & 12 months
        // 2023-01-01 00:00:00.000Z = 0 day & 0 month
        // total: 365 days & 12 months
        const result = getParticles(startDate, endDate)
    
        expect(result).toEqual({
            years: 2,
            months: 13,
            weeks: 53,
            days: 365,
            weekdays: 365,
            hours: 8760,
            minutes: 525600,
            seconds: 31536000,
            milliseconds: 31536000000,
        })
    })
    
    it('calculates the difference between two dates', () => {
        const startDate = new Date('2024-01-01T00:00:00Z')
        const endDate = new Date('2025-02-15T12:30:45Z')
        // 2024-01-01 ~ 2024-12-31 = 366 days(leap year) & 12 months
        // 2025-01-01 ~ 2025-02-15 = 31 + 15 = 46 days & 2 months
        // total: 412 days & 14 months

        const result = getParticles(startDate, endDate)

        expect(result).toEqual({
            years: 2,
            months: 14,
            weeks: 59,
            days: 412,
            weekdays: 412,
            hours: 9876,
            minutes: 592590,
            seconds: 35555445,
            milliseconds: 35555445000
        })
    })

    it('returns the difference in the specified scale', () => {
        const startDate = new Date('2024-01-01T00:00:00Z')
        const endDate = new Date('2025-02-15T12:30:45Z')
        // total: 412 days & 14 months

        expect(getParticles(startDate, endDate, 'year')).toBe(2)
        expect(getParticles(startDate, endDate, 'month')).toBe(14)
        expect(getParticles(startDate, endDate, 'week')).toBe(59)
        expect(getParticles(startDate, endDate, 'day')).toBe(412)
        expect(getParticles(startDate, endDate, 'weekday')).toBe(412)
        expect(getParticles(startDate, endDate, 'hour')).toBe(9876)
        expect(getParticles(startDate, endDate, 'minute')).toBe(592590)
        expect(getParticles(startDate, endDate, 'second')).toBe(35555445)
        expect(getParticles(startDate, endDate, 'millisecond')).toBe(35555445000)
    })

    it('returns the difference in the plural scale', () => {
        const startDate = new Date('2024-01-01T00:00:00Z')
        const endDate = new Date('2025-02-15T12:30:45Z')
        // total: 412 days & 14 months

        expect(getParticles(startDate, endDate, 'years')).toBe(2)
        expect(getParticles(startDate, endDate, 'months')).toBe(14)
        expect(getParticles(startDate, endDate, 'weeks')).toBe(59)
        expect(getParticles(startDate, endDate, 'days')).toBe(412)
        expect(getParticles(startDate, endDate, 'weekdays')).toBe(412)
        expect(getParticles(startDate, endDate, 'hours')).toBe(9876)
        expect(getParticles(startDate, endDate, 'minutes')).toBe(592590)
        expect(getParticles(startDate, endDate, 'seconds')).toBe(35555445)
        expect(getParticles(startDate, endDate, 'milliseconds')).toBe(35555445000)
    })

    it('returns the difference object if invalid scale is provided', () => {
        const startDate = new Date('2024-01-01T00:00:00Z')
        const endDate = new Date('2025-02-15T12:30:45Z')

        const result = getParticles(startDate, endDate, 'invalid-scale')

        expect(result).toEqual({
            years: 2,
            months: 14,
            weeks: 59,
            days: 412,
            weekdays: 412,
            hours: 9876,
            minutes: 592590,
            seconds: 35555445,
            milliseconds: 35555445000
        })
    })

    it('handles leap year correctly', () => {
        // 2024 is a leap year
        const startDate = new Date('2024-02-28T00:00:00Z')
        const endDate = new Date('2024-03-01T00:00:00Z')
        // 2024-02-28, 2024-02-29, not includs 2024-03-01 = 2 days

        const result = getParticles(startDate, endDate)

        expect(result).toEqual({
            years: 1,
            months: 2,
            weeks: 1,
            days: 2,
            weekdays: 2,
            hours: 48,
            minutes: 2880,
            seconds: 172800,
            milliseconds: 172800000
        })
    })

    it('handles daylight saving time correctly', () => {
        // Date before daylight saving time starts (in the USA)
        const startDate = new Date('Mar 10 2024 00:00:00 GMT+0200 (CEST)')
        const endDate = new Date('Mar 11 2024 00:00:00 GMT+0200 (CEST)')

        const result = getParticles(startDate, endDate)

        expect(result).toEqual({
            years: 1,
            months: 1,
            weeks: 1,
            days: 1,
            weekdays: 1,
            hours: 24,
            minutes: 1440,
            seconds: 86400,
            milliseconds: 86400000
        })
    })

})

describe('createLandmarkElement', () => {

  it('should create a header element with default attributes and no styles', () => {
    const role = 'header'
    const landmarkOptions = { display: false }
    const result = createLandmarkElement(role, landmarkOptions)
    
    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-header')).toBe(true)
    expect(result.getAttribute('hidden')).toBe('true')
    expect(result.dataset.flexDirection).toBeUndefined()
  })

  it('should create a footer element and apply custom label', () => {
    const role = 'footer'
    const landmarkOptions = { label: 'Footer Label', display: true }
    const result = createLandmarkElement(role, landmarkOptions)
    
    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-footer')).toBe(true)
    expect(result.getAttribute('hidden')).toBeNull()

    const wrapLabel = result.querySelector('p')
    expect(wrapLabel).not.toBeNull()
    expect(wrapLabel!.textContent).toBe('Footer Label')
  })

  it('should apply custom text alignment style', () => {
    const role = 'header'
    const landmarkOptions = { label: 'Header Label', textAlign: 'center', display: true }
    const result = createLandmarkElement(role, landmarkOptions)

    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-header')).toBe(true)

    const wrapLabel = result.querySelector('h2')
    expect(wrapLabel).not.toBeNull()
    expect(wrapLabel?.style.textAlign).toBe('center')
    expect(wrapLabel?.textContent).toBe('Header Label')
  })

  it('should apply custom text color and additional styles', () => {
    const role = 'footer'
    const landmarkOptions = { label: 'Footer Label', textColor: 'red', textStyles: 'font-weight: bold; text-transform: uppercase;', display: true }
    const result = createLandmarkElement(role, landmarkOptions)

    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-footer')).toBe(true)

    const wrapLabel = result.querySelector('p')
    expect(wrapLabel).not.toBeNull()
    expect(wrapLabel?.getAttribute('style')).toBe('color: red; font-weight: bold; text-transform: uppercase;')
    expect(wrapLabel?.textContent).toBe('Footer Label')
  })

  it('should hide the element if display is false', () => {
    const role = 'header'
    const landmarkOptions = { label: 'Header Label', display: false }
    const result = createLandmarkElement(role, landmarkOptions)

    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-header')).toBe(true)
    expect(result.getAttribute('hidden')).toBe('true')

    const wrapLabel = result.querySelector('h2')
    expect(wrapLabel).not.toBeNull()
    expect(wrapLabel!.textContent).toBe('Header Label')
  })

  it('should apply id attribute and additional classes', () => {
    const role = 'header'
    const landmarkOptions = { label: 'Header Label', display: true, id: 'headline-1', textClass: 'text-teal-600 dark:text-teal-400' }
    const result = createLandmarkElement(role, landmarkOptions)

    expect(result.tagName).toBe('DIV')
    expect(result.classList.contains('sunorhc-timeline-header')).toBe(true)
    expect(result.getAttribute('hidden')).toBeNull()
    expect(result.id).toBe('headline-1')

    const wrapLabel = result.querySelector('h2')
    expect(wrapLabel).not.toBeNull()
    expect(wrapLabel?.textContent).toBe('Header Label')
    expect(wrapLabel?.classList.contains('text-teal-600')).toBe(true)
    expect(wrapLabel?.classList.contains('dark:text-teal-400')).toBe(true)
  })

})

describe('createSidebar', () => {

  it('should return undefined for invalid position', () => {
    const result = createSidebar('top', { sidebarWidth: 300, sidebarItemHeight: 50, sidebarOffsetTop: 10, sidebarOffsetBottom: 10 } as Measures)
    expect(result).toBeUndefined()
  })

  it('should create a sidebar element with correct attributes and styles for left position', () => {
    const measurements = {
      sidebarWidth: 300,
      sidebarHeight: 150,
      sidebarItemHeight: 50,
      sidebarOffsetTop: 10,
      sidebarOffsetBottom: 10,
    } as Measures
    const result = createSidebar('left', measurements)

    expect(result).toBeInstanceOf(HTMLDivElement)
    expect(result?.classList.contains('sunorhc-timeline-sidebar')).toBe(true)
    expect(result?.dataset.sidebarPosition).toBe('left')
    expect(result?.dataset.sidebarMaxWidth).toBe('300')
    expect(result?.dataset.sidebarMaxHeight).toBe('150')
    expect(result?.getAttribute('style')).toBe(`--sidebar-max-width: ${measurements.sidebarWidth}px; margin-top: ${measurements.sidebarOffsetTop}px; margin-bottom: ${measurements.sidebarOffsetBottom}px;`)
  })

  it('should create a sidebar element with correct attributes and styles for right position', () => {
    const measurements = {
      sidebarWidth: 400,
      sidebarHeight: 180,
      sidebarItemHeight: 60,
      sidebarOffsetTop: 15,
      sidebarOffsetBottom: 15,
    } as Measures
    const result = createSidebar('right', measurements)

    expect(result).toBeInstanceOf(HTMLDivElement)
    expect(result?.classList.contains('sunorhc-timeline-sidebar')).toBe(true)
    expect(result?.dataset.sidebarPosition).toBe('right')
    expect(result?.dataset.sidebarMaxWidth).toBe('400')
    expect(result?.dataset.sidebarMaxHeight).toBe('180')
    expect(result?.getAttribute('style')).toBe(`--sidebar-max-width: ${measurements.sidebarWidth}px; margin-top: ${measurements.sidebarOffsetTop}px; margin-bottom: ${measurements.sidebarOffsetBottom}px;`)
  })

})

describe('createSidebarItems', () => {

  it('should create sidebar items with correct attributes and styles', () => {
    const sidebarOptions = {
      items: [
        { type: 'text', label: 'Item 1', group: 'Group A', action: 'item-1.html', onClick: true },
        { type: 'avatar', src: 'http://example.com/avatar.jpg', label: 'Avatar', group: 'Group B', action: 'item-2.html' },
        { type: 'icon', iconClass: 'fas fa-star', label: 'Star', group: 'Group C', action: 'item-3.html' },
        { type: 'image', src: 'image.jpg', label: 'Image', group: 'Group D', action: 'item-4.html' },
      ],
      itemHeight: '50px',
    }

    const result = createSidebarItems(sidebarOptions as SidebarRole)

    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.classList.contains('sunorhc-timeline-sidebar-items')).toBe(true)
    expect(result.dataset.alternateRows).toBe('true')

    // Test creation of each sidebar item
    sidebarOptions.items.forEach((item, idx) => {
      const liElement = result.children[idx] as HTMLLIElement

      expect(liElement.tagName).toBe('LI')
      expect(liElement.getAttribute('tabindex')).toBe(String(idx + 1))

      if (item.group) {
        expect(liElement.getAttribute('data-sidebar-item-group')).toBe(item.group)
      }
      if (item.action) {
        expect(liElement.getAttribute('data-sidebar-item-action')).toBe(item.action)
      }
      if (item.onClick) {
        expect(liElement.getAttribute('onClick')).toBe('Function(`return ${this.dataset.sidebarItemAction}`)()')
      }

      //const styles = `height: ${sidebarOptions.itemHeight}`
      expect(liElement.style.height).toBe(sidebarOptions.itemHeight)

      // Test creation of specific elements based on item type
      switch (item.type) {
        case 'text':
          expect(liElement.children[0].tagName).toBe('SPAN')
          expect(liElement.children[0].textContent).toBe(item.label)
          break
        case 'avatar':
          expect(liElement.children[0].tagName).toBe('SPAN')
          expect(liElement.children[0].children[0].tagName).toBe('IMG')
          expect((liElement.children[0].children[0] as HTMLImageElement).src).toBe(item.src)
          break
        case 'icon':
          expect(liElement.children[0].tagName).toBe('SPAN')
          expect(liElement.children[0].children[0].tagName).toBe('I')
          expect(liElement.children[0].children[0].classList.contains('fas')).toBe(true)
          expect(liElement.children[0].children[0].classList.contains('fa-star')).toBe(true)
          break
        case 'image':
          expect(liElement.children[0].tagName).toBe('SPAN')
          expect(liElement.children[0].getAttribute('data-image-src')).toBe(item.src)
          expect((liElement.children[0] as HTMLElement).style.getPropertyValue('--bg-image')).toBe(`url('${item.src}')`)
          break
      }
    })
  })

  it('should return an empty ul element if no items provided', () => {
    const sidebarOptions = { items: [], itemHeight: '50px' }
    const result = createSidebarItems(sidebarOptions as unknown as SidebarRole)
    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.classList.contains('sunorhc-timeline-sidebar-items')).toBe(true)
    expect(result.dataset.alternateRows).toBe('true')
    expect(result.children.length).toBe(0)
  })

})

describe('createRuler', () => {

  it('should create ruler element with correct attributes', () => {
    const measurements = {
      rulerTopRows: 5,
      rulerBottomRows: 7,
      rulerMaxCols: 24,
    }

    const positions = ['top', 'bottom']
    positions.forEach((position) => {
      const result = createRuler(position, measurements as Measures)

      expect(result).toBeInstanceOf(HTMLDivElement)
      expect(result?.classList.contains('sunorhc-timeline-ruler')).toBe(true)
      expect(result?.dataset.rulerPosition).toBe(position)
      expect(result?.dataset.rulerRows).toBe(String(position === 'top' ? measurements.rulerTopRows : measurements.rulerBottomRows))
      expect(result?.dataset.rulerMaxCols).toBe(String(measurements.rulerMaxCols))
      expect(result?.dataset.alternateRows).toBe('true')
    })
  })

  it('should return undefined if position is neither "top" nor "bottom"', () => {
    const measurements = {
      rulerTopRows: 5,
      rulerBottomRows: 7,
      rulerMaxCols: 24,
    }

    const invalidPositions = ['left', 'right', 'middle']
    invalidPositions.forEach((position) => {
      const result = createRuler(position, measurements as Measures)
      expect(result).toBeUndefined()
    })
  })

})

describe.skip('createRulerItems', () => {

    const rulerOptions = {
        globalScale: 'day',
        timezone: 'UTC',
        scale: 'year',
        order: 3,
        minGrainWidth: 48,
        placement: 'bottom',
        config: {
            rows: [ 'day', 'month', 'year' ],
            rowHeight: '1.5rem',
            fontSize: '1rem',
            locale: 'en-US'
        },
        filters: {
            decorations: {
                year: { prefix: '西暦', suffix: '年' },
                month: { suffix: '<span style="margin-left: 2px">月</span>' },
                week: { replacer: '<small class="text-gray-500" style="margin-right: 2px">第</small>%s<small class="text-gray-500" style="margin-left: 2px">週</small>', suffix: '' },
                hours: { suffix: '時' }
            },
            monthFormat: 'numeric',
            dayNames: [ '日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜' ],
            abbreviateMonthNameLength: 2,
            abbreviateDayNameLength: 1,
            fullStop: false,
            dayBackgroundColor: true
        },
        maxCols: 31,
        startDate: {
            year: 2024,
            month: 5,
            monthName: 'May',
            day: 1,
            weekday: 'Wednesday',
            weeks: 18,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            ISO: '2024-05-01T00:00:00.000Z',
            ts: 1714521600,
            cept: 63850118400
        },
        endDate: {
            year: 2024,
            month: 5,
            monthName: 'May',
            day: 31,
            weekday: 'Friday',
            weeks: 22,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            ISO: '2024-05-31T00:00:00.000Z',
            ts: 1717113600,
            cept: 63852710400
        }
    } as unknown as RulerOptions

    it('should create ruler items with correct attributes in year scale', () => {
        const result = createRulerItems(rulerOptions)!
        // result.outerHTML:
        // <ul data-ruler-type="year" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
        //   <li data-item-datetime="2024" data-item-colspan="31" style="width: 1488px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">西暦2024年</li>
        // </ul>

        expect(result).toBeInstanceOf(HTMLUListElement)
        expect(result.classList.contains('sunorhc-timeline-ruler-row')).toBe(true)
        expect(result.dataset.rulerType).toBe(rulerOptions.scale)
        expect(result.dataset.rulerOrder).toBe(rulerOptions.order.toString())
        expect(result.childNodes.length).toBe(1)
        const firstItem = result.firstElementChild as HTMLElement
        expect(firstItem.dataset.itemDatetime).toBe(rulerOptions.startDate.year.toString())
        expect(firstItem.dataset.itemColspan).toBe(rulerOptions.maxCols.toString())
        expect(firstItem.dataset.itemColspan).toBe(rulerOptions.maxCols.toString())
        expect(firstItem.textContent).toBe(`${rulerOptions.filters.decorations!.year!.prefix}${rulerOptions.startDate.year}${rulerOptions.filters.decorations!.year!.suffix}`)
    })

    it('should create ruler items with correct attributes in month scale', () => {
        rulerOptions.scale = 'month'
        rulerOptions.order = 2
        const result = createRulerItems(rulerOptions)!
        // result.outerHTML:
        // <ul data-ruler-type="month" data-ruler-order="2" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
        //   <li data-item-datetime="2024-05" data-item-colspan="31" style="width: 1488px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">
        //     5<span style="margin-left: 2px">月</span>
        //   </li>
        // </ul>

        expect(result).toBeInstanceOf(HTMLUListElement)
        expect(result.classList.contains('sunorhc-timeline-ruler-row')).toBe(true)
        expect(result.dataset.rulerType).toBe(rulerOptions.scale)
        expect(result.dataset.rulerOrder).toBe(rulerOptions.order.toString())
        expect(result.childElementCount).toBe(1)
        const firstItem = result.children[0] as HTMLLIElement
        expect(firstItem.getAttribute('data-item-datetime')).toBe(`${rulerOptions.startDate.year}-${String(rulerOptions.startDate.month).padStart(2, '0')}`)
        expect(firstItem.innerHTML).toEqual('5<span style="margin-left: 2px">月</span>')
    })

    it('should create ruler items with correct attributes in week scale that has day global scale', () => {
        rulerOptions.scale = 'week'
        rulerOptions.order = 1
        const result = createRulerItems(rulerOptions)!
        // result.outerHTML:
        // <ul data-ruler-type="week" data-ruler-order="1" style="--min-grain-width: 48px;" data-ruler-grain="min" class="sunorhc-timeline-ruler-row last-order-row">
        //   <li data-item-datetime="2024-18" data-item-colspan="5" style="width: 240px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">
        //     <small class="text-gray-500" style="margin-right: 2px">第</small>18<small class="text-gray-500" style="margin-left: 2px">週</small>
        //   </li>
        //   <li data-item-datetime="2024-19" data-item-colspan="7" style="width: 336px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;"><small class="text-gray-500" style="margin-right: 2px">第</small>19<small class="text-gray-500" style="margin-left: 2px">週</small></li>
        //   <li data-item-datetime="2024-20" data-item-colspan="7" style="width: 336px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;"><small class="text-gray-500" style="margin-right: 2px">第</small>20<small class="text-gray-500" style="margin-left: 2px">週</small></li>
        //   <li data-item-datetime="2024-21" data-item-colspan="7" style="width: 336px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;"><small class="text-gray-500" style="margin-right: 2px">第</small>21<small class="text-gray-500" style="margin-left: 2px">週</small></li>
        //   <li data-item-datetime="2024-22" data-item-colspan="5" style="width: 240px; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;"><small class="text-gray-500" style="margin-right: 2px">第</small>22<small class="text-gray-500" style="margin-left: 2px">週</small></li>
        // </ul>

        expect(result).toBeInstanceOf(HTMLUListElement)
        expect(result.classList.contains('sunorhc-timeline-ruler-row')).toBe(true)
        expect(result.dataset.rulerType).toBe(rulerOptions.scale)
        expect(result.dataset.rulerOrder).toBe(rulerOptions.order.toString())
        expect(result.dataset.rulerGrain).toBe('min')// It should be the "min" when "bottom" of placement, and order is 1.
        expect(result.childElementCount).toBe(5)
        Array.from(result.children).forEach((childElement, i) => {
          expect(childElement.getAttribute('data-item-datetime')).toBe(`${rulerOptions.startDate.year}-${String(rulerOptions.startDate.weeks + i)}`)
          expect(Number(childElement.getAttribute('data-item-colspan'))).toBeGreaterThanOrEqual(1)
          expect(Number(childElement.getAttribute('data-item-colspan'))).toBeLessThanOrEqual(7)
          expect(childElement.textContent).toEqual(expect.stringMatching(/^第\d+週$/))
        })
    })

    it('should create ruler items with correct attributes in week scale that has week global scale', () => {
      rulerOptions.globalScale = 'week'
      rulerOptions.scale = 'week'
      rulerOptions.order = 2
      rulerOptions.filters.decorations!.week = { suffix: 'th', replacer: '' }
      const result = createRulerItems(rulerOptions)!
      // <ul class="sunorhc-timeline-ruler-row" data-ruler-type="week" data-ruler-order="2" style="--min-grain-width: 48px;">
      //   <li data-item-datetime="2024-18" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">18th</li>
      //   <li data-item-datetime="2024-19" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">19th</li>
      //   ...
      //   <li data-item-datetime="2024-47" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">47th</li>
      //   <li data-item-datetime="2024-48" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">48th</li>
      // </ul>

      expect(result).toBeInstanceOf(HTMLUListElement)
      expect(result.classList.contains('sunorhc-timeline-ruler-row')).toBe(true)
      expect(result.dataset.rulerType).toBe(rulerOptions.scale)
      expect(result.dataset.rulerOrder).toBe(rulerOptions.order.toString())
      expect(result.dataset.rulerGrain).toBeUndefined()
      expect(result.childElementCount).toBe(31)
      Array.from(result.children).forEach((childElement, i) => {
        expect(childElement.getAttribute('data-item-datetime')).toBe(`${rulerOptions.startDate.year}-${String(rulerOptions.startDate.weeks + i)}`)
        expect(childElement.textContent).toEqual(expect.stringMatching(/^\d+th$/))
      })
    })

    it('should create ruler items with correct attributes in day scale', () => {
        rulerOptions.globalScale = 'day'
        rulerOptions.scale = 'day'
        rulerOptions.order = 3
        const result = createRulerItems(rulerOptions)!
        // result.outerHTML:
        // <ul class="sunorhc-timeline-ruler-row" data-ruler-type="day" data-ruler-order="1" style="--min-grain-width: 48px;" data-ruler-grain="max">
        //   <li data-item-datetime="2024-05-01,wed" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">1</li>
        //   <li data-item-datetime="2024-05-02,thu" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">2</li>
        //   ...
        //   <li data-item-datetime="2024-05-30,thu" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">30</li>
        //   <li data-item-datetime="2024-05-31,fri" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">31</li>
        // </ul>

        expect(result).toBeInstanceOf(HTMLUListElement)
        expect(result.dataset.rulerType).toBe(rulerOptions.scale)
        expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
        const regexString = `^${rulerOptions.startDate.year}-\\d{2}-\\d{2},\\w{3}$`
        Array.from(result.children).forEach((childElement, i) => {
          expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexString)))
          expect(childElement.textContent).toBe(String(i + 1))
        })
    })

    it('should create ruler items with correct attributes in weekday scale', () => {
      rulerOptions.scale = 'weekday'
      const result = createRulerItems(rulerOptions)!
      // result.outerHTML:
      // <ul data-ruler-type="weekday" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
      //   <li data-item-datetime="2024-05-01,wed" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">水</li>
      //   <li data-item-datetime="2024-05-02,thu" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">木</li>
      //   ...
      //   <li data-item-datetime="2024-05-30,thu" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">木</li>
      //   <li data-item-datetime="2024-05-31,fri" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">金</li>
      // </ul>

      expect(result).toBeInstanceOf(HTMLUListElement)
      expect(result.dataset.rulerType).toBe(rulerOptions.scale)
      expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
      //expect(result.outerHTML).toBe('')
      const regexString = `^${rulerOptions.startDate.year}-\\d{2}-\\d{2},\\w{3}$`
      Array.from(result.children).forEach((childElement) => {
        expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexString)))
        expect([ '日', '月', '火', '水', '木', '金', '土' ]).toContainEqual(childElement.textContent)
      })
  })

  it('should create ruler items with correct attributes in hours scale that has hour global scale', () => {
    rulerOptions.globalScale = 'hour'
    rulerOptions.scale = 'hour'
    const result = createRulerItems(rulerOptions)!
    // result.outerHTML:
    // <ul data-ruler-type="hours" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
    //   <li data-item-datetime="2024-05-01T00" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">0時</li>
    //   <li data-item-datetime="2024-05-01T01" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">1時</li>
    //   ...
    //   <li data-item-datetime="2024-05-01T23" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">23時</li>
    //   <li data-item-datetime="2024-05-02T00" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">0時</li>
    //   ...
    //   <li data-item-datetime="2024-05-02T06" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">6時</li>
    // </ul>

    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.dataset.rulerType).toBe(rulerOptions.scale)
    expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
    const regexItems = [
      `^${rulerOptions.startDate.year}-${String(rulerOptions.startDate.month).padStart(2, '0')}-\\d{2}T\\d{2}$`,
      `^\\d+${rulerOptions.filters.decorations!.hours!.suffix}$`,
    ]
    Array.from(result.children).forEach((childElement) => {
      expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexItems[0])))
      expect(childElement.textContent).toEqual(expect.stringMatching(new RegExp(regexItems[1])))
    })
  })

  it('should create ruler items with correct attributes in minutes scale that has minute global scale', () => {
    rulerOptions.globalScale = 'minute'
    rulerOptions.scale = 'minute'
    const result = createRulerItems(rulerOptions)!
    // result.outerHTML:
    // <ul data-ruler-type="minutes" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
    //   <li data-item-datetime="2024-05-01T00:00" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">0</li>
    //   <li data-item-datetime="2024-05-01T00:01" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">1</li>
    //   ...
    //   <li data-item-datetime="2024-05-01T00:29" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">29</li>
    //   <li data-item-datetime="2024-05-01T00:30" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">30</li>
    // </ul>

    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.dataset.rulerType).toBe(rulerOptions.scale)
    expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
    const regexItems = [
      `^${rulerOptions.startDate.year}-${String(rulerOptions.startDate.month).padStart(2, '0')}-\\d{2}T\\d{2}:\\d{2}$`,
      `^\\d{1,2}$`,
    ]
    Array.from(result.children).forEach((childElement) => {
      expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexItems[0])))
      expect(childElement.textContent).toEqual(expect.stringMatching(new RegExp(regexItems[1])))
    })
  })

  it('should create ruler items with correct attributes in seconds scale that has second global scale', () => {
    rulerOptions.globalScale = 'second'
    rulerOptions.scale = 'second'
    const result = createRulerItems(rulerOptions)!
    // result.outerHTML:
    // <ul data-ruler-type="seconds" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
    //   <li data-item-datetime="2024-05-01T00:00:00" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">0</li>
    //   <li data-item-datetime="2024-05-01T00:00:01" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">1</li>
    //   ...
    //   <li data-item-datetime="2024-05-01T00:00:29" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">29</li>
    //   <li data-item-datetime="2024-05-01T00:00:30" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">30</li>
    // </ul>

    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.dataset.rulerType).toBe(rulerOptions.scale)
    expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
    const regexItems = [
      `^${rulerOptions.startDate.year}-${String(rulerOptions.startDate.month).padStart(2, '0')}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$`,
      `^\\d{1,2}$`,
    ]
    Array.from(result.children).forEach((childElement) => {
      expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexItems[0])))
      expect(childElement.textContent).toEqual(expect.stringMatching(new RegExp(regexItems[1])))
    })
  })

  it('should create ruler items with correct attributes in milliseconds scale that has millisecond global scale', () => {
    rulerOptions.globalScale = 'millisecond'
    rulerOptions.scale = 'millisecond'
    const result = createRulerItems(rulerOptions)!
    // result.outerHTML:
    // <ul data-ruler-type="milliseconds" data-ruler-order="3" style="--min-grain-width: 48px;" data-ruler-grain="max" class="sunorhc-timeline-ruler-row last-order-row">
    //   <li data-item-datetime="2024-05-01T00:00:00.000" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">000</li>
    //   <li data-item-datetime="2024-05-01T00:00:00.001" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">001</li>
    //   ...
    //   <li data-item-datetime="2024-05-01T00:00:00.029" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">029</li>
    //   <li data-item-datetime="2024-05-01T00:00:00.030" style="width: auto; --ruler-row-height: 1.5rem; --ruler-item-font: 1rem;">030</li>
    // </ul>

    expect(result).toBeInstanceOf(HTMLUListElement)
    expect(result.dataset.rulerType).toBe(rulerOptions.scale)
    expect(result.childNodes).toHaveLength(rulerOptions.maxCols)
    const regexItems = [
      `^${rulerOptions.startDate.year}-${String(rulerOptions.startDate.month).padStart(2, '0')}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}$`,
      `^\\d{3}$`,
    ]
    Array.from(result.children).forEach((childElement) => {
      expect(childElement.getAttribute('data-item-datetime')).toEqual(expect.stringMatching(new RegExp(regexItems[0])))
      expect(childElement.textContent).toEqual(expect.stringMatching(new RegExp(regexItems[1])))
    })
  })

})

describe('sortEventNodes', () => {

  it('should sort by descending y value', () => {
    const nodes = [
      { uid: 1, y: 300, w: 10, h: 20 },
      { uid: 2, y: 500, w: 20, h: 10 },
      { uid: 3, y: 100, w: 15, h: 15 }
    ] as EventNode[]

    const sortedNodes = sortEventNodes(nodes)
    expect(sortedNodes).toEqual([
      { uid: 2, y: 500, w: 20, h: 10 },
      { uid: 1, y: 300, w: 10, h: 20 },
      { uid: 3, y: 100, w: 15, h: 15 }
    ])
  })

  it('should sort by descending area value when y values are equal', () => {
    const nodes = [
      { uid: 1, y: 300, w: 10, h: 20 },
      { uid: 2, y: 300, w: 20, h: 10 },
      { uid: 3, y: 300, w: 15, h: 15 }
    ] as EventNode[]

    const sortedNodes = sortEventNodes(nodes);
    expect(sortedNodes).toEqual([
      { uid: 3, y: 300, w: 15, h: 15 },
      { uid: 1, y: 300, w: 10, h: 20 },
      { uid: 2, y: 300, w: 20, h: 10 }
    ])// Note: the order of elements with the same y value and area remains the same.
  })

  it('should handle missing y value by assuming it as 1', () => {
    const nodes = [
      { uid: 1, w: 10, h: 20 },
      { uid: 2, y: 300, w: 20, h: 10 },
      { uid: 3, y: 100, w: 15, h: 15 }
    ] as EventNode[]

    const sortedNodes = sortEventNodes(nodes)
    expect(sortedNodes).toEqual([
      { uid: 2, y: 300, w: 20, h: 10 },
      { uid: 3, y: 100, w: 15, h: 15 },
      { uid: 1, w: 10, h: 20 }
    ])
  })

  it('should handle missing width or height by assuming it as 1', () => {
    const nodes = [
      { uid: 1, y: 300 },
      { uid: 2, y: 300, w: 20 },
      { uid: 3, y: 300, h: 15 },
      { uid: 4, y: 300, w: 10, h: 20 }
    ] as EventNode[]

    const sortedNodes = sortEventNodes(nodes);
    expect(sortedNodes).toEqual([
      { uid: 4, y: 300, w: 10, h: 20 },
      { uid: 2, y: 300, w: 20 },
      { uid: 3, y: 300, h: 15 },
      { uid: 1, y: 300 }
    ])
  })

  it('should handle empty array', () => {
    const nodes = [] as EventNode[]
    const sortedNodes = sortEventNodes(nodes)
    expect(sortedNodes).toEqual([])
  })

  it('should handle array with one element', () => {
    const nodes = [
      { uid: 1, y: 300, w: 10, h: 20 }
    ] as EventNode[]
    const sortedNodes = sortEventNodes(nodes)
    expect(sortedNodes).toEqual([
      { uid: 1, y: 300, w: 10, h: 20 }
    ])
  })

})

describe('checkEventState', () => {

  it(`should correctly width and height of given container element`, () => {
    const result = checkEventState({ x: 0, y: 0, w: 100, h: 100 } as EventNode, 800, 600)
    expect(result.containerSize).toEqual({ width: 800, height: 600 })
  })

  const testCases: { describe?: string, eventNode: Partial<EventNode>, expected: Partial<EventChecker> }[] = [
    { // 1
      eventNode: { x: 0, y: 0, w: 100, h: 100 },
      expected: { containerSize: { width: 800, height: 600 }, startBeforeRange: false, isEnableEvent: true }
    },
    { // 2
      eventNode: { x: -10, y: 100, w: 50, h: 50 },
      expected: { startBeforeRange: true, isEnableEvent: true }
    },
    { // 3
      eventNode: { x: 810, y: 100, w: 50, h: 50 },
      expected: { startAfterRange: true, isEnableEvent: false }
    },
    { // 4
      eventNode: { x: 100, y: -10, w: 50, h: 50 },
      expected: { eventLessThanRow: true, isEnableEvent: false }
    },
    { // 5
      eventNode: { x: 100, y: 610, w: 50, h: 50 },
      expected: { eventExceedingRows: true, isEnableEvent: false }
    },
    { // 6
      eventNode: { x: 100, y: 100, w: 50, h: 50 },
      expected: { isEnableEvent: true }
    },
    { // 7: 
      describe: 'should correctly check event state for full fill event in container area',
      eventNode: { x: 0, y: 0, w: 800, h: 600 },
      expected: { endBeforeRange: false, endAfterRange: false, isEnableEvent: true }
    },
    { // 8: eventEnd == 0 to equal startRange, therefore visible event width is 0
      describe: 'should be not enable event because an eventEnd equal startRange and visible event width is 0',
      eventNode: { x: -10, y: 100, w: 10, h: 50 },
      expected: { endBeforeRange: true, isOutOfRange: true, isEnableEvent: false }
    },
    { // 9: 
      eventNode: { x: 760, y: 100, w: 50, h: 50 },
      expected: { endAfterRange: true, isEnableEvent: true }
    },
    { // 10: eventStart == endRange, therefore visible event width is 0
      describe: 'should be not enable event because an eventStart equal endRange and visible event width is 0',
      eventNode: { x: 800, y: 100, w: 50, h: 50 },
      expected: { startAfterRange: true, isOutOfRange: true, isEnableEvent: false }
    },
    { // 11
      eventNode: { x: 900, y: 700, w: 50, h: 50 },
      expected: { isOutOfRange: true, isOutOfRows: true, isEnableEvent: false }
    },
    { // 12: eventRow(Y) == bottomRow, therefore visible event height is 0
      describe: 'should be not enable event because an eventRow(Y) equal bottom of last row and visible event width is 0',
      eventNode: { x: 400, y: 600, w: 50, h: 50 },
      expected: { eventExceedingRows: true, isOutOfRows: true, isEnableEvent: false }
    }
  ]

  testCases.forEach(({ describe, eventNode, expected }, index) => {
    const describeText = describe || `should correctly check event state for case ${index + 1}`
    it(describeText, () => {
      const result = checkEventState(eventNode as EventNode, 800, 600)
      for (const key in expected) {
        expect(result[key as keyof EventChecker]).toEqual(expected[key as keyof EventChecker])
      }
    })
  })

})
