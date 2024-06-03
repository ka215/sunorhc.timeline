export function setupTester(element: HTMLDivElement) {
  element.innerHTML = `
<div class="mt-4 mb-2 flex justify-start gap-4">
  <button type="button" id="toggle-container-bordered" class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Toggle Container Bordered</button>
  <button type="button" id="toggle-body-bordered" class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Toggle Body Bordered</button>
  <div for="select-elevation" class="w-36 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
    <select id="select-elevation" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
      <option value="" selected>Elevation None</option>
      <option value="0">Elevation 0</option>
      <option value="1">Elevation 1</option>
      <option value="2">Elevation 2</option>
      <option value="3">Elevation 3</option>
      <option value="4">Elevation 4</option>
    </select>
  </div>
  <div for="select-canvas-layout" class="w-32 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
    <select id="select-canvas-layout" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
      <option value="">Style None</option>
      <option value="striped">Striped</option>
      <option value="grid">Grid</option>
      <option value="toned">Toned</option>
      <option value="plaid" selected>Plaid</option>
    </select>
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
  // Toggle bordered
  element.querySelector<HTMLButtonElement>('#toggle-container-bordered')!.addEventListener('click', () => {
    const $TARGET_TIMELINE_CONTAINER: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-container')!
    $TARGET_TIMELINE_CONTAINER.forEach((elm: HTMLDivElement) => {
      const currentBordered: string = elm.dataset.timelineOutline ?? 'false'
      elm.dataset.timelineOutline = currentBordered === 'false' ? 'true' : 'false'
    })
  })
  element.querySelector<HTMLButtonElement>('#toggle-body-bordered')!.addEventListener('click', () => {
    const $TARGET_TIMELINE_BODY: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-body')!
    $TARGET_TIMELINE_BODY.forEach((elm: HTMLDivElement) => {
      const currentBordered: string = elm.dataset.timelineOutline ?? 'false'
      elm.dataset.timelineOutline = currentBordered === 'false' ? 'true' : 'false'
    })
  })
  // Change Elevation
  element.querySelector<HTMLSelectElement>('#select-elevation')!.addEventListener('change', (evt: Event) => {
    const $TARGET_TIMELINE_CONTAINER: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-container')!
    $TARGET_TIMELINE_CONTAINER.forEach((elm: HTMLDivElement) => {
      const targetElm = <HTMLSelectElement>evt.currentTarget
      elm.dataset.timelineElevation = targetElm.value !== '' ? targetElm.value : ''
    })
  })
  // Change Canvas Style
  element.querySelector<HTMLSelectElement>('#select-canvas-layout')!.addEventListener('change', (evt: Event) => {
    const $TARGET_TIMELINE_NODE_CANVAS: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.sunorhc-timeline-nodes')!
    $TARGET_TIMELINE_NODE_CANVAS.forEach((elm: HTMLDivElement) => {
      const targetElm = <HTMLSelectElement>evt.currentTarget
      elm.dataset.background = targetElm.value !== '' ? targetElm.value : ''
    })
  })
  
}