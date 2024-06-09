export function setupTester(element: HTMLDivElement) {
  element.innerHTML = `
<div class="inline-flex items-center justify-center w-full">
  <hr class="w-full h-px my-4 bg-gray-300 border-0 dark:bg-gray-400">
  <h3 class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Timeline Instance Controller</h3>
</div>
<div class="mt-4 mb-2 flex flex-wrap justify-start gap-4">
  <div class="flex flex-col items-start w-28 h-max">
    <label for="toggle-rtl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direction:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-rtl" type="checkbox" name="dir-rtl" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">on RTL</span>
    </label>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-timezone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">TimeZone:</label>
    <div for="select-timezone" class="w-36 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-timezone" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Example TimeZone</option>
        <option diff="-10"    value="America/Adak">America/Adak</option>
        <option diff="-7"     value="America/Phoenix">America/Phoenix</option>
        <option diff="-5"     value="America/New_York">America/New_York</option>
        <option diff="-3.5"   value="America/St_Johns">America/St_Johns</option>
        <option diff="0"      value="UTC">UTC (default)</option>
        <option diff="+1"     value="Europe/Berlin">Europe/Berlin</option>
        <option diff="+2"     value="Asia/Beirut">Asia/Beirut</option>
        <option diff="+4"     value="Asia/Dubai">Asia/Dubai</option>
        <option diff="+5.75"  value="Asia/Kathmandu">Asia/Kathmandu</option>
        <option diff="+8"     value="Asia/Shanghai">Asia/Shanghai</option>
        <option diff="+9"     value="Asia/Tokyo">Asia/Tokyo</option>
        <option diff="+11"    value="Asia/Vladivostok">Asia/Vladivostok</option>
        <option diff="+12.75" value="Pacific/Chatham">Pacific/Chatham</option>
        <option diff="+13"    value="Pacific/Tongatapu">Pacific/Tongatapu</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-outlined" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Outline:</label>
    <div for="select-outlined" class="w-36 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-outlined" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Outlined</option>
        <option value="none">"none" outline</option>
        <option value="inside">"inside" only</option>
        <option value="outside">"outside" only</option>
        <option value="both">"both" lines</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-elevation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Elevation:</label>
    <div for="select-elevation" class="w-36 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-elevation" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Elevation None</option>
        <option value="0">Elevation 0</option>
        <option value="1">Elevation 1</option>
        <option value="2">Elevation 2</option>
        <option value="3">Elevation 3</option>
        <option value="4">Elevation 4</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-placement" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Placement:</label>
    <div for="select-placement" class="w-32 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-placement" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Sidebar & Ruler</option>
        <optgroup label="Sidebar">
          <option value="sidebar:both">Both</option>
          <option value="sidebar:left">Left only</option>
          <option value="sidebar:right">Right only</option>
          <option value="sidebar:none">None</option>
        </optgroup>
        <optgroup label="Ruler">
          <option value="ruler:both">Both</option>
          <option value="ruler:top">Top only</option>
          <option value="ruler:bottom">Bottom only</option>
          <option value="ruler:none">None</option>
        </optgroup>
      </select>
    </div>
  </div>

  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-canvas-layout" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Canvas Layout:</label>
    <div for="select-canvas-layout" class="w-32 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-canvas-layout" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Style None</option>
        <option value="striped">Striped</option>
        <option value="grid">Grid</option>
        <option value="toned">Toned</option>
        <option value="plaid">Plaid</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-start-weekday" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Day of Week:</label>
    <div for="select-start-weekday" class="w-32 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-start-weekday" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Choose Day</option>
        <option value="0">Sunday (default)</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-alignment" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alignment:</label>
    <div for="select-alignment" class="w-32 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-alignment" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Alignment</option>
        <option value="left">Left or Begin</option>
        <option value="center">Center</option>
        <option value="right">Right or End</option>
        <option value="current">Current or Currently</option>
        <option value="latest">Latest</option>
        <option value="1">Numeric ID (e.g., 1)</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col items-start w-28 h-max">
    <label for="run-reload" class="block mb-2 text-sm font-medium select-none cursor-none">&nbsp;</label>
    <button type="button" id="run-reload" class="h-10 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reload Timeline</button>
  </div>
  <div class="flex flex-col items-start w-28 h-max">
    <label for="grain-width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grain Width</label>
    <input type="text" id="grain-width" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="48px" pattern="[A-Za-z0-9\.]*" inputmode="latin" />
  </div>
  <div class="flex flex-col items-start w-28 h-max">
    <label for="row-height" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Row Height</label>
    <input type="text" id="row-height" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80px" pattern="[A-Za-z0-9\.]*" inputmode="latin" />
  </div>
</div>
`

  const $TARGET_ELEMENTS: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-container')!
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('Dark mode now')
    $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => elm.classList.add('dark-theme'))
  } else {
    console.log('Light mode now')
    $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => elm.classList.remove('dark-theme'))
  }
  window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', (event: MediaQueryListEvent) => {
    const isDarkMode: boolean = event.matches
    console.log('Changed mode:', isDarkMode ? 'dark' : 'light', event)
    $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => isDarkMode ? elm.classList.add('dark-theme') : elm.classList.remove('dark-theme'))
  })
  // Hook when changing mode with darkmode.js
  const $BTN_TOGGLE = document.querySelector<HTMLButtonElement>('.darkmode-toggle')!
  Object.assign($BTN_TOGGLE.style, { zIndex: 9999, boxShadow: '0px 5px 20px 1px rgba(0, 0, 0, 0.4)' })
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const targetElm = mutation.target as HTMLBodyElement
        if (targetElm.classList.contains('darkmode--activated')) {
          console.log('Toggled to darkmode with darkmode.js', $TARGET_ELEMENTS)
          $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => elm.classList.add('dark-theme'))
        } else {
          console.log('Toggled to lightmode with darkmode.js', $TARGET_ELEMENTS)
          $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => elm.classList.remove('dark-theme'))
        }
      }
    }
  }).observe(document.body, { attributes: true, childList: false, subtree: false })

  // Toggle RTL
  element.querySelector<HTMLInputElement>('#toggle-rtl')!.addEventListener('change', (evt: Event) => {
    const $CHECKBOX = <HTMLInputElement>evt.currentTarget
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const layoutOptions = instance.getOptions().layout!
        layoutOptions.rtl = $CHECKBOX.checked
        //console.log('!!!:', layoutOptions)
        instance.reload({ layouts: layoutOptions })
      }
    }
    //console.log('!!!:', $CHECKBOX, $CHECKBOX.checked)
  })

  // Change TimeZone
  element.querySelector<HTMLSelectElement>('#select-timezone')!.addEventListener('change', (evt: Event) => {
    const $TIMEZONE = <HTMLSelectElement>evt.currentTarget

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        console.log('!!!:', $TIMEZONE.value)
        instance.reload({ timezone: $TIMEZONE.value })
      }
    }
  })

  // Change Outlined
  element.querySelector<HTMLSelectElement>('#select-outlined')!.addEventListener('change', (evt: Event) => {
    const $SELECTED = <HTMLSelectElement>evt.currentTarget

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const layoutOptions = instance.getOptions().layout!
        layoutOptions.outlined = $SELECTED.value
        //console.log('!!!:', layoutOptions)
        instance.reload({ layouts: layoutOptions })
      }
    }
  })

  // Change Elevation
  element.querySelector<HTMLSelectElement>('#select-elevation')!.addEventListener('change', (evt: Event) => {
    const $TARGET_TIMELINE_CONTAINER: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-container')!
    $TARGET_TIMELINE_CONTAINER.forEach((elm: HTMLDivElement) => {
      const targetElm = <HTMLSelectElement>evt.currentTarget
      elm.dataset.timelineElevation = targetElm.value !== '' ? targetElm.value : ''
    })
  })

  // Change Sidebar & Ruler Placement
  element.querySelector<HTMLSelectElement>('#select-placement')!.addEventListener('change', (evt: Event) => {
    const $SELECTED = <HTMLSelectElement>evt.currentTarget
    const [ target, placement ] = $SELECTED.value.split(':')

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const nowOptions = instance.getOptions()
        let newOptions = null
        if (target === 'sidebar') {
          newOptions = { sidebar: nowOptions.sidebar! }
          newOptions.sidebar.placement = placement
        } else {
          newOptions = { ruler: nowOptions.ruler! }
          newOptions.ruler.placement = placement
        }
        console.log('!!!:', target, placement, newOptions)
        instance.reload(newOptions)
      }
    }
  })

  // Change Canvas Style
  element.querySelector<HTMLSelectElement>('#select-canvas-layout')!.addEventListener('change', (evt: Event) => {
    const $TARGET_TIMELINE_NODE_CANVAS: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-nodes')!
    $TARGET_TIMELINE_NODE_CANVAS.forEach((elm: HTMLDivElement) => {
      const targetElm = <HTMLSelectElement>evt.currentTarget
      elm.dataset.background = targetElm.value !== '' ? targetElm.value : ''
    })
  })

  // Change First Day of Week
  element.querySelector<HTMLSelectElement>('#select-start-weekday')!.addEventListener('change', (evt: Event) => {
    const $FIRST_DAY = <HTMLSelectElement>evt.currentTarget

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const rulerOptions = instance.getOptions().ruler!
        rulerOptions.firstDayOfWeek = Number($FIRST_DAY.value)
        console.log('!!!:', rulerOptions)
        instance.reload({ ruler: rulerOptions })
      }
    }
  })

  // Change Alignment
  element.querySelector<HTMLSelectElement>('#select-alignment')!.addEventListener('change', (evt: Event) => {
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const targetElm = <HTMLSelectElement>evt.currentTarget
        window.SunorhcTimelineInstances[key].align(targetElm.value, (self: any) => {
          console.log('Do Alignment:', targetElm.value)
        })
      }
    }
  })

  // Execute Reload Timeline
  element.querySelector<HTMLButtonElement>('#run-reload')!.addEventListener('click', () => {
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const focusComponent = document.getElementById(key)!
        //const cacheOffsetTop = focusComponent.offsetTop
        //window.scrollTo({ left: 0, top: cacheOffsetTop, behavior: 'smooth' })
        focusComponent.classList.add('preparing')
        setTimeout(() => {
          const nowOptions = window.SunorhcTimelineInstances[key].getOptions()
          let newOptions = { effects: { defaultAlignment: 'end' } }
          if (nowOptions.hasOwnProperty('extends') && nowOptions.extends.hasOwnProperty('originOptions')) {
            const originOptions = nowOptions.extends.originOptions
            const addOptions = {
              start:   originOptions.start,
              end:     originOptions.end,
              scale:   originOptions.scale,
              sidebar: originOptions.sidebar,
              ruler:   originOptions.ruler,

            }
            const grainWindth = parseInt(element.querySelector<HTMLInputElement>('#grain-width')!.value || '48', 10)
            const rowHeight   = parseInt(element.querySelector<HTMLInputElement>('#row-height')!.value || '80', 10)
            if (!isNaN(grainWindth)) {
              addOptions.ruler.minGrainWidth = `${grainWindth}px`
            }
            if (!isNaN(rowHeight)) {
              addOptions.sidebar.itemHeight = `${rowHeight}px`
            }
            newOptions = { ...newOptions, ...addOptions }
            console.log('originOptions:', addOptions, newOptions)
          } 
          window.SunorhcTimelineInstances[key].reload(newOptions, (self: any) => {
            console.log('Reloaded:', self)
            window.scrollTo({ left: 0, top: self.targetElement.offsetTop, behavior: 'smooth' })
          })
        }, 300)
      }
    }
  })

  element.querySelector<HTMLInputElement>('.alnum-only')!.addEventListener('input', (e: Event) => {
    const elm = <HTMLInputElement>e.currentTarget
    const value = elm.value
    elm.value = value.replace(/[^a-zA-Z0-9\.]/g, '')
  })

}