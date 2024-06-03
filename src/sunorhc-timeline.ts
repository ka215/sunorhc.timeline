import * as packageJson from '../package.json'
import * as Def from './types/definitions'
import * as Util from './utils'
import { LoggerService } from './utils/logger'

// Get Env
const isDev = process.env.NODE_ENV === 'development'
const defaultLogFilePath = isDev ? 'dev-log.log' : 'prod-log.log'
//console.log('isDev:', isDev, process.env.NODE_ENV, defaultLogFilePath)

// Set default values as options initialization
const defaultOptions: Def.TimelineOptions = {
  start: 'currently',
  end: 'auto',
  timezone: 'UTC',
  //type: 'mixed',
  scale: 'day',
  file: null,
  header: { display: false },
  footer: { display: false },
  //range: 'auto',
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
    //truncateLowers: false,
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
    //firstDayOfWeek: 0,
    hoverEvent: true,
    onClickEvent: 'normal',
  },
  theme: {
    name: 'default',
  },
  useStorage: 'sessionStorage',
  zoomable: false,
  //wrapScale: true,
  debug: isDev,
}

export class SunorhcTimeline implements Def.Timeline {
  // Application Version
  public static readonly VERSION: string = packageJson.version

  readonly elementId: string
  targetElement: HTMLDivElement
  fragmentNode: DocumentFragment
  options = defaultOptions

  protected inputOptions: Partial<Def.TimelineOptions>
  protected loadOptions = null
  protected measurements = {}
  protected eventNodes: object[] = []
  //protected test: number

  private logger: LoggerService

  /**
   * The constructor cannot be called directly from any methods other than self own.
   * 
   * @param {string} elementId - The ID of the HTML element.
   * @param {Def.TimelineOptions} inputOptions - Optional timeline options.
   * @private
   */
  private constructor(elementId: string, inputOptions?: Partial<Def.TimelineOptions>) {
    this.elementId = elementId
    this.targetElement = document.querySelector<HTMLDivElement>(`#${elementId}`)!
    this.fragmentNode  = document.createDocumentFragment()
    this.inputOptions  = inputOptions as Partial<Def.TimelineOptions>

    const loggerOptions = {
      debug: (this.inputOptions.hasOwnProperty('debug') ? this.inputOptions.debug : isDev) || false,
      logFilePath: defaultLogFilePath
    }
    this.logger = new LoggerService(loggerOptions)
    //this.test = 0
  }

  /**
   * Factory method for instantiating this class.
   * 
   * @param {string} elementId - The ID of the HTML element.
   * @param {Def.TimelineOptions} inputOptions - Optional timeline options.
   * @returns {Promise<SunorhcTimeline>} A Promise that resolves to an instance of SunorhcTimeline.
   * @static
   */
  static async create(elementId: string, inputOptions?: Def.TimelineOptions): Promise<SunorhcTimeline> {
    const instance = new SunorhcTimeline(elementId, inputOptions)
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
      Util.setStyles(instance.targetElement, { display: 'none' })
    }
    return instance
  }

  /**
   * Initializes the timeline options.
   * 
   * @returns {Promise<Def.TimelineOptions>} A Promise that resolves to the timeline options.
   * @private
   */
  private async initOptions(): Promise<Def.TimelineOptions> {
    // Options initialization
    let fixedOptions = Util.deepMergeObjects({}, this.options)

    // First, extract the options from the data-options attribute.
    if (this.targetElement.dataset.options) {
      const datasetOptions = Util.deserialize(this.targetElement.dataset.options)
      if (Util.isObject(datasetOptions)) {
        const validOptions = Util.validateTimelineOptions(datasetOptions)
        fixedOptions = Util.deepMergeObjects(fixedOptions, validOptions)
      } else if (typeof datasetOptions === 'string') {
        fixedOptions = Util.deepMergeObjects(fixedOptions, { file: datasetOptions })
      }
    }

    // Second, it overrides the options passed in the constructor arguments.
    if (this.inputOptions && Util.isObject(this.inputOptions) && !Util.isEmptyObject(this.inputOptions)) {
      fixedOptions = Util.deepMergeObjects(fixedOptions, this.inputOptions)
    }

    // Finally, if an external configuration file is specified, it is fetched and overridden.
    if (fixedOptions.hasOwnProperty('file') && typeof fixedOptions.file === 'string' && fixedOptions.file !== '') {
      const result = await Util.fetchData({ url: fixedOptions.file })
      fixedOptions = Util.deepMergeObjects(fixedOptions, Util.validateTimelineOptions<Def.TimelineOptions>(result))
      this.logger.log('Fetched options file:', result, Util.validateTimelineOptions<Def.TimelineOptions>(result), fixedOptions)
    }

    this.logger.info(`%cSnorch.Timeline ver.${SunorhcTimeline.VERSION} is booting now...`, 'color: #0284c7; font-weight: 700;')
    return fixedOptions
  }

  /**
   * Getter to retrieve the current options.
   * @returns {Def.TimelineOptions} The current timeline options.
   */
  getOptions(toClone: boolean = false): Def.TimelineOptions {
    return toClone ? Util.deepCloneObject(this.options) : this.options
  }

  /**
   * Measure the rendering area and calculate.
   * @returns {Promise<Error | Def.Measures>} A Promise that resolves options for rendering or rejects as error handling.
   * @private
   */
  private async initMeasure(): Promise<Error | Def.Measures> {
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
    Util.setAtts(timelineContainer, containerAtts)
    const containerWidth  = this.options.layout.width || 'auto'
    const containerHeight = this.options.layout.height || 'auto'
    const containerStyles: string[] = [
      'width: ' + (typeof containerWidth  === 'number' ? `${containerWidth}px` : containerWidth),
      'height: ' + (typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight),
    ]
    if (!!this.options.layout.outlineStyle) {
      containerStyles.push(`--outline-style: ${this.options.layout.outlineStyle}`)
    }
    //console.log('initMeasure:', containerAtts, containerStyles)
    Util.setStyles(timelineContainer, containerStyles.join('; '))
    this.fragmentNode.append(timelineContainer)
    this.targetElement.append(this.fragmentNode)

    try {
      // Parse start date
      const optionStartDate = Util.getStartDatetime(this.options.start, this.options.timezone, this.options.scale)
      if (optionStartDate instanceof Error) {
        throw optionStartDate
      }
      // Parse end date
      const optionEndDate = Util.getEndDatetime(this.options.end, this.options.timezone, this.options.scale, optionStartDate)
      if (optionEndDate instanceof Error) {
        throw optionEndDate
      }
      const startDate = Util.parseDateTime(optionStartDate, this.options.timezone)
      const endDate   = Util.parseDateTime(optionEndDate, this.options.timezone)
      // Calculate the maximum granularity number of the ruler from the start and end range based on the scale
      const maxParticles = Util.getParticles(optionStartDate, optionEndDate)
      const scaleParticle = Util.getParticles(optionStartDate, optionEndDate, this.options.scale) as number

      const targetRect = Util.getRect(this.targetElement)
      //await Util.reflow(timelineContainer)
      const containerRect = Util.cloneObject(Util.getRect(timelineContainer)) as unknown as DOMRect
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
        sidebarWidth: Util.convertToPixels(this.options.sidebar.width),
        sidebarHeight: Util.convertToPixels(this.options.sidebar.itemHeight) * this.options.sidebar.items.length,// = sidebar actual height (full items height)
        sidebarVisibleHeight: undefined,// unknown at the time of execution of this process.
        sidebarOffsetTop: /^(both|top)/i.test(this.options.ruler.placement) ? (this.options.ruler.top?.rows?.length || 0) * Util.convertToPixels(this.options.ruler.top?.rowHeight) : 0,
        sidebarOffsetBottom: /^(both|bottom)/i.test(this.options.ruler.placement) ? (this.options.ruler.bottom?.rows?.length || 0) * Util.convertToPixels(this.options.ruler.bottom?.rowHeight) : 0,
        sidebarItemHeight: Util.convertToPixels(this.options.sidebar.itemHeight),// one item height
        sidebarItems: this.options.sidebar.items.length,
        // Ruler layouts
        rulerVisibleWidth: containerRect.width - (/^both$/i.test(this.options.sidebar.placement)
          ? Util.convertToPixels(this.options.sidebar.width) * 2
          : /^(left|right)$/i.test(this.options.sidebar.placement) ? Util.convertToPixels(this.options.sidebar.width) : 0),
        rulerActualWidth: Util.convertToPixels(this.options.ruler.minGrainWidth) * scaleParticle,
        rulerTopRows: (this.options.ruler.top?.rows?.length || 0),
        rulerBottomRows: (this.options.ruler.bottom?.rows?.length || 0),
        rulerTopHeight: (this.options.ruler.top?.rows?.length || 0) * Util.convertToPixels(this.options.ruler.top?.rowHeight),
        rulerBottomHeight: (this.options.ruler.bottom?.rows?.length || 0) * Util.convertToPixels(this.options.ruler.bottom?.rowHeight),
        rulerMaxCols: scaleParticle,
        /*
        test: {
          elm: this.targetElement,
          frag: this.fragmentNode,
          date: new Date('2024-05-13T15:00:00Z'),
          reg: new RegExp(/^some$/, 'i'),
        },*/
      } as Def.Measures
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
    const referMeasurements = Util.deepCloneObject(this.measurements) as Def.Measures
    const filterNodesGuard = (nodes: any): Node[] => nodes.filter((e: Node): e is HTMLElement => !!e)
    let appendNodes = null
    //console.log('render:', referMeasurements )

    const header: HTMLDivElement = Util.createLandmarkElement('header', this.options.header) as HTMLDivElement

    // Generate timeline body
    const body: HTMLDivElement = document.createElement('div')
    body.classList.add('sunorhc-timeline-body')
    Util.setAtts(body, {
      'data-timeline-outlined':  this.options.layout && /^(inside|both)$/.test(this.options.layout.outlined!) ? 'true' : 'false',
      'data-timeline-linestyle': this.options.layout ? this.options.layout.outlineCorner! : '',
    })
    if (this.options.layout && this.options.layout.outlineStyle) {
      Util.setStyles(body, `--outline-style: ${this.options.layout.outlineStyle}`)
    }

    // Generate sidebar containers
    type Sidebars = { left?: HTMLDivElement; right?: HTMLDivElement; };
    //const sidebars: { [key: string]?: HTMLDivElement/* | undefined*/ } = {
    const sidebars: Sidebars = {
      left:  /^(both|left)$/i.test(this.options.sidebar.placement) ? Util.createSidebar('left', referMeasurements) as HTMLDivElement : undefined,
      right: /^(both|right)$/i.test(this.options.sidebar.placement) ? Util.createSidebar('right', referMeasurements) as HTMLDivElement : undefined,
    }
    // Add sidebar items
    for (const key in sidebars) {
      if (sidebars.hasOwnProperty(key) && !!sidebars[key as keyof Sidebars] && Util.isElement(sidebars[key as keyof Sidebars])) {
        /*
        Util.setAtts(sidebars[key]!, {
          //'data-sidebar-sticky':  this.options.sidebar.sticky ? 'fixed' : 'static',// no use
          //'data-sidebar-overlay': this.options.sidebar.overlay ? 'true' : 'false',// no use
          //'data-sidebar-oveflow': 'false',// Disabled at the time of this process
        })
        */
        const sidebarItems = Util.createSidebarItems(this.options.sidebar)
        // Adjust outlines
        if (this.options.ruler.placement === 'bottom') {
          if (this.options.layout.outlined === 'inside') {
            Util.setStyles(sidebarItems, { borderTop: 'none' })
          }
        }
        sidebars[key as keyof Sidebars]!.append(sidebarItems)
      }
    }

    // Generate timeline main canvas
    const main: HTMLDivElement = document.createElement('div')
    main.classList.add('sunorhc-timeline-main-canvas')
    if (this.options.layout.hideScrollbar!) {
      Util.setAtts(main, { 'data-hide-scrollbar': 'true' })
    }
    const adjustMainStyles: string[] = [`--main-visible-width: ${referMeasurements.rulerVisibleWidth}px`]
    // Adjust outlines
    if (this.options.ruler.placement === 'bottom') {
      if (this.options.layout.outlined === 'both') {
        adjustMainStyles.push(`border-top: ${this.options.layout?.outlineStyle || 'solid'} 1px var(--border-color)`)// #9ca3cf
      }
    }
    Util.setStyles(main, adjustMainStyles.join('; '))

    // Generate ruler container
    type Rulers = { top?: HTMLDivElement; bottom?: HTMLDivElement; };
    //const rulers: { [key: string]: HTMLDivElement | undefined } = {
    const rulers: Rulers = {
      top:    /^(both|top)$/i.test(this.options.ruler.placement) ? Util.createRuler('top', referMeasurements) as HTMLDivElement : undefined,
      bottom: /^(both|bottom)$/i.test(this.options.ruler.placement) ? Util.createRuler('bottom', referMeasurements) as HTMLDivElement : undefined,
    }
    // Add ruler items
    for (const key in rulers) {
      if (rulers.hasOwnProperty(key) && !!rulers[key as keyof Rulers] && Util.isElement(rulers[key as keyof Rulers])) {
        //Util.setAtts(rulers[key]!, {})
        if (this.options.ruler.hasOwnProperty(key)) {
          const rulerRows = key === 'top' ? this.options.ruler.top!.rows : this.options.ruler.bottom!.rows
          rulerRows.forEach((val: string, idx: number) => {
            const rulerOptions = {
              globalScale: this.options.scale,
              timezone: this.options.timezone,
              scale: val,
              order: idx + 1,
              minGrainWidth: Util.convertToPixels(this.options.ruler.minGrainWidth),
              placement: key,
              config: key === 'top' ? this.options.ruler.top : this.options.ruler.bottom,
              filters: this.options.ruler.filters,
              maxCols: referMeasurements.rulerMaxCols,
              //particles: referMeasurements.particles,
              startDate: referMeasurements.startDate,
              endDate: referMeasurements.endDate,
            } as Def.RulerOptions
            rulers[key as keyof Rulers]!.append(Util.createRulerItems(rulerOptions))
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
    Util.setAtts(nodes, {
      'data-grid-width': Util.convertToPixels(this.options.ruler.minGrainWidth).toString(),
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
    Util.setStyles(nodes, `
      --canvas-grid-width: ${Util.convertToPixels(this.options.ruler.minGrainWidth) - 0.016129}px;
      --canvas-grid-height: ${referMeasurements.sidebarItemHeight + 0.026}px;
      --canvas-grid-rows: ${referMeasurements.sidebarItems};
      --canvas-grid-rows-half: ${referMeasurements.sidebarItems / 2};
      width: ${referMeasurements.rulerActualWidth}px;
      height: calc(100% - ${nodesContainerHeight}px);
    `)

    appendNodes = filterNodesGuard([ rulers.top, nodes, rulers.bottom ])
    main.append(...appendNodes)

    const footer: HTMLDivElement = Util.createLandmarkElement('footer', this.options.footer) as HTMLDivElement

    appendNodes = filterNodesGuard([ sidebars.left, main, sidebars.right ])
    body.append(...appendNodes)

    //console.log('render:', header, body, rulers, footer)
    appendNodes = filterNodesGuard([ header, body, footer ])
    this.fragmentNode.append(...appendNodes)
    const timelineContainer: HTMLDivElement = this.targetElement.querySelector('.sunorhc-timeline-container')!
    timelineContainer.append(this.fragmentNode)

    // Final display adjustments to the layout
    const prerenderBodyHeight = Util.getRect(body, 'height') as number
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
    if (referMeasurements.sidebarVisibleHeight < referMeasurements.sidebarHeight) {
      const updateStyles: string[] = [
        `--sidebar-max-width: ${referMeasurements.sidebarWidth}px`,
        `--sidebar-max-height: ${referMeasurements.sidebarVisibleHeight}px`,
        `margin-top: ${referMeasurements.sidebarOffsetTop}px`,
        `margin-bottom: ${referMeasurements.sidebarOffsetBottom}px`,
      ]
      Util.setAtts(Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-sidebar')), {
        'data-sidebar-overflow': 'true',
        'style': updateStyles.join('; '),
      })
      nodesContainerStyles = (Util.getAtts(nodesContainer, 'style')! as string).split(';').filter(e => e !== '').map(e => {
        const style = e.trim()
        return /^height\:/.test(style) ? `height: ${referMeasurements.sidebarHeight}px` : style
      })
      //console.log(nodesContainerStyles)
      timelineRulers.forEach((ruler: HTMLDivElement) => {
        const position = Util.getAtts(ruler, 'data-ruler-position')
        //Util.setStyles(ruler, `position: sticky; ${position}: 0; z-index: 25; background-color: #ffffff;`)// dark-theme: #030712
        Util.setAtts(ruler, { 'data-overlay-sticky': position } as { [key: string]: string })
      })
      Util.setStyles(nodesContainer, nodesContainerStyles.join('; '))
    } else {
      nodesContainerStyles = (Util.getAtts(nodesContainer, 'style')! as string).split(';').filter(e => e !== '').map(e => {
        const style = e.trim()
        return /^height\:/.test(style) ? `height: ${referMeasurements.sidebarHeight + 2}px` : style
      })
      //console.log(nodesContainerStyles)
      Util.setStyles(nodesContainer, nodesContainerStyles.join('; '))
      const timelineBody: HTMLDivElement = timelineContainer.querySelector('.sunorhc-timeline-body')!
      let stackHeight: number = 0
      timelineRulers.forEach((ruler: HTMLDivElement) => {
        const thisHeight = Math.ceil(Util.getRect(ruler, 'height') as number)
        Util.setStyles(ruler, { height: `${thisHeight}px` })
        stackHeight += thisHeight
      })
      //console.log(stackHeight, stackHeight + referMeasurements.sidebarHeight)
      Util.setStyles(timelineBody, { height: `${Math.floor(stackHeight + referMeasurements.sidebarHeight)}px` })
      /*
      if (referMeasurements.rulerTopRows > 6) {
        const renderedRulerTopHeight = Util.getRect(timelineRulers.filter(elm => elm.dataset.rulerPosition === 'top')![0], 'height') as number
        const timelineSidebars: HTMLDivElement[] = Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-sidebar'))
        timelineSidebars.forEach((sidebar: HTMLDivElement) => {
          const adjustAmount: number = renderedRulerTopHeight - Util.convertToPixels(sidebar.style.marginTop)
          console.log('adjusting:', renderedRulerTopHeight, adjustAmount, sidebar.style.marginTop, window.getComputedStyle(sidebar).getPropertyValue('margin-top'))
          const sidebarStyles = Util.getAtts(sidebar, 'style')! as string
          Util.setAtts(sidebar, { style: `--sidebar-adjust-top: ${adjustAmount}px; ${sidebarStyles}` })
        })
      }
      */
    }
    const renderedRulerTopHeight = Util.getRect(timelineRulers.filter(elm => elm.dataset.rulerPosition === 'top')![0], 'height') as number
    const timelineSidebars: HTMLDivElement[] = Array.from(timelineContainer.querySelectorAll('.sunorhc-timeline-sidebar'))
    timelineSidebars.forEach((sidebar: HTMLDivElement) => {
      const adjustAmount: number = renderedRulerTopHeight - Util.convertToPixels(sidebar.style.marginTop)
      //console.log('adjusting:', renderedRulerTopHeight, adjustAmount, sidebar.style.marginTop, window.getComputedStyle(sidebar).getPropertyValue('margin-top'))
      const sidebarStyles = Util.getAtts(sidebar, 'style')! as string
      Util.setAtts(sidebar, { style: `--sidebar-adjust-top: ${adjustAmount}px; ${sidebarStyles}` })
    })
    //console.log(Util.getRect(body, 'height'), referMeasurements, this.measurements)

    // All elements have been completely rendered.
    this.measurements = referMeasurements
    timelineContainer.classList.remove('preparing')
  }

  private async serveEventNodes(forceClearCache: boolean = false): Promise<void> {
    const cacheKey = `${this.elementId}:cachedEvents`
    let result: any = null
    let eventIds: string[] = []
    if (forceClearCache) {
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
          result = Util.loadFromStorage(this.options.useStorage, cacheKey, expiredTime)
          if (result !== null && Array.isArray(result) && result.length !== 0) {
            this.logger.log('Loaded cached event data:', result)
            this.options.events = result
          }
        }
        if (!Util.isObject(this.options.events) && this.options.events !== cacheKey) {
          // Fetch data from the specified destination.
          result = await Util.fetchData({ url: this.options.events as string })
          if (!result || !Array.isArray(result) || result.length == 0) {
            throw new Error('The fetched data does not contain any event nodes.')
          }
          this.logger.log('Fetched external event data:', result)
          this.options.events = result
        }
      } else if (Array.isArray(this.options.events) && this.options.events.length == 0) {
        throw new Error('No enabled events within the current timeline display range.')
      }

      if (!Util.isEmptyObject(this.options.events)) {
        // First, optimize the original event data stored in `options.events`.
        this.eventNodes = [];
        (this.options.events as object[]).forEach((item: any, index: number) => {
          let checkedEventNode = Util.validateTimelineOptions<Def.EventNode>(item, Util.validatorEventNode) as Partial<Def.EventNode>
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
            const parsedStartDate = Util.parseDateTime(checkedEventNode.start!, this.options.timezone)
            if (!!parsedStartDate) {
              checkedEventNode.s = parsedStartDate
              //console.log('Allowed valid event:', checkedEventNode)
              // Calculate internal reference value of event node.
              const finalEventNode = Util.optimizeEventNode(checkedEventNode, this.options, this.measurements)
              this.eventNodes.push(finalEventNode)
            }
          }
        })

        // Check and optimize event ID uniqueness.
        const duplicateIds = Util.getDuplicateValues(eventIds)
        if (duplicateIds.length > 0) {
          duplicateIds.forEach((duplicateId: string) => {
            let matchCount = 0
            for (let item of this.eventNodes) {
              const eventObj = item as Def.EventNode
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
        Util.saveToStorage(this.options.useStorage, cacheKey, this.options.events, true)
        this.options.events = cacheKey
      }

    } catch (error) {
      console.warn(error)
    } finally {
      this.logger.log('serveEventNodes:', this.eventNodes, this.options.events)
      const nodesContainer: HTMLDivElement = this.targetElement.querySelector('.sunorhc-timeline-nodes')!
      Util.placeEventNodes(nodesContainer, this.eventNodes)
      //nodesContainer.append()
      /* simulate reload
      if (this.test < 1) {
        this.test++
        this.serveEventNodes()
      }
      */
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
    Util.watcher(document.body, (mutations) => {
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
    const referMeasurements: { [key: string]: any } = Util.deepCloneObject(this.measurements)
    this.logger.log('registerEventListeners:', referMeasurements)

    // Horizontal scrolling is required if the main canvas area overflows.
    if (referMeasurements.rulerActualWidth > referMeasurements.rulerVisibleWidth) {
      Util.dragScroll(this.targetElement)

      //Util.doAlignment(this.targetElement, this.options.effects.defaultAlignment)
      Util.doAlignment(this.targetElement, 'center')// test
    }

    // Vertical scrolling is required if the sidebar and main canvas area overflows.
    if (referMeasurements.sidebarHeight > referMeasurements.sidebarVisibleHeight) {
      Util.wheelScroll(this.targetElement)
    }


    Util.onHoverTooltip(this.targetElement, this.eventNodes as Def.EventNodes)

  }

  initialized(): void {
    this.logger.log('Callbackable "initialized" hook:', this.options, this.targetElement)


  }

}
