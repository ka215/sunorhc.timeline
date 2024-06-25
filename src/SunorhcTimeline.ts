import * as packageJson from '../package.json'
import './styles/main.sass'
import {
  Sidebars, Rulers, Alignment, EventNode, TimelineOptions, TimelineBaseClass, Measures, RulerOptions, ZoomScaleOptions
} from './types/definitions'
import {
  isObject, isEmptyObject, getAtts, setAtts, setStyles, setContent, deepMergeObjects, deepCloneObject, cloneObject, 
  fetchData, deserialize, parseDateTime, convertToPixels, isElement, getRect, getParticles, getStartDatetime, getEndDatetime, 
  createLandmarkElement, createSidebar, createSidebarItems, createRuler, createRulerItems, optimizeEventNode, placeEventNodes, 
  showPresentTimeMarker, getDuplicateValues, validatorEventNode, validateTimelineOptions, saveToStorage, loadFromStorage, 
  watcher, dragScroll, doAlignment, wheelScroll, dblclickZoom, onHoverTooltip, clickOpener
} from './utils'
import { LoggerService } from './utils/logger'

// Get Env
const isDev = process.env.NODE_ENV === 'development'
const defaultLogFilePath = isDev ? 'dev-log.log' : 'prod-log.log'
//console.log('isDev:', isDev, process.env.NODE_ENV, defaultLogFilePath)

// Set default values as options initialization
const defaultOptions: TimelineOptions = {
  start: 'currently',
  end: 'auto',
  timezone: 'UTC',
  scale: 'day',
  file: null,
  header: { display: false },
  footer: { display: false },
  sidebar: {
    placement: 'both',
    sticky: false,
    overlay: false,
    width: '150px',
    itemHeight: '80px',
    items: [],
  },
  ruler: {
    placement: 'both',
    truncateLowers: false,
    firstDayOfWeek: 0,
    minGrainWidth: '48px',
    top: {
      rows: [ 'day' ],
      //rowHeight: '24px',
      //fontSize: '16px',
    },
    bottom: {
      rows: [ 'day' ],
      //rowHeight: '24px',
      //fontSize: '16px',
    },
  },
  events: '',
  layout: {
    //elevation: 0,
    //outlined: 'inside',
    //outlineCorner: 'rounded',
    //outlineStyle: 'solid',
    hideScrollbar: true,
    eventsBackground: 'plaid',
    width: 'auto',
    height: 'auto',
  },
  effects: {
    presentTime: false,
    defaultAlignment: 'latest',
    cacheExpiration: 'always',
    hoverEvent: false,
    onClickEvent: 'normal',
  },
  theme: {
    name: 'default',
  },
  useStorage: 'sessionStorage',
  zoomable: false,
  debug: isDev,
}

export class Timeline implements TimelineBaseClass {
  // Application Version
  public static readonly VERSION: string = packageJson.version

  readonly elementId: string
  targetElement: HTMLDivElement
  fragmentNode: DocumentFragment
  options = defaultOptions

  protected inputOptions: Partial<TimelineOptions>
  protected loadOptions = null
  protected measurements = {}
  protected eventNodes: object[] = []

  private logger: LoggerService

  /**
   * The constructor cannot be called directly from any methods other than self own.
   * 
   * @param {string} elementId - The ID of the HTML element.
   * @param {TimelineOptions} inputOptions - Optional timeline options.
   * @private
   */
  private constructor(elementId: string, inputOptions?: Partial<TimelineOptions>) {
    this.elementId = elementId
    this.targetElement = document.querySelector<HTMLDivElement>(`#${elementId}`)!
    this.fragmentNode  = document.createDocumentFragment()
    this.inputOptions  = inputOptions as Partial<TimelineOptions> ?? {}

    const loggerOptions = {
      debug: (Object.prototype.hasOwnProperty.call(this.inputOptions, 'debug') ? this.inputOptions.debug : isDev) || false,
      logFilePath: defaultLogFilePath
    }
    this.logger = new LoggerService(loggerOptions)
  }

  /**
   * Factory method for instantiating this class.
   * 
   * @param {string} elementId - The ID of the HTML element.
   * @param {TimelineOptions} inputOptions - Optional timeline options.
   * @returns {Promise<SunorhcTimeline>} A Promise that resolves to an instance of SunorhcTimeline.
   * @static
   */
  static async create(elementId: string, inputOptions?: TimelineOptions): Promise<Timeline> {
    const instance = new Timeline(elementId, inputOptions)
    try {
      instance.options = await Promise.resolve(instance.initOptions())
      instance.measurements = await Promise.resolve(instance.initMeasure())

      // Render timeline component.
      await Promise.resolve(instance.render())

      // Here is the "initialized" hook point immediately after initialization.
      instance.initialized()

      // Load event nodes, cache them after parsing, and place them on the DOM.
      await Promise.resolve(instance.serveEventNodes())

      // Registration of various event listeners.
      instance.registerEventListeners()

      // Start monitoring rendering mode.
      instance.runChangeThemeWatcher()

    } catch (error) {
      console.error('Failed to create timeline:', error)
      // Hide the dispatcher element itself for injecting the timeline.
      setStyles(instance.targetElement, { display: 'none' })
    } finally {
      // Add an instance to the global Window object.
      if (!(window as Window).hasOwnProperty('SunorhcTimelineInstances')) {
        window.SunorhcTimelineInstances = {}
      }
      window.SunorhcTimelineInstances[instance.elementId] = instance
    }
    return instance
  }

  /**
   * Initializes the timeline options.
   * 
   * @returns {Promise<Def.TimelineOptions>} A Promise that resolves to the timeline options.
   * @private
   */
  private async initOptions(): Promise<TimelineOptions> {
    // Options initialization
    let fixedOptions = deepMergeObjects({}, this.options)

    // First, extract the options from the data-options attribute.
    if (this.targetElement.dataset.options) {
      const datasetOptions = deserialize<Record<string, any>>(this.targetElement.dataset.options)
      //console.log('!!!:', datasetOptions, typeof datasetOptions)
      if (isObject(datasetOptions)) {
        const validOptions = validateTimelineOptions(datasetOptions)
        fixedOptions = deepMergeObjects(fixedOptions, validOptions)
      } else if (typeof datasetOptions === 'string') {
        fixedOptions = deepMergeObjects(fixedOptions, { file: datasetOptions })
      }
    }

    // Second, it overrides the options passed in the constructor arguments.
    if (this.inputOptions && isObject(this.inputOptions) && !isEmptyObject(this.inputOptions)) {
      fixedOptions = deepMergeObjects(fixedOptions, this.inputOptions)
      if (this.inputOptions.start instanceof Date) {
        fixedOptions.start = this.inputOptions.start
      }
      if (this.inputOptions.end instanceof Date) {
        fixedOptions.end = this.inputOptions.end
      }
    }

    // Finally, if an external configuration file is specified, it is fetched and overridden.
    if (fixedOptions.hasOwnProperty('file') && typeof fixedOptions.file === 'string' && fixedOptions.file !== '') {
      const result = await fetchData({ url: fixedOptions.file })
      fixedOptions = deepMergeObjects(fixedOptions, validateTimelineOptions<TimelineOptions>(result))
      this.logger.log('Fetched options file:', result, validateTimelineOptions<TimelineOptions>(result), fixedOptions)
    }

    this.logger.info(`%cSnorch.Timeline ver.${Timeline.VERSION} is booting now...`, 'color: #0284c7; font-weight: 700;')
    return fixedOptions
  }

  /**
   * Getter to retrieve the current options.
   * @returns {TimelineOptions} The current timeline options.
   */
  getOptions(toClone: boolean = false): TimelineOptions {
    return toClone ? deepCloneObject(this.options) : this.options
  }

  /**
   * Measure the rendering area and calculate.
   * @returns {Promise<Error | Measures>} A Promise that resolves options for rendering or rejects as error handling.
   * @private
   */
  private async initMeasure(): Promise<Error | Measures> {
    const timelineContainer = document.createElement('div')
    timelineContainer.classList.add('sunorhc-timeline-container', 'preparing')
    const containerAtts: Record<string, string> = {
      'data-timeline-outlined':  this.options.layout && /^(outside|both)$/.test(this.options.layout.outlined!) ? 'true' : 'false'
    }
    if (!!this.options.layout.outlineCorner) {
      containerAtts['data-timeline-linestyle'] = this.options.layout.outlineCorner
    }
    if (!!this.options.layout.elevation) {
      containerAtts['data-timeline-elevation'] = this.options.layout.elevation.toString()
    }
    if (!!this.options.layout.rtl) {
      containerAtts['dir'] = this.options.layout.rtl ? 'rtl' : 'ltr'
    }
    setAtts(timelineContainer, containerAtts)
    const containerWidth  = this.options.layout.width || 'auto'
    const containerHeight = /*this.options.layout.height || */'auto'
    const containerStyles: string[] = [
      'width: ' + (typeof containerWidth  === 'number' ? `${containerWidth}px` : containerWidth),
      'height: ' + (typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight),
    ]
    if (!!this.options.layout.outlineStyle) {
      containerStyles.push(`--outline-style: ${this.options.layout.outlineStyle}`)
    }
    //console.log('initMeasure:', containerAtts, containerStyles)
    setStyles(timelineContainer, containerStyles.join('; '))
    this.fragmentNode.append(timelineContainer)
    this.targetElement.append(this.fragmentNode)

    try {
      // Parse start date
      const optionStartDate = getStartDatetime(this.options.start, this.options.timezone, this.options.scale)
      if (optionStartDate instanceof Error) {
        throw optionStartDate
      }
      // Parse end date
      const optionEndDate = getEndDatetime(this.options.end, this.options.timezone, this.options.scale, optionStartDate)
      if (optionEndDate instanceof Error) {
        throw optionEndDate
      }
      const monthNames = this.options.ruler.filters?.monthNames ?? undefined
      const dayNames = this.options.ruler.filters?.dayNames ?? undefined
      const firstDayOfWeek = this.options.ruler.firstDayOfWeek || 0
      const startDate = parseDateTime(optionStartDate, this.options.timezone, monthNames, dayNames, firstDayOfWeek)
      const endDate   = parseDateTime(optionEndDate, this.options.timezone, monthNames, dayNames, firstDayOfWeek)
      // Calculate the maximum granularity number of the ruler from the start and end range based on the scale
      const maxParticles = getParticles(optionStartDate, optionEndDate)
      const scaleParticle = getParticles(optionStartDate, optionEndDate, this.options.scale) as number

      const targetRect = getRect(this.targetElement)
      const containerRect = cloneObject(getRect(timelineContainer)) as unknown as DOMRect

      const optionSidebarWidth = convertToPixels(this.options.sidebar.width)
      const optionSidebarItemHeight = convertToPixels(this.options.sidebar.itemHeight)
      const rulerTopRows = this.options.ruler.top?.rows?.length || 0
      const rulerBottomRows = this.options.ruler.bottom?.rows?.length || 0
      const rulerTopRowHeight = convertToPixels(this.options.ruler.top?.rowHeight) || 24
      const rulerBottomRowHeight = convertToPixels(this.options.ruler.bottom?.rowHeight) || 24
      let preMeasures = {
        // Datetime
        startDate: startDate,
        endDate: endDate,
        particles: maxParticles,

        injectTo: targetRect,
        container: containerRect,
        // Container layouts
        containerWidth: containerRect.width,// = targetRect.width
        containerHeight: containerRect.height,// = targetRect.height; includes header and footer height.
        containerTop: containerRect.top,// = targetRect.top
        containerLeft: containerRect.left,// = targetRect.left
        // Body layouts
        bodyHeight: undefined,// unknown at the time of execution of this process.
        // Sidebar layouts
        sidebarWidth: optionSidebarWidth,
        sidebarHeight: optionSidebarItemHeight * this.options.sidebar.items.length,// = sidebar actual height (full items height)
        sidebarVisibleHeight: undefined,// unknown at the time of execution of this process.
        sidebarOffsetTop: /^(both|top)/i.test(this.options.ruler.placement) ? (rulerTopRows * rulerTopRowHeight) : 0,
        sidebarOffsetBottom: /^(both|bottom)/i.test(this.options.ruler.placement) ? (rulerBottomRows * rulerBottomRowHeight) : 0,
        sidebarItemHeight: optionSidebarItemHeight,// one item height
        sidebarItems: this.options.sidebar.items.length,
        // Ruler layouts
        rulerVisibleWidth: containerRect.width - (/^both$/i.test(this.options.sidebar.placement)
          ? optionSidebarWidth * 2
          : (/^(left|right)$/i.test(this.options.sidebar.placement) ? optionSidebarWidth : 0)),
        rulerActualWidth: convertToPixels(this.options.ruler.minGrainWidth) * scaleParticle,
        rulerTopRows: (this.options.ruler.top?.rows?.length || 0),
        rulerBottomRows: (this.options.ruler.bottom?.rows?.length || 0),
        rulerTopHeight: (this.options.ruler.top?.rows?.length || 0) * rulerTopRowHeight,
        rulerBottomHeight: (this.options.ruler.bottom?.rows?.length || 0) * rulerBottomRowHeight,
        rulerMaxCols: scaleParticle,
      } as Measures
      this.logger.log('initMeasure:', this.elementId, this.options, preMeasures)
      if (preMeasures.sidebarItems == 0 || preMeasures.rulerTopRows + preMeasures.rulerBottomRows == 0) {
        throw new Error('Missing several configurations to generate timeline.')
      }
      return Promise.resolve(preMeasures)
    } catch (error) {
      //console.error('Error:', error)
      return Promise.reject(error as unknown as string)
    }
  }

  /**
   * Render the timeline component as instance of this library.
   * @returns {Promise<void>}
   * @private
   */
  private async render(): Promise<void> {
    const referMeasurements = deepCloneObject(this.measurements) as Measures
    const filterNodesGuard = (nodes: any): Node[] => nodes.filter((e: Node): e is HTMLElement => !!e)
    let appendNodes = null
    //console.log('render:', referMeasurements )

    const header: HTMLDivElement = createLandmarkElement('header', this.options.header) as HTMLDivElement

    // Generate timeline body
    const body: HTMLDivElement = document.createElement('div')
    body.classList.add('sunorhc-timeline-body')
    setAtts(body, {
      'data-timeline-outlined':  this.options.layout && /^(inside|both)$/.test(this.options.layout.outlined!) ? 'true' : 'false',
      'data-timeline-linestyle': this.options.layout ? this.options.layout.outlineCorner! : '',
    })
    let bodyStyles: string[] = []
    if (this.options.layout) {
      if (this.options.layout.height && this.options.layout.height !== 'auto') {
        let bodyHeight: number = typeof this.options.layout.height === 'string' ? convertToPixels(this.options.layout.height) : this.options.layout.height

        bodyStyles.push(`height: ${bodyHeight}px`)
      }
      if (this.options.layout.outlineStyle) {
        bodyStyles.push(`--outline-style: ${this.options.layout.outlineStyle}`)
      }
    }
    setStyles(body, bodyStyles.join('; '))

    // Generate sidebar containers
    //const sidebars: { [key: string]?: HTMLDivElement/* | undefined*/ } = {
    const sidebars: Sidebars = {
      left:  /^(both|left)$/i.test(this.options.sidebar.placement) ? createSidebar('left', referMeasurements) as HTMLDivElement : undefined,
      right: /^(both|right)$/i.test(this.options.sidebar.placement) ? createSidebar('right', referMeasurements) as HTMLDivElement : undefined,
    }
    // Add sidebar items
    for (const key in sidebars) {
      if (sidebars.hasOwnProperty(key) && !!sidebars[key as keyof Sidebars] && isElement(sidebars[key as keyof Sidebars])) {
        /*
        Util.setAtts(sidebars[key]!, {
          //'data-sidebar-sticky':  this.options.sidebar.sticky ? 'fixed' : 'static',// no use
          //'data-sidebar-overlay': this.options.sidebar.overlay ? 'true' : 'false',// no use
          //'data-sidebar-oveflow': 'false',// Disabled at the time of this process
        })
        */
        const sidebarItems = createSidebarItems(this.options.sidebar)
        // Adjust outlines
        if (this.options.ruler.placement === 'bottom') {
          if (this.options.layout.outlined === 'inside') {
            setStyles(sidebarItems, { borderTop: 'none' })
          }
        }
        sidebars[key as keyof Sidebars]!.append(sidebarItems)
      }
    }

    // Generate timeline main canvas
    const main: HTMLDivElement = document.createElement('div')
    main.classList.add('sunorhc-timeline-main-canvas')
    if (this.options.layout.hideScrollbar!) {
      setAtts(main, { 'data-hide-scrollbar': 'true' })
    }
    const adjustMainStyles: string[] = [`--main-visible-width: ${referMeasurements.rulerVisibleWidth}px`]
    // Adjust outlines
    if (this.options.ruler.placement === 'bottom') {
      if (this.options.layout.outlined === 'both') {
        adjustMainStyles.push(`border-top: ${this.options.layout?.outlineStyle || 'solid'} 1px var(--border-color)`)// #9ca3cf
      }
    }
    setStyles(main, adjustMainStyles.join('; '))

    // Generate ruler container
    //const rulers: { [key: string]: HTMLDivElement | undefined } = {
    const rulers: Rulers = {
      top:    /^(both|top)$/i.test(this.options.ruler.placement) ? createRuler('top', referMeasurements) as HTMLDivElement : undefined,
      bottom: /^(both|bottom)$/i.test(this.options.ruler.placement) ? createRuler('bottom', referMeasurements) as HTMLDivElement : undefined,
    }
    // Add ruler items
    for (const key in rulers) {
      if (rulers.hasOwnProperty(key) && !!rulers[key as keyof Rulers] && isElement(rulers[key as keyof Rulers])) {
        //Util.setAtts(rulers[key]!, {})
        if (this.options.ruler.hasOwnProperty(key)) {
          const rulerRows = key === 'top' ? this.options.ruler.top!.rows : this.options.ruler.bottom!.rows
          rulerRows.forEach((val: string, idx: number) => {
            const rulerOptions = {
              globalScale: this.options.scale,
              timezone: this.options.timezone,
              scale: val,
              order: idx + 1,
              minGrainWidth: convertToPixels(this.options.ruler.minGrainWidth),
              placement: key,
              firstDayOfWeek: this.options.ruler.firstDayOfWeek,
              config: key === 'top' ? this.options.ruler.top : this.options.ruler.bottom,
              filters: this.options.ruler.filters,
              maxCols: referMeasurements.rulerMaxCols,
              //particles: referMeasurements.particles,
              startDate: referMeasurements.startDate,
              endDate: referMeasurements.endDate,
            } as RulerOptions
            rulers[key as keyof Rulers]!.append(createRulerItems(rulerOptions))
            if (!!this.options.ruler.filters && this.options.ruler.filters.dayBackgroundColor || false) {
              rulers[key as keyof Rulers]!.classList.add('force-day-bg-color')
            } 
          })
        }
      }
    }

    // Generate nodes container
    const nodes: HTMLDivElement = document.createElement('div')
    nodes.classList.add('sunorhc-timeline-nodes')
    setAtts(nodes, {
      'data-grid-width': convertToPixels(this.options.ruler.minGrainWidth).toString(),
      'data-grid-height': referMeasurements.sidebarItemHeight.toString(),
      'data-grid-max-cols': referMeasurements.rulerMaxCols.toString(),
      'data-grid-max-rows': referMeasurements.sidebarItems.toString(),
      'data-range-start': referMeasurements.startDate.ts.toString(),
      'data-range-end': referMeasurements.endDate.ts.toString(),
      //'data-grid-vertical-divs': 'unkown',
      //'data-overflow-width': 'auto',
      //'data-overflow-height': 'auto',
      'data-background': this.options.layout.eventsBackground || 'plaid',
    })
    //--canvas-bg-odd: rgba(156, 163, 175, 0.1);
    //--canvas-bg-even: transparent;
    //--canvas-border: rgba(209, 213, 219, 0.5);
    let nodesContainerHeight = /^(both|top)$/.test(this.options.ruler.placement) ? referMeasurements.rulerTopHeight : 0
    nodesContainerHeight += /^(both|bottom)$/.test(this.options.ruler.placement) ? referMeasurements.rulerBottomHeight : 0
    const canvasGridWidth  = Math.floor(convertToPixels(this.options.ruler.minGrainWidth))// - (0.016129 * (1 - Math.exp(-referMeasurements.rulerMaxCols / 100000)))) * 100000) / 100000
    const canvasGridHeight = Math.floor(referMeasurements.sidebarItemHeight)// + (0.026 * (1 + Math.exp(referMeasurements.sidebarItems / 100000)))) * 100000) / 100000
    const canvasGridInterval = -1//-0.5 * (1 - Math.exp(-referMeasurements.rulerMaxCols / 500))
    setStyles(nodes, `\
      --canvas-grid-width: ${canvasGridWidth}px; \
      --canvas-grid-height: ${canvasGridHeight}px; \
      --canvas-grid-cols: ${referMeasurements.rulerMaxCols}; \
      --canvas-grid-rows: ${referMeasurements.sidebarItems}; \
      --canvas-grid-rows-half: ${referMeasurements.sidebarItems / 2}; \
      --canvas-grid-interval: ${canvasGridInterval}px; \
      width: ${referMeasurements.rulerActualWidth}px; \
      height: calc(100% - ${nodesContainerHeight}px); \
    `)

    appendNodes = filterNodesGuard([ rulers.top, nodes, rulers.bottom ])
    main.append(...appendNodes)

    const footer: HTMLDivElement = createLandmarkElement('footer', this.options.footer) as HTMLDivElement

    appendNodes = filterNodesGuard([ sidebars.left, main, sidebars.right ])
    body.append(...appendNodes)

    //console.log('render:', header, body, rulers, footer)
    appendNodes = filterNodesGuard([ header, body, footer ])
    this.fragmentNode.append(...appendNodes)
    const timelineContainer: HTMLDivElement = this.targetElement.querySelector('.sunorhc-timeline-container')!
    timelineContainer.append(this.fragmentNode)

    // Final display adjustments to the layout
    const timelineBody: HTMLDivElement = timelineContainer.querySelector('.sunorhc-timeline-body')!
    const prerenderBodyHeight = getRect(body, 'height') as number
    const sidebarActualHeight = referMeasurements.sidebarHeight + (referMeasurements.sidebarOffsetTop + referMeasurements.sidebarOffsetBottom)// = fixed actual body height
    //console.log('!:', prerenderBodyHeight, sidebarActualHeight)
    const fixedBodyHeight = prerenderBodyHeight < sidebarActualHeight
      ? Math.floor(prerenderBodyHeight) // Timeline body full height is smaller than sidebar actual full height, therefore sidebar is in overflowed.
      : sidebarActualHeight // Timeline body full height is greater than the sidebar actual full height therefore will be a margin at the bottom of the body, so should adjust the body full height to the sidebar actual full height.
    referMeasurements.bodyHeight = fixedBodyHeight
    referMeasurements.sidebarVisibleHeight = fixedBodyHeight - (referMeasurements.sidebarOffsetTop + referMeasurements.sidebarOffsetBottom)
    const nodesContainer = timelineContainer.querySelector('.sunorhc-timeline-nodes') as HTMLDivElement
    const timelineRulers: HTMLDivElement[] = Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-ruler'))
    let nodesContainerStyles: string[]
    const timelineMainCanvas: HTMLDivElement = timelineBody.querySelector('.sunorhc-timeline-main-canvas')!
    const renderedRulerTopHeight = getRect(timelineRulers.filter(elm => elm.dataset.rulerPosition === 'top')![0], 'height') as number
    const renderedRulerBottomHeight = getRect(timelineRulers.filter(elm => elm.dataset.rulerPosition === 'bottom')![0], 'height') as number
    const timelineSidebars: HTMLDivElement[] = Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-sidebar'))
    let adjustAmount: number
    let varMaxHeight: number
    let sidebarStyles: string
    let sidebarStylesArr: string[]
    //console.log('!!!:', referMeasurements)
    if (referMeasurements.sidebarVisibleHeight < referMeasurements.sidebarHeight) {
      // If the sidebar display area is overflowing.
      const updateStyles: string[] = [
        `--sidebar-max-width: ${referMeasurements.sidebarWidth}px`,
        `--sidebar-max-height: ${referMeasurements.sidebarVisibleHeight}px`,
        `margin-top: ${referMeasurements.sidebarOffsetTop}px`,
        `margin-bottom: ${referMeasurements.sidebarOffsetBottom}px`,
      ]
      setAtts(Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-sidebar')), {
        'data-sidebar-overflow': 'true',
        'style': updateStyles.join('; '),
      })
      nodesContainerStyles = (getAtts(nodesContainer, 'style')! as string).split(';').filter(e => e !== '').map(e => {
        const style = e.trim()
        return /^height\:/.test(style) ? `height: ${referMeasurements.sidebarHeight}px` : style
      })
      //console.log(nodesContainerStyles)
      timelineRulers.forEach((ruler: HTMLDivElement) => {
        const position = getAtts(ruler, 'data-ruler-position')
        //Util.setStyles(ruler, `position: sticky; ${position}: 0; z-index: 25; background-color: #ffffff;`)// dark-theme: #030712
        setAtts(ruler, { 'data-overlay-sticky': position } as { [key: string]: string })
      })
      setStyles(nodesContainer, nodesContainerStyles.join('; '))

      const reGetRenderedRulerTopHeight = timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="top"]')?.clientHeight
      const reGetRenderedRulerBottomHeight = timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')?.clientHeight
      timelineSidebars.forEach((sidebar: HTMLDivElement) => {
        adjustAmount = renderedRulerTopHeight - convertToPixels(sidebar.style.marginTop)
        //console.log('adjusting:', renderedRulerTopHeight, adjustAmount, sidebar.style.marginTop, window.getComputedStyle(sidebar).getPropertyValue('margin-top'))
        sidebarStyles = getAtts(sidebar, 'style')! as string
        sidebarStylesArr = sidebarStyles.split(/;\s?/).filter(v => v !== '')
        if (!!renderedRulerTopHeight && !renderedRulerBottomHeight) {
          //console.log('Top ruler only!!!:', renderedRulerTopHeight, reGetRenderedRulerTopHeight, renderedRulerBottomHeight, this.options.layout.outlined, prerenderBodyHeight)
          sidebarStylesArr.forEach((v, i) => {
            if (/^margin-top\:/.test(v)) {
              if (/^(inside|both)$/.test(this.options.layout.outlined ?? '')) {
                sidebarStylesArr[i] = `margin-top: ${reGetRenderedRulerTopHeight}px`
              }
            }
          })
          if (/^(inside|both)$/.test(this.options.layout.outlined ?? '')) {
            timelineMainCanvas.style.height = this.options.layout.outlined === 'inside' ? '100%' : 'calc(100% - 1px)'
            if (this.options.layout.outlined === 'both') {
              setAtts(timelineBody, { 'data-timeline-linestyle': '' })
              timelineBody.style.height = `${prerenderBodyHeight + 1}px`
              timelineMainCanvas.classList.add('border-bottom')
              sidebar.querySelector('.sunorhc-timeline-sidebar-items')!.classList.add('border-bottom')
            }
          }
        } else if (!renderedRulerTopHeight && !!renderedRulerBottomHeight) {
          //console.log('Bottom ruler only!!!:', renderedRulerTopHeight, renderedRulerBottomHeight)
          sidebarStylesArr.forEach((v, i) => {
            if (/^margin-top\:/.test(v)) {
              if (!/^(inside|both)$/.test(this.options.layout.outlined ?? '')) {
                sidebarStylesArr[i] = 'margin-top: -2px'
              } else {
                sidebarStylesArr[i] = this.options.layout.outlined === 'inside' ? 'margin-top: 0px' : 'margin-top: 0px'
              }
            }
            if (/^margin-bottom\:/.test(v)) {
              sidebarStylesArr[i] = `margin-bottom: ${reGetRenderedRulerBottomHeight}px`
            }
            if (/^(outside|none|both)$/.test(this.options.layout.outlined ?? '')) {
              if (/^--sidebar-max-height:/.test(v)) {
                varMaxHeight = parseInt(v.replace(/^--sidebar-max-height:\s(\d+)px$/, '$1'), 10)
                //console.log('!!!:', v, varMaxHeight)
                sidebarStylesArr[i] = this.options.layout.outlined === 'both' ? `--sidebar-max-height: ${varMaxHeight + 1}px` : `--sidebar-max-height: ${varMaxHeight - 4}px`
              }
            }
          })
          if (!/^(inside|both)$/.test(this.options.layout.outlined ?? '')) {
            sidebarStylesArr.push('border-bottom: none')
          } else if (this.options.layout.outlined === 'both') {
            setAtts(timelineBody, { 'data-timeline-linestyle': '' })
          }
          timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')!.style.top = '0px'
        } else if (!renderedRulerTopHeight && !renderedRulerBottomHeight) {
          //console.log('Neither has ruler!!!:', renderedRulerTopHeight, renderedRulerBottomHeight)
          sidebarStylesArr.forEach((v, i) => {
            if (/^(outside|none)$/.test(this.options.layout.outlined ?? '')) {
              if (/^--sidebar-max-height:/.test(v)) {
                varMaxHeight = parseInt(v.replace(/^--sidebar-max-height:\s(\d+)px$/, '$1'), 10)
                //console.log('!!!:', v, varMaxHeight, sidebar.clientHeight, referMeasurements.sidebarItems)
                sidebarStylesArr[i] = `--sidebar-max-height: ${varMaxHeight - referMeasurements.sidebarItems}px`
              }
            } else {
              if (/^margin-top\:/.test(v)) {
                sidebarStylesArr[i] = `margin-top: 0`
              }
            }
          })
          if (/^(outside|none)$/.test(this.options.layout.outlined ?? '')) {
            sidebarStylesArr.push('border-bottom: none')
            timelineMainCanvas.style.top = '1px'
          } else if (this.options.layout.outlined === 'inside') {
            sidebarStylesArr.push('border-bottom: none')
            timelineMainCanvas.style.height = '100%'
          } else {
            timelineMainCanvas.style.height = '100%'
            timelineMainCanvas.classList.add('border-top', 'border-bottom')
            setAtts(timelineBody, { 'data-timeline-linestyle': '' })
          }
        } else {
          //console.log('Both have rulers!!!:', renderedRulerTopHeight, reGetRenderedRulerTopHeight, renderedRulerBottomHeight, reGetRenderedRulerBottomHeight)
          if (this.options.layout.outlined !== 'inside') {
            // When outlined outside, both or none
            sidebarStylesArr.forEach((v, i) => {
              if (/^margin-top\:/.test(v)) {
                sidebarStylesArr[i] = `margin-top: ${reGetRenderedRulerTopHeight}px`
              }
              if (/^margin-bottom\:/.test(v)) {
                sidebarStylesArr[i] = `margin-bottom: ${reGetRenderedRulerBottomHeight}px`
              }
            })
            timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="top"]')!.style.top = '0'
            timelineMainCanvas.style.height = 'calc(100% + 1px)'
            if (this.options.layout.outlined !== 'both') {
              adjustAmount = 0
            } else {
              console.log('!!!:', getRect(sidebar), getRect(timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')!))
              timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"] .sunorhc-timeline-ruler-row[data-ruler-grain="max"]')!.style.height = '100%'
            }
          } else {
            // When outlined inside
            sidebarStylesArr.forEach((v, i) => {
              if (/^margin-top\:/.test(v)) {
                sidebarStylesArr[i] = `margin-top: ${reGetRenderedRulerTopHeight}px`
              }
            })
            timelineMainCanvas.style.height = 'calc(100% + 1px)'
            adjustAmount = 0
            timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"] .sunorhc-timeline-ruler-row[data-ruler-grain="max"]')!.style.borderBottomStyle = 'none'
          }
        }
        if (this.options.layout.outlineStyle === 'dotted') {
          //console.log('Border style is dotted!!!:', sidebar.dataset.sidebarPosition)
          if (sidebar.dataset.sidebarPosition === 'left') {
            sidebarStylesArr.push('border-right: none')
          } else {
            sidebarStylesArr.push('border-left: none')
          }
          timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')!.style.top = '-1.5px'
        }
        sidebarStylesArr.unshift(`--sidebar-adjust-top: ${adjustAmount}px`)
        //setAtts(sidebar, { style: `--sidebar-adjust-top: ${adjustAmount}px; ${sidebarStyles}` })
        setAtts(sidebar, { style: sidebarStylesArr.join('; ') })
      })
    } else {
      // When the sidebar is fully displaying.
      nodesContainerStyles = (getAtts(nodesContainer, 'style')! as string).split(';').filter(e => e !== '').map(e => {
        const style = e.trim()
        return /^height\:/.test(style) ? `height: ${referMeasurements.sidebarHeight + 2}px` : style
      })
      //console.log(nodesContainerStyles)
      setStyles(nodesContainer, nodesContainerStyles.join('; '))
      let stackHeight: number = 0
      timelineRulers.forEach((ruler: HTMLDivElement) => {
        const thisHeight = Math.ceil(getRect(ruler, 'height') as number)
        setStyles(ruler, { height: `${thisHeight}px` })
        stackHeight += thisHeight
      })
      //console.log(stackHeight, stackHeight + referMeasurements.sidebarHeight)
      setStyles(timelineBody, { height: `${Math.floor(stackHeight + referMeasurements.sidebarHeight)}px` })

      timelineSidebars.forEach((sidebar: HTMLDivElement) => {
        adjustAmount = renderedRulerTopHeight - convertToPixels(sidebar.style.marginTop)
        //console.log('adjusting:', renderedRulerTopHeight, adjustAmount, sidebar.style.marginTop, window.getComputedStyle(sidebar).getPropertyValue('margin-top'))
        sidebarStyles = getAtts(sidebar, 'style')! as string
        sidebarStylesArr = sidebarStyles.split(/;\s?/).filter(v => v !== '')
        if (!!renderedRulerTopHeight && !renderedRulerBottomHeight) {
          console.log('Top ruler only!!!:', renderedRulerTopHeight, renderedRulerBottomHeight, this.options.layout.outlined, prerenderBodyHeight)
          if (/^(inside|both)$/.test(this.options.layout.outlined ?? '')) {
            timelineMainCanvas.style.height = '100%'
            if (this.options.layout.outlined === 'both') {
              timelineBody.style.height = `${prerenderBodyHeight + 1}px`
              timelineMainCanvas.classList.add('border-bottom')
              sidebar.querySelector('.sunorhc-timeline-sidebar-items')!.classList.add('border-bottom')
            }
          }
        } else if (!renderedRulerTopHeight && !!renderedRulerBottomHeight) {
          console.log('Bottom ruler only!!!:', renderedRulerTopHeight, renderedRulerBottomHeight)
          sidebarStylesArr.forEach((v, i) => {
            if (/^margin-top\:/.test(v)) {
              sidebarStylesArr[i] = this.options.layout.outlined === 'inside' ? 'margin-top: -2px' : 'margin-top: -1px'
            }
            if (/^margin-bottom\:/.test(v)) {
              sidebarStylesArr[i] = `margin-bottom: ${renderedRulerBottomHeight}px`
            }
          })
          timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')!.style.top = '-1.75px'
          timelineMainCanvas.style.height = '100%'
        } else if (!renderedRulerTopHeight && !renderedRulerBottomHeight) {
          //console.log('Neither has ruler!!!:', renderedRulerTopHeight, renderedRulerBottomHeight)
          // Nothing for now
        } else {
          //console.log('Both have rulers!!!:', renderedRulerTopHeight, renderedRulerBottomHeight)
          // Nothing for now
        }
        if (this.options.layout.outlineStyle === 'dotted') {
          //console.log('Border style is dotted!!!:', sidebar.dataset.sidebarPosition)
          if (sidebar.dataset.sidebarPosition === 'left') {
            sidebarStylesArr.push('border-right: none')
          } else {
            sidebarStylesArr.push('border-left: none')
          }
          timelineContainer.querySelector<HTMLDivElement>('.sunorhc-timeline-ruler[data-ruler-position="bottom"]')!.style.top = '-1.5px'
        }
        sidebarStylesArr.unshift(`--sidebar-adjust-top: ${adjustAmount}px`)
        //setAtts(sidebar, { style: `--sidebar-adjust-top: ${adjustAmount}px; ${sidebarStyles}` })
        setAtts(sidebar, { style: sidebarStylesArr.join('; ') })
      })
    }
    //console.log(Util.getRect(body, 'height'), referMeasurements, this.measurements)

    // All elements have been completely rendered.
    this.measurements = referMeasurements
    timelineContainer.classList.remove('preparing')
  }

  /**
   * Optimizes the event node data retrieved and serve on timeline with saving as cache to web storage.
   * If given true to argument will force clearing of any existing cache before retrieving the event node data.
   * @param {boolean} forceClearCache 
   * @returns {Promise<void>}
   * @private
   */
  private async serveEventNodes(forceClearCache: boolean = false): Promise<void> {
    const cacheKey = `${this.elementId}:cachedEvents`
    let result: any = null
    let eventIds: string[] = []
    if (forceClearCache) {
      // This process is not yet implemented.
      this.logger.log('Force clear cache!')

    }
    try {
      if (typeof this.options.events === 'string' && this.options.events !== '') {
        if (this.options.events === cacheKey) {
          // Read event nodes data from cached storage.
          let expiredTime: number = -1
          if (/^\d+$/i.test(String(this.options.effects.cacheExpiration))) {
            expiredTime = Number(this.options.effects.cacheExpiration)
          } else if (/^always$/i.test(String(this.options.effects.cacheExpiration))) {
            expiredTime = 0
          }
          result = loadFromStorage(this.options.useStorage, cacheKey, expiredTime)
          if (result !== null && Array.isArray(result) && result.length !== 0) {
            this.logger.log('Loaded cached event data:', result)
            this.options.events = result
          }
        }
        if (!isObject(this.options.events) && this.options.events !== cacheKey) {
          // Fetch data from the specified destination.
          result = await fetchData({ url: this.options.events as string })
          if (!result || !Array.isArray(result) || result.length == 0) {
            throw new Error('The fetched data does not contain any event nodes.')
          }
          this.logger.log('Fetched external event data:', result)
          this.options.events = result
        }
      } else if (Array.isArray(this.options.events) && this.options.events.length == 0) {
        throw new Error('No enabled events within the current timeline display range.')
      }

      if (!isEmptyObject(this.options.events)) {
        // First, optimize the original event data stored in `options.events`.
        this.eventNodes = [];
        (this.options.events as object[]).forEach((item: any, index: number) => {
          let checkedEventNode = validateTimelineOptions<EventNode>(item, validatorEventNode) as Partial<EventNode>
          if (checkedEventNode.hasOwnProperty('eventId')) {
            eventIds.push(checkedEventNode.eventId!)
          } else {
            const newEventId = `EventNode:${String(index + 1)}`
            checkedEventNode.eventId = newEventId
            eventIds.push(newEventId)
          }
          if (checkedEventNode.hasOwnProperty('start')) {
            // Events without a start datetime is disabled.
            // Also, event with invalid start datetime that cannot be parsed are invalid too.
            const monthNames = this.options.ruler.filters?.monthNames ?? undefined
            const dayNames = this.options.ruler.filters?.dayNames ?? undefined
            const firstDayOfWeek = this.options.ruler.firstDayOfWeek || 0
            const parsedStartDate = parseDateTime(checkedEventNode.start!, this.options.timezone, monthNames, dayNames, firstDayOfWeek)
            if (!!parsedStartDate) {
              checkedEventNode.s = parsedStartDate
              //console.log('Allowed valid event:', checkedEventNode)
              // Calculate internal reference value of event node.
              const finalEventNode = optimizeEventNode(checkedEventNode, this.options, this.measurements as Measures)
              this.eventNodes.push(finalEventNode)
            }
          }
        })

        // Check and optimize event ID uniqueness.
        const duplicateIds = getDuplicateValues(eventIds)
        if (duplicateIds.length > 0) {
          duplicateIds.forEach((duplicateId: string) => {
            let matchCount = 0
            for (let item of this.eventNodes) {
              const eventObj = item as EventNode
              if (eventObj.eventId === duplicateId) {
                matchCount++
                if (matchCount > 1) {
                  eventObj.eventId = `EventNode:${String(eventObj.uid)}`
                  //console.log('Updated event Id:', duplicateId, eventObj.eventId, matchCount)
                }
              }
            }
          })
        }

        // Then, it cache the registered all events in web storage.
        saveToStorage(this.options.useStorage, cacheKey, this.options.events, true)
        this.options.events = cacheKey
      }

    } catch (error) {
      console.warn(error)
    } finally {
      const nodesContainer: HTMLDivElement = this.targetElement.querySelector('.sunorhc-timeline-nodes')!
      placeEventNodes(nodesContainer, this.eventNodes as EventNode[])
      this.logger.log('serveEventNodes:', this.eventNodes, this.options.events, this.options.effects.presentTime)
      if (this.options.effects.presentTime) {
        showPresentTimeMarker(this.targetElement)
      }
    }
  }

  /**
   * Start watching the rendering mode changing.
   * @private
   */
  private runChangeThemeWatcher(): void {
    const targetContainer = this.targetElement.querySelector('.sunorhc-timeline-container')!
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      //console.log('changeTheme: Dark mode now')
      targetContainer.classList.add('dark-theme')
    } else {
      //console.log('changeTheme: Light mode now')
      targetContainer.classList.remove('dark-theme')
    }
    window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', (event: MediaQueryListEvent) => {
      const isDarkMode: boolean = event.matches
      //console.log('Changed mode:', isDarkMode ? 'dark' : 'light', event)
      if (isDarkMode) {
        targetContainer.classList.add('dark-theme')
      } else {
        targetContainer.classList.remove('dark-theme')
      }
    })
    // Hooks when changing mode with body class; c.f. 'darkmode--activated' for darkmode.js
    watcher(document.body, (mutations) => {
      const mutation = mutations as unknown as MutationRecord
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const targetElm = mutation.target as HTMLBodyElement
        if (targetElm.classList.contains(this.options.theme.hookChangeModeClass!)) {
          //console.log('Toggled to darkmode with body class:', this.options.theme.hookChangeModeClass)
          targetContainer.classList.add('dark-theme')
        } else {
          //console.log('Toggled to lightmode with body class:', this.options.theme.hookChangeModeClass)
          targetContainer.classList.remove('dark-theme')
        }
      }
    }, { attributes: true, childList: false, subtree: false })
  }

  /**
   * Register various event listeners for timeline components.
   * @private
   */
  private registerEventListeners(): void {
    const referMeasurements: { [key: string]: any } = deepCloneObject(this.measurements)
    this.logger.log('registerEventListeners:', referMeasurements)

    // Horizontal scrolling is required if the main canvas area overflows.
    if (referMeasurements.rulerActualWidth > referMeasurements.rulerVisibleWidth) {
      dragScroll(this.targetElement)

      doAlignment(this.targetElement, this.options.effects.defaultAlignment)
    }

    // Vertical scrolling is required if the sidebar and main canvas area overflows.
    if (referMeasurements.sidebarHeight > referMeasurements.sidebarVisibleHeight) {
      wheelScroll(this.targetElement)
    }

    if (this.options.zoomable) {
      dblclickZoom(this.targetElement, this.options)
    }

    //Util.onStickyRulerItems(this.targetElement)

    if (this.options.effects.hoverEvent) {
      onHoverTooltip(this.targetElement, this.options, this.eventNodes as EventNode[])
    }

    if (this.options.effects.onClickEvent !== 'none') {
      clickOpener(this.targetElement, this.options, this.eventNodes as EventNode[])
    }
  }

  // public methods

  async initialized(callback?: (instance: Timeline) => void): Promise<void> {
    if (callback) {
      // Fires after rendering container and before placing events.
      this.logger.log('Callbackable "initialized" hook:')
      await Promise.resolve(callback(this))
    }
  }

  async reload(newOptions?: Partial<TimelineOptions>, callback?: (instance: Timeline) => void): Promise<void> {
    this.logger.log('Called "reload"', this.targetElement)
    // Keep container display size before and after reload.
    const timelineRect = getRect(this.targetElement) as DOMRect
    const cachedStyles = getAtts(this.targetElement, 'style')
    setStyles(this.targetElement, `min-width: ${timelineRect.width}px; min-height: ${timelineRect.height}px; ${cachedStyles}`)
    // Remove all children in the timeline container element.
    setContent(this.targetElement, '', false)
    try {
      if (newOptions) {
        //console.log('reload!!!:', newOptions)
        const updateOptions = deepMergeObjects(this.options, newOptions)
        if (newOptions.hasOwnProperty('start') && newOptions.start instanceof Date) {
          updateOptions.start = newOptions.start
        }
        if (newOptions.hasOwnProperty('end') && newOptions.end instanceof Date) {
          updateOptions.end = newOptions.end
        }
        this.options = updateOptions
      } else {
        this.options = await Promise.resolve(this.initOptions())
      }
      this.measurements = await Promise.resolve(this.initMeasure())

      // Render timeline component.
      await Promise.resolve(this.render())

      // Here is the "initialized" hook point immediately after initialization.
      this.initialized()

      // Load event nodes, cache them after parsing, and place them on the DOM.
      await Promise.resolve(this.serveEventNodes())

      // Registration of various event listeners.
      this.registerEventListeners()

      // Start monitoring rendering mode.
      this.runChangeThemeWatcher()

    } catch (error) {
      console.error('Failed to create timeline:', error)
      // Hide the dispatcher element itself for injecting the timeline.
      setStyles(this.targetElement, { display: 'none' })
    } finally {
      // Util.setStyles(this.targetElement, cachedStyles as string)
      if (callback) {
        // Fires after reload?
        await Promise.resolve(callback(this))
      }
    }
  }

  async align(alignment: Alignment, callback?: (instance: Timeline) => void): Promise<void> {
    doAlignment(this.targetElement, alignment)
    if (callback) {
      // Fires after alignment.
      await Promise.resolve(callback(this))
    }
  }

  async zoom(
    newScaleOptions: ZoomScaleOptions,
    callback?: (instance: Timeline) => void
  ): Promise<void> {
    if (
      typeof newScaleOptions !== 'object' ||
      typeof newScaleOptions.scale !== 'string' ||
      (typeof newScaleOptions.start !== 'string' && !(newScaleOptions.start instanceof Date))
    ) {
      return Promise.reject(new Error('Invalid zoom option.'))
    }
    //console.log('zoom!!!:', this.options.scale, '->', newScaleOptions.scale, newScaleOptions)
    this.reload({ start: newScaleOptions.start, end: newScaleOptions.end, scale: newScaleOptions.scale, ruler: newScaleOptions.ruler })
    if (callback) {
      // Fires after zoom?
      await Promise.resolve(callback(this))
    }
  }

}
