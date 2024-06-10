import { setupTester } from './SunorhcTimelineTester'

document.querySelector<HTMLDivElement>('#tester')!.innerHTML = `
  <div id="sunorhc-timeline-tester"></div>
`

setupTester(document.querySelector<HTMLDivElement>('#sunorhc-timeline-tester')!)
