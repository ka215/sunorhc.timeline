export function setupTester(element: HTMLDivElement) {
  const testerComponents: Record<string, string> = {
    toggleRtl: `\
  <div class="flex flex-col items-start w-28 h-max">
    <label for="toggle-rtl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direction:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-rtl" type="checkbox" name="dir-rtl" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">on RTL</span>
    </label>
  </div>`,
    selectTimeZone: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-timezone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">TimeZone:</label>
    <div for="select-timezone" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-timezone" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>TimeZone</option>
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
  </div>`,
    selectOutlined: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-outlined" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Outline:</label>
    <div for="select-outlined" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-outlined" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Outline Type</option>
        <option value="none">"none" outline</option>
        <option value="inside">"inside" only</option>
        <option value="outside">"outside" only</option>
        <option value="both">"both" lines</option>
      </select>
    </div>
  </div>`,
    selectElevation: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-elevation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Elevation:</label>
    <div for="select-elevation" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-elevation" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Choose Level</option>
        <option value="0">Elevation 0</option>
        <option value="1">Elevation 1</option>
        <option value="2">Elevation 2</option>
        <option value="3">Elevation 3</option>
        <option value="4">Elevation 4</option>
      </select>
    </div>
  </div>`,
    selectPlacement: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-placement" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Placement:</label>
    <div for="select-placement" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  </div>`,
    selectCanvasLayout: `\
  <div class="flex flex-col items-start w-32 h-max">
    <label for="select-canvas-layout" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Canvas Layout:</label>
    <div for="select-canvas-layout" class="w-32 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-canvas-layout" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Layout Type</option>
        <option value="">Style None</option>
        <option value="striped">Striped</option>
        <option value="grid">Grid</option>
        <option value="toned">Toned</option>
        <option value="plaid">Plaid</option>
      </select>
    </div>
  </div>`,
    selectStartWeekday: `\
  <div class="flex flex-col items-start w-32 h-max">
    <label for="select-start-weekday" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Day of Week:</label>
    <div for="select-start-weekday" class="w-32 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  </div>`,
    selectAlignment: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-alignment" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alignment:</label>
    <div for="select-alignment" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  </div>`,
    runReload: `\
  <div class="flex flex-col items-start w-28 h-max">
    <label for="run-reload" class="block mb-2 text-sm font-medium select-none cursor-none">&nbsp;</label>
    <button type="button" id="run-reload" class="h-10 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reload Timeline</button>
  </div>`,
    grainWidth: `\
  <div class="flex flex-col items-start w-20 h-max">
    <label for="grain-width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grain Width</label>
    <input type="text" id="grain-width" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="48px" pattern="[A-Za-z0-9\.]*" inputmode="latin" />
  </div>`,
    rowHeight: `\
  <div class="flex flex-col items-start w-20 h-max">
    <label for="row-height" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Row Height</label>
    <input type="text" id="row-height" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80px" pattern="[A-Za-z0-9\.]*" inputmode="latin" />
  </div>`,
    toggleScaleTracker: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-scale-tracker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scale Tracker:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-scale-tracker" type="checkbox" name="scale-tracker" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">On Tracking</span>
    </label>
  </div>`,
    verticalDivider: `<div class="inline-block h-[68px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>`,
    togglePresentMarker: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-present-marker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Present Time:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-present-marker" type="checkbox" name="present-marker" value="1" class="sr-only peer" checked="checked">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show Marker</span>
    </label>
  </div>`,
    toggleDayColored: `\
  <div class="flex flex-col items-start w-40 h-max">
    <label for="toggle-day-colored" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ruler Coloring:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-day-colored" type="checkbox" name="day-colored" value="1" class="sr-only peer" checked="checked">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">On Day Colored</span>
    </label>
  </div>`,
    toggleTooltip: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-tooltip" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tooltip:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-tooltip" type="checkbox" name="day-colored" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use Tooltip</span>
    </label>
  </div>`,
    selectEventOpener: `\
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-event-opener" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Opener:</label>
    <div for="select-event-opener" class="w-36 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-event-opener" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Opener Type</option>
        <option value="normal">Normal</option>
        <optgroup label="Modal">
          <option value="modal:full">Full</option>
          <option value="modal:extralarge">Extralarge</option>
          <option value="modal:large">Large</option>
          <option value="modal:medium">Medium</option>
          <option value="modal:small">Small</option>
          <option value="modal:960">960px</option>
        </optgroup>
        <option value="custom">Custom</option>
        <option value="none">None</option>
      </select>
    </div>
  </div>`,
    optionViewer: `\
  <div class="flex flex-col items-start w-24 h-max">
    <label for="view-options" class="block mb-2 text-sm font-medium select-none cursor-none">&nbsp;</label>
    <button type="button" data-modal-target="tester-modal" data-modal-toggle="tester-modal" id="view-options" 
      class="block h-10 w-full px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >See Options</button>
  </div>`,
    scaleSwitcher: `\
  <div class="flex flex-col items-start w-28 h-max">
    <label for="select-scale" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scale Switcher:</label>
    <div for="select-scale" class="w-28 h-max border border-blue-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <select id="select-scale" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Scale</option>
        <option value="year">Year</option>
        <option value="month">Month</option>
        <option value="week">Week</option>
        <option value="day">Day</option>
        <option value="hour">Hour</option>
        <option value="minute">Minute</option>
        <option value="second">Second</option>
      </select>
    </div>
  </div>`,
  }
  const componentsOrder: Array<string> = [
    // Scale related:
    'selectTimeZone', 'selectStartWeekday', 'togglePresentMarker', 'verticalDivider',
    // Display related:
    'toggleRtl', 'selectOutlined', 'selectElevation', 'selectPlacement', 'selectCanvasLayout', 'toggleDayColored', 'grainWidth', 'rowHeight', 'verticalDivider', 
    // Event related:
    'selectAlignment', 'toggleTooltip', 'selectEventOpener', 'runReload', 'verticalDivider', 
    // Debugger:
    'toggleScaleTracker', 'scaleSwitcher', 'optionViewer', 
  ]

  let renderHTML = `\
<div class="inline-flex items-center justify-center w-full">
  <hr class="w-full h-px my-4 bg-gray-300 border-0 dark:bg-gray-400">
  <h3 class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900 custom-duration">Timeline Instance Controller</h3>
</div>
<div class="mt-4 mb-2 flex flex-wrap justify-start gap-4">\
  `
  componentsOrder.forEach((key: string): void => {
    renderHTML += testerComponents[key]
  })
  renderHTML += '</div>'

  element.innerHTML = renderHTML

  //type ModalSize = 'small' | 'medium' | 'large' | 'extralarge';
  const injectContentToModal = (title: string, content: string/*, size?: ModalSize = 'large'*/): void => {
    /*
    const sizeClass = {
      small:      'max-w-md',
      medium:     'max-w-lg',
      large:      'max-w-4xl',
      extralarge: 'max-w-7xl',
    }
    const modalHTML = `\
<div id="${size}-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
  <div class="relative w-full ${sizeClass[size]} max-h-full">
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          Current Timeline Options
        </h3>
        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="${size}-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <div class="p-4 md:p-5 space-y-4">
        ${content}
      </div>
      <div class="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
        <button data-modal-hide="${size}-modal" type="button" 
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Download</button>
        <button data-modal-hide="${size}-modal" type="button" 
          class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >Close</button>
      </div>
    </div>
  </div>
</div>`
    */
    const testerModal = document.getElementById('tester-modal')!
    const testerModalHeadline = document.getElementById('tester-modal-headline')!
    const testerModalBody = document.getElementById('tester-modal-body')!
    testerModalHeadline.innerHTML = title
    testerModalBody.innerHTML = content
    if (testerModal.classList.contains('opacity-0')) {
      testerModal.classList.add('opacity-1')
      testerModal.classList.remove('opacity-0')
    }
  }

  // Handle for changing mode
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
          //console.log('Toggled to darkmode with darkmode.js', $TARGET_ELEMENTS)
          $TARGET_ELEMENTS.forEach((elm: HTMLDivElement) => elm.classList.add('dark-theme'))
        } else {
          //console.log('Toggled to lightmode with darkmode.js', $TARGET_ELEMENTS)
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
        instance.reload({ layouts: layoutOptions })
      }
    }
  })

  // Change TimeZone
  element.querySelector<HTMLSelectElement>('#select-timezone')!.addEventListener('change', (evt: Event) => {
    const $TIMEZONE = <HTMLSelectElement>evt.currentTarget

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        //console.log('!!!:', $TIMEZONE.value)
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
        //console.log('!!!:', target, placement, newOptions)
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
        //console.log('!!!:', rulerOptions)
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
          console.log('Do Alignment:', targetElm.value, self)
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

  // Toggle Scale Tracker
  element.querySelector<HTMLInputElement>('#toggle-scale-tracker')!.addEventListener('change', (evt: Event) => {
    const $CHECKBOX = <HTMLInputElement>evt.currentTarget
    try {
      if (window.hasOwnProperty('SunorhcTimelineInstances')) {
        for (const key in window.SunorhcTimelineInstances) {
          const extendsOptions = window.SunorhcTimelineInstances[key].getOptions().extends ?? {}
          if (extendsOptions.hasOwnProperty('zoomScaleTracker') && extendsOptions.zoomScaleTracker) {
            const $TARGET_TIMELINE = document.getElementById(key)!
            let $SCALE_TRACKER: HTMLDivElement
            if ($CHECKBOX.checked) {
              $SCALE_TRACKER = document.createElement('div')
              $SCALE_TRACKER.classList.add('zoom-scale-coordinates-tracker')
              $SCALE_TRACKER.setAttribute('style', `position: absolute; bottom: 6px; left: 4px; display: none; flex-wrap: wrap; justify-content: start; text-align: left; font-size: 12px; color: #555; background-color: #fff; border: solid 1px #999; border-radius: 4px; width: max-content; max-width: 50%; height: max-content; padding: 3px 6px; box-shadow: 4px 4px 4px rgba(21,21,21,.25); z-index: 9999;`)
              $TARGET_TIMELINE.querySelector<HTMLDivElement>('.sunorhc-timeline-footer')!.append($SCALE_TRACKER)
            } else {
              $SCALE_TRACKER = $TARGET_TIMELINE.querySelector('.zoom-scale-coordinates-tracker') as HTMLDivElement
              if ($SCALE_TRACKER) {
                $TARGET_TIMELINE.querySelector<HTMLDivElement>('.sunorhc-timeline-footer')!.removeChild($SCALE_TRACKER)
              } else {
                throw new Error('Scale Tracker does not exists.')
              }
            }
          } else {
            throw new Error('No extends for Scale Tracker in options.')
          }
        }
      } else {
        throw new Error('No valid timeline instance.')
      }
    } catch(err) {
      console.error('Could not activate Scale Tracker:', err)
      $CHECKBOX.checked = false
    }
  })

  // Toggle Present Time Marker
  element.querySelector<HTMLInputElement>('#toggle-present-marker')!.addEventListener('change', (evt: Event) => {
    const $CHECKBOX = <HTMLInputElement>evt.currentTarget
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const effectOptions = instance.getOptions().effects!
        effectOptions.presentTime = $CHECKBOX.checked
        instance.reload({ effects: effectOptions })
      }
    }
  })

  // Toggle Day Colored
  element.querySelector<HTMLInputElement>('#toggle-day-colored')!.addEventListener('change', (evt: Event) => {
    const $CHECKBOX = <HTMLInputElement>evt.currentTarget
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const rulerOptions = instance.getOptions().ruler!
        if (!rulerOptions.hasOwnProperty('filters')) {
          rulerOptions.filters = { dayBackgroundColor: $CHECKBOX.checked }
        } else {
          rulerOptions.filters.dayBackgroundColor = $CHECKBOX.checked
        }
        instance.reload({ ruler: rulerOptions })
      }
    }
  })

  // Toggle Tooltip
  element.querySelector<HTMLInputElement>('#toggle-tooltip')!.addEventListener('change', (evt: Event) => {
    const $CHECKBOX = <HTMLInputElement>evt.currentTarget
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const effectOptions = instance.getOptions().effects!
        effectOptions.hoverEvent = $CHECKBOX.checked
        instance.reload({ effects: effectOptions })
      }
    }
  })

  // Change Event Opener Type
  element.querySelector<HTMLSelectElement>('#select-event-opener')!.addEventListener('change', (evt: Event) => {
    const $OPENER_TYPE = <HTMLSelectElement>evt.currentTarget
    // Clear modal element
    const modalElement = document.getElementById('sunorhc-timeline-modal')
    if (modalElement) {
      modalElement.parentNode?.removeChild(modalElement)
    }
    if ($OPENER_TYPE.value === 'normal') {
      document.getElementById('sunorhc-timeline-event-details')?.classList.remove('hidden')
    } else {
      document.getElementById('sunorhc-timeline-event-details')?.classList.add('hidden')
    }

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const effectOptions = instance.getOptions().effects!
        if (/^modal/.test($OPENER_TYPE.value)) {
          const [ type, size ] = $OPENER_TYPE.value.split(':')
          effectOptions.onClickEvent = type
          effectOptions.template.modal.size = size === '960' ? Number(size): size
        } else {
          effectOptions.onClickEvent = $OPENER_TYPE.value
        }
        instance.reload({ effects: effectOptions })
      }
    }
  })

  // Change Scale
  element.querySelector<HTMLSelectElement>('#select-scale')!.addEventListener('change', (evt: Event) => {
    const $SELECT_SCALE = <HTMLSelectElement>evt.currentTarget

    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const instance = window.SunorhcTimelineInstances[key]
        const measurements = instance.measurements
        let newOptions = instance.getOptions()
        // initialize options
        newOptions.scale = $SELECT_SCALE.value
        newOptions.start = 'currently'
        newOptions.end = 'auto'
        if (newOptions.ruler.hasOwnProperty('filters') && newOptions.ruler.filters.hasOwnProperty('decorations')) {
          newOptions.ruler.filters.decorations = { year: undefined, day: undefined, minute: undefined }
        } else {
          newOptions.ruler.filters = { decorations: {} }
        }
        const rulerFilters = newOptions.ruler.filters
        let nowDate = new Date()
        let monthName = !!rulerFilters.monthNames && Array.isArray(rulerFilters.monthNames) 
          ? rulerFilters.monthNames[newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() : nowDate.getMonth()] 
          : (newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() + 1 : nowDate.getMonth() + 1)
        let dayName = !!rulerFilters.dayNames && Array.isArray(rulerFilters.dayNames) 
          ? rulerFilters.dayNames[newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay()] 
          : (newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay())
        let year, hours, minutes
        //console.log('!!!:', measurements, newOptions)
        switch($SELECT_SCALE.value) {
          case 'year':
            //newOptions.start = new Date(new Date().getFullYear() - 5, 0, 1)
            //newOptions.end = new Date(new Date().getFullYear() + 5, 0, 1)
            newOptions.ruler.minGrainWidth = Math.max(160, Math.ceil(measurements.rulerVisibleWidth / 10))
            newOptions.ruler.top.rows = [ 'year' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            break
          case 'month':
            nowDate = newOptions.timezone === 'UTC' 
            ? new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), 0, 0, 0, 0))
            : new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0)
            newOptions.start = `${nowDate.getFullYear()}-01-01T00:00:00.000`
            newOptions.end = `${nowDate.getFullYear()}-12-31T23:59:59.999`
            newOptions.ruler.minGrainWidth = Math.max(120, Math.ceil(measurements.rulerVisibleWidth / 12))
            newOptions.ruler.top.rows = [ 'year', 'month' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            break
          case 'week':
            newOptions.ruler.minGrainWidth = Math.max(80, Math.ceil(measurements.rulerVisibleWidth / 53))
            newOptions.ruler.top.rows = [ 'year', 'month', 'week' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            break
          case 'day':
            newOptions.ruler.minGrainWidth = Math.max(60, Math.ceil(measurements.rulerVisibleWidth / 31))
            newOptions.ruler.top.rows = [ 'year', 'month', 'week', 'day', 'weekday' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            break
          case 'hour':
            nowDate = newOptions.timezone === 'UTC' 
              ? new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), 0, 0, 0, 0))
              : new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0)
            newOptions.start = nowDate
            newOptions.end = new Date(nowDate.getTime() + (24 * 60 * 60 * 1000))
            newOptions.ruler.minGrainWidth = Math.max(80, Math.ceil(measurements.rulerVisibleWidth / 24))
            newOptions.ruler.top.rows = [ 'day', 'hour' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            //monthName = rulerFilters.monthNames[newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() : nowDate.getMonth()] || (newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() + 1 : nowDate.getMonth() + 1)
            //dayName = rulerFilters.dayNames[newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay()] || (newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay())
            year = newOptions.timezone === 'UTC' ? nowDate.getUTCFullYear() : nowDate.getFullYear()
            newOptions.ruler.filters.decorations.day = { replacer: `${dayName}, %s ${monthName} ${year}` }
            break
          case 'minute':
            nowDate = newOptions.timezone === 'UTC' 
              ? new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), nowDate.getUTCHours(), 0, 0, 0))
              : new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), 0, 0, 0)
            newOptions.start = nowDate
            newOptions.end = new Date(nowDate.getTime() + (60 * 60 * 1000))
            newOptions.ruler.minGrainWidth = Math.max(60, Math.ceil(measurements.rulerVisibleWidth / 60))
            newOptions.ruler.top.rows = [ 'day', 'hour', 'minute' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            //monthName = rulerFilters.monthNames[newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() : nowDate.getMonth()] ?? (newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() + 1 : nowDate.getMonth() + 1)
            //dayName = rulerFilters.dayNames[newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay()] ?? (newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay())
            year = newOptions.timezone === 'UTC' ? nowDate.getUTCFullYear() : nowDate.getFullYear()
            newOptions.ruler.filters.decorations.day = { replacer: `${dayName}, %s ${monthName} ${year}` }
            break
          case 'second':
            nowDate = newOptions.timezone === 'UTC' 
              ? new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), nowDate.getUTCHours(), nowDate.getUTCMinutes(), 0, 0))
              : new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), 0, 0)
            newOptions.start = nowDate
            newOptions.end = new Date(nowDate.getTime() + (60 * 1000))
            newOptions.ruler.minGrainWidth = Math.max(60, Math.ceil(measurements.rulerVisibleWidth / 60))
            newOptions.ruler.top.rows = [ 'day', 'minute', 'second' ]
            newOptions.ruler.bottom.rows = newOptions.ruler.top.rows.toReversed()
            //monthName = rulerFilters.monthNames[newOptions.timezone === 'UTC' ? nowDate.getUTCMonth() : nowDate.getMonth()]
            //dayName = rulerFilters.dayNames[newOptions.timezone === 'UTC' ? nowDate.getUTCDay() : nowDate.getDay()]
            year = newOptions.timezone === 'UTC' ? nowDate.getUTCFullYear() : nowDate.getFullYear()
            hours = String(newOptions.timezone === 'UTC' ? nowDate.getUTCHours() : nowDate.getHours()).padStart(2, '0')
            minutes = String(newOptions.timezone === 'UTC' ? nowDate.getUTCMinutes() : nowDate.getMinutes()).padStart(2, '0')
            newOptions.ruler.filters.decorations.day = { replacer: `${dayName}, %s ${monthName} ${year}` }
            newOptions.ruler.filters.decorations.minute = { replacer: `${hours}:${minutes}` }
            break
          default:
            return
        }
        // Should be scale tracking off
        const $SCALE_TRACKER = document.getElementById('toggle-scale-tracker')! as HTMLInputElement
        if ($SCALE_TRACKER.checked) {
          $SCALE_TRACKER.checked = false
        }
        instance.reload(newOptions)
      }
    }
  })

  // View Options
  let scrollPosition = 0
  element.querySelector<HTMLButtonElement>('#view-options')!.addEventListener('click', () => {
    // Handler of modal opener
    scrollPosition = window.scrollY
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = `calc(100% - ${scrollbarWidth}px)`
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const nowOptions = window.SunorhcTimelineInstances[key].getOptions()
        if (nowOptions) {
          const content = `<textarea readonly class="block p-2.5 w-full h-full font-mono text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"\
            >${JSON.stringify(nowOptions, null, "\t").replace(/"([^"]+)":/g, '$1:')}</textarea>`
          injectContentToModal('Current Timeline Options', content)
          break
        }
      }
    }
  })
  document.querySelectorAll<HTMLButtonElement>('button[data-modal-hide="tester-modal"]').forEach(btn => {
    // Handler of modal closer
    btn.addEventListener('click', () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      //document.body.style.overflowY = 'auto'
      window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' })
      const testerModal = document.getElementById('tester-modal')!
      if (testerModal.classList.contains('opacity-1')){
        testerModal.classList.add('opacity-0')
        testerModal.classList.remove('opacity-1')
      }
    })
  })
  document.getElementById('download-json')!.addEventListener('click', (evt: Event) => {
    // Handler of download JSON
    const $BUTTON = <HTMLButtonElement>evt.currentTarget
    const activeClasses = $BUTTON.getAttribute('class') || ''
    const originText = $BUTTON.textContent
    $BUTTON.setAttribute('disabled', '')
    $BUTTON.setAttribute('class', 'text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center')
    $BUTTON.textContent = 'Downloading...'
    if (window.hasOwnProperty('SunorhcTimelineInstances')) {
      for (const key in window.SunorhcTimelineInstances) {
        const nowOptions = window.SunorhcTimelineInstances[key].getOptions()
        if (nowOptions) {
          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nowOptions, null, 2))
          const downloadAnchorNode = document.createElement('a')
          downloadAnchorNode.setAttribute('href', dataStr)
          //const nanoHash = async () => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${performance.now() * 1e6}`)))).map(byte => byte.toString(16).padStart(2, '0')).join('')
          const nanoHash = async () => btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${performance.now() * 1e6}`)))))
          nanoHash()
            .then(hashStr => {
              downloadAnchorNode.setAttribute('download', `TimelineOptions-${hashStr}.json`)
              document.body.appendChild(downloadAnchorNode)
              downloadAnchorNode.click()
              downloadAnchorNode.remove()
            })
            .catch((err) => {
              console.error('Failed to download:', err)
            })
            .finally(() => {
              setTimeout(() => {
                $BUTTON.removeAttribute('disabled')
                $BUTTON.setAttribute('class', activeClasses)
                $BUTTON.textContent = originText
              }, 300)
            })
          break
        }
      }
    }
  })
  
  // Others
  element.querySelector<HTMLInputElement>('.alnum-only')!.addEventListener('input', (evt: Event) => {
    const elm = <HTMLInputElement>evt.currentTarget
    const value = elm.value
    elm.value = value.replace(/[^a-zA-Z0-9\.]/g, '')
  })

}