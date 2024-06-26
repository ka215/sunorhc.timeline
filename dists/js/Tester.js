(function(g,p){typeof exports=="object"&&typeof module<"u"?p(exports):typeof define=="function"&&define.amd?define(["exports"],p):(g=typeof globalThis<"u"?globalThis:g||self,p(g.Sunorhc={}))})(this,function(g){"use strict";function p(i){var h;const x={toggleRtl:`  <div class="flex flex-col items-start w-28 h-max">
    <label for="toggle-rtl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direction:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-rtl" type="checkbox" name="dir-rtl" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">on RTL</span>
    </label>
  </div>`,selectTimeZone:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,selectOutlined:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,selectElevation:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,selectPlacement:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,selectCanvasLayout:`  <div class="flex flex-col items-start w-32 h-max">
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
  </div>`,selectStartWeekday:`  <div class="flex flex-col items-start w-32 h-max">
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
  </div>`,selectAlignment:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,runReload:`  <div class="flex flex-col items-start w-28 h-max">
    <label for="run-reload" class="block mb-2 text-sm font-medium select-none cursor-none">&nbsp;</label>
    <button type="button" id="run-reload" class="h-10 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reload Timeline</button>
  </div>`,grainWidth:`  <div class="flex flex-col items-start w-20 h-max">
    <label for="grain-width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grain Width</label>
    <input type="text" id="grain-width" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="48px" pattern="[A-Za-z0-9.]*" inputmode="latin" />
  </div>`,rowHeight:`  <div class="flex flex-col items-start w-20 h-max">
    <label for="row-height" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Row Height</label>
    <input type="text" id="row-height" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80px" pattern="[A-Za-z0-9.]*" inputmode="latin" />
  </div>`,toggleScaleTracker:`  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-scale-tracker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scale Tracker:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-scale-tracker" type="checkbox" name="scale-tracker" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">On Tracking</span>
    </label>
  </div>`,verticalDivider:'<div class="inline-block h-[68px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>',togglePresentMarker:`  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-present-marker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Present Time:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-present-marker" type="checkbox" name="present-marker" value="1" class="sr-only peer" checked="checked">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show Marker</span>
    </label>
  </div>`,toggleDayColored:`  <div class="flex flex-col items-start w-40 h-max">
    <label for="toggle-day-colored" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ruler Coloring:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-day-colored" type="checkbox" name="day-colored" value="1" class="sr-only peer" checked="checked">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">On Day Colored</span>
    </label>
  </div>`,toggleTooltip:`  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-tooltip" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tooltip:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-tooltip" type="checkbox" name="day-colored" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use Tooltip</span>
    </label>
  </div>`,selectEventOpener:`  <div class="flex flex-col items-start w-36 h-max">
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
  </div>`,optionViewer:`  <div class="flex flex-col items-start w-24 h-max">
    <label for="view-options" class="block mb-2 text-sm font-medium select-none cursor-none">&nbsp;</label>
    <button type="button" data-modal-target="tester-modal" data-modal-toggle="tester-modal" id="view-options" 
      class="block h-10 w-full px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >See Options</button>
  </div>`,scaleSwitcher:`  <div class="flex flex-col items-start w-28 h-max">
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
  </div>`},v=["selectTimeZone","selectStartWeekday","togglePresentMarker","verticalDivider","toggleRtl","selectOutlined","selectElevation","selectPlacement","selectCanvasLayout","toggleDayColored","grainWidth","rowHeight","verticalDivider","selectAlignment","toggleTooltip","selectEventOpener","runReload","verticalDivider","toggleScaleTracker","scaleSwitcher","optionViewer"];let f=`<div class="inline-flex items-center justify-center w-full">
  <hr class="w-full h-px my-4 bg-gray-300 border-0 dark:bg-gray-400">
  <h3 class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900 custom-duration">Timeline Instance Controller</h3>
</div>
<div class="mt-4 mb-2 flex flex-wrap justify-start gap-4">  `;v.forEach(a=>{f+=x[a]}),f+="</div>",i.innerHTML=f;const T=(a,o)=>{const n=document.getElementById("tester-modal"),r=document.getElementById("tester-modal-headline"),l=document.getElementById("tester-modal-body");r.innerHTML=a,l.innerHTML=o,n.classList.contains("opacity-0")&&(n.classList.add("opacity-1"),n.classList.remove("opacity-0"))},m=document.querySelectorAll(".sunorhc-timeline-container");window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?(console.log("Dark mode now"),m.forEach(a=>a.classList.add("dark-theme"))):(console.log("Light mode now"),m.forEach(a=>a.classList.remove("dark-theme"))),(h=window==null?void 0:window.matchMedia("(prefers-color-scheme: dark)"))==null||h.addEventListener("change",a=>{const o=a.matches;console.log("Changed mode:",o?"dark":"light",a),m.forEach(n=>o?n.classList.add("dark-theme"):n.classList.remove("dark-theme"))});const S=document.querySelector(".darkmode-toggle");Object.assign(S.style,{zIndex:9999,boxShadow:"0px 5px 20px 1px rgba(0, 0, 0, 0.4)"}),new MutationObserver(a=>{for(const o of a)o.type==="attributes"&&o.attributeName==="class"&&(o.target.classList.contains("darkmode--activated")?m.forEach(r=>r.classList.add("dark-theme")):m.forEach(r=>r.classList.remove("dark-theme")))}).observe(document.body,{attributes:!0,childList:!1,subtree:!1}),i.querySelector("#toggle-rtl").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().layout;l.rtl=o.checked,r.reload({layouts:l})}}),i.querySelector("#select-timezone").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances)window.SunorhcTimelineInstances[n].reload({timezone:o.value})}),i.querySelector("#select-outlined").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().layout;l.outlined=o.value,r.reload({layouts:l})}}),i.querySelector("#select-elevation").addEventListener("change",a=>{document.querySelectorAll(".sunorhc-timeline-container").forEach(n=>{const r=a.currentTarget;n.dataset.timelineElevation=r.value!==""?r.value:""})}),i.querySelector("#select-placement").addEventListener("change",a=>{const o=a.currentTarget,[n,r]=o.value.split(":");if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const l in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[l],s=e.getOptions();let t=null;n==="sidebar"?(t={sidebar:s.sidebar},t.sidebar.placement=r):(t={ruler:s.ruler},t.ruler.placement=r),e.reload(t)}}),i.querySelector("#select-canvas-layout").addEventListener("change",a=>{document.querySelectorAll(".sunorhc-timeline-nodes").forEach(n=>{const r=a.currentTarget;n.dataset.background=r.value!==""?r.value:""})}),i.querySelector("#select-start-weekday").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().ruler;l.firstDayOfWeek=Number(o.value),r.reload({ruler:l})}}),i.querySelector("#select-alignment").addEventListener("change",a=>{if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const n=a.currentTarget;window.SunorhcTimelineInstances[o].align(n.value,r=>{console.log("Do Alignment:",n.value,r)})}}),i.querySelector("#run-reload").addEventListener("click",()=>{if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const a in window.SunorhcTimelineInstances)document.getElementById(a).classList.add("preparing"),setTimeout(()=>{const n=window.SunorhcTimelineInstances[a].getOptions();let r={effects:{defaultAlignment:"end"}};if(n.hasOwnProperty("extends")&&n.extends.hasOwnProperty("originOptions")){const l=n.extends.originOptions,e={start:l.start,end:l.end,scale:l.scale,sidebar:l.sidebar,ruler:l.ruler},s=parseInt(i.querySelector("#grain-width").value||"48",10),t=parseInt(i.querySelector("#row-height").value||"80",10);isNaN(s)||(e.ruler.minGrainWidth=`${s}px`),isNaN(t)||(e.sidebar.itemHeight=`${t}px`),r={...r,...e},console.log("originOptions:",e,r)}window.SunorhcTimelineInstances[a].reload(r,l=>{console.log("Reloaded:",l),window.scrollTo({left:0,top:l.targetElement.offsetTop,behavior:"smooth"})})},300)}),i.querySelector("#toggle-scale-tracker").addEventListener("change",a=>{const o=a.currentTarget;try{if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n].getOptions().extends??{};if(r.hasOwnProperty("zoomScaleTracker")&&r.zoomScaleTracker){const l=document.getElementById(n);let e;if(o.checked)e=document.createElement("div"),e.classList.add("zoom-scale-coordinates-tracker"),e.setAttribute("style","position: absolute; bottom: 6px; left: 4px; display: none; flex-wrap: wrap; justify-content: start; text-align: left; font-size: 12px; color: #555; background-color: #fff; border: solid 1px #999; border-radius: 4px; width: max-content; max-width: 50%; height: max-content; padding: 3px 6px; box-shadow: 4px 4px 4px rgba(21,21,21,.25); z-index: 9999;"),l.querySelector(".sunorhc-timeline-footer").append(e);else if(e=l.querySelector(".zoom-scale-coordinates-tracker"),e)l.querySelector(".sunorhc-timeline-footer").removeChild(e);else throw new Error("Scale Tracker does not exists.")}else throw new Error("No extends for Scale Tracker in options.")}else throw new Error("No valid timeline instance.")}catch(n){console.error("Could not activate Scale Tracker:",n),o.checked=!1}}),i.querySelector("#toggle-present-marker").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().effects;l.presentTime=o.checked,r.reload({effects:l})}}),i.querySelector("#toggle-day-colored").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().ruler;l.hasOwnProperty("filters")?l.filters.dayBackgroundColor=o.checked:l.filters={dayBackgroundColor:o.checked},r.reload({ruler:l})}}),i.querySelector("#toggle-tooltip").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.getOptions().effects;l.hoverEvent=o.checked,r.reload({effects:l})}}),i.querySelector("#select-event-opener").addEventListener("change",a=>{var r,l,e;const o=a.currentTarget,n=document.getElementById("sunorhc-timeline-modal");if(n&&((r=n.parentNode)==null||r.removeChild(n)),o.value==="normal"?(l=document.getElementById("sunorhc-timeline-event-details"))==null||l.classList.remove("hidden"):(e=document.getElementById("sunorhc-timeline-event-details"))==null||e.classList.add("hidden"),window.hasOwnProperty("SunorhcTimelineInstances"))for(const s in window.SunorhcTimelineInstances){const t=window.SunorhcTimelineInstances[s],c=t.getOptions().effects;if(/^modal/.test(o.value)){const[u,d]=o.value.split(":");c.onClickEvent=u,c.template.modal.size=d==="960"?Number(d):d}else c.onClickEvent=o.value;t.reload({effects:c})}}),i.querySelector("#select-scale").addEventListener("change",a=>{const o=a.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const n in window.SunorhcTimelineInstances){const r=window.SunorhcTimelineInstances[n],l=r.measurements;let e=r.getOptions();e.scale=o.value,e.start="currently",e.end="auto",e.ruler.hasOwnProperty("filters")&&e.ruler.filters.hasOwnProperty("decorations")?e.ruler.filters.decorations={year:void 0,day:void 0,minute:void 0}:e.ruler.filters={decorations:{}};const s=e.ruler.filters;let t=new Date,c=s.monthNames&&Array.isArray(s.monthNames)?s.monthNames[e.timezone==="UTC"?t.getUTCMonth():t.getMonth()]:e.timezone==="UTC"?t.getUTCMonth()+1:t.getMonth()+1,u=s.dayNames&&Array.isArray(s.dayNames)?s.dayNames[e.timezone==="UTC"?t.getUTCDay():t.getDay()]:e.timezone==="UTC"?t.getUTCDay():t.getDay(),d,y,w;switch(o.value){case"year":e.ruler.minGrainWidth=Math.max(160,Math.ceil(l.rulerVisibleWidth/10)),e.ruler.top.rows=["year"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed();break;case"month":t=e.timezone==="UTC"?new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),0,0,0,0)):new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),e.start=`${t.getFullYear()}-01-01T00:00:00.000`,e.end=`${t.getFullYear()}-12-31T23:59:59.999`,e.ruler.minGrainWidth=Math.max(120,Math.ceil(l.rulerVisibleWidth/12)),e.ruler.top.rows=["year","month"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed();break;case"week":e.ruler.minGrainWidth=Math.max(80,Math.ceil(l.rulerVisibleWidth/53)),e.ruler.top.rows=["year","month","week"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed();break;case"day":e.ruler.minGrainWidth=Math.max(60,Math.ceil(l.rulerVisibleWidth/31)),e.ruler.top.rows=["year","month","week","day","weekday"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed();break;case"hour":t=e.timezone==="UTC"?new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),0,0,0,0)):new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),e.start=t,e.end=new Date(t.getTime()+24*60*60*1e3),e.ruler.minGrainWidth=Math.max(80,Math.ceil(l.rulerVisibleWidth/24)),e.ruler.top.rows=["day","hour"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed(),d=e.timezone==="UTC"?t.getUTCFullYear():t.getFullYear(),e.ruler.filters.decorations.day={replacer:`${u}, %s ${c} ${d}`};break;case"minute":t=e.timezone==="UTC"?new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),t.getUTCHours(),0,0,0)):new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),0,0,0),e.start=t,e.end=new Date(t.getTime()+60*60*1e3),e.ruler.minGrainWidth=Math.max(60,Math.ceil(l.rulerVisibleWidth/60)),e.ruler.top.rows=["day","hour","minute"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed(),d=e.timezone==="UTC"?t.getUTCFullYear():t.getFullYear(),e.ruler.filters.decorations.day={replacer:`${u}, %s ${c} ${d}`};break;case"second":t=e.timezone==="UTC"?new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),t.getUTCHours(),t.getUTCMinutes(),0,0)):new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),0,0),e.start=t,e.end=new Date(t.getTime()+60*1e3),e.ruler.minGrainWidth=Math.max(60,Math.ceil(l.rulerVisibleWidth/60)),e.ruler.top.rows=["day","minute","second"],e.ruler.bottom.rows=e.ruler.top.rows.toReversed(),d=e.timezone==="UTC"?t.getUTCFullYear():t.getFullYear(),y=String(e.timezone==="UTC"?t.getUTCHours():t.getHours()).padStart(2,"0"),w=String(e.timezone==="UTC"?t.getUTCMinutes():t.getMinutes()).padStart(2,"0"),e.ruler.filters.decorations.day={replacer:`${u}, %s ${c} ${d}`},e.ruler.filters.decorations.minute={replacer:`${y}:${w}`};break;default:return}const k=document.getElementById("toggle-scale-tracker");k.checked&&(k.checked=!1),r.reload(e)}});let b=0;i.querySelector("#view-options").addEventListener("click",()=>{b=window.scrollY;const a=window.innerWidth-document.documentElement.clientWidth;if(document.body.style.position="fixed",document.body.style.top=`-${b}px`,document.body.style.width=`calc(100% - ${a}px)`,window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const n=window.SunorhcTimelineInstances[o].getOptions();if(n){const r=`<textarea readonly class="block p-2.5 w-full h-full font-mono text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"            >${JSON.stringify(n,null,"	").replace(/"([^"]+)":/g,"$1:")}</textarea>`;T("Current Timeline Options",r);break}}}),document.querySelectorAll('button[data-modal-hide="tester-modal"]').forEach(a=>{a.addEventListener("click",()=>{document.body.style.position="",document.body.style.top="",document.body.style.width="",window.scrollTo({top:b,left:0,behavior:"instant"});const o=document.getElementById("tester-modal");o.classList.contains("opacity-1")&&(o.classList.add("opacity-0"),o.classList.remove("opacity-1"))})}),document.getElementById("download-json").addEventListener("click",a=>{const o=a.currentTarget,n=o.getAttribute("class")||"",r=o.textContent;if(o.setAttribute("disabled",""),o.setAttribute("class","text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"),o.textContent="Downloading...",window.hasOwnProperty("SunorhcTimelineInstances"))for(const l in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[l].getOptions();if(e){const s="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(e,null,2)),t=document.createElement("a");t.setAttribute("href",s),(async()=>btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(`${performance.now()*1e6}`))))))().then(u=>{t.setAttribute("download",`TimelineOptions-${u}.json`),document.body.appendChild(t),t.click(),t.remove()}).catch(u=>{console.error("Failed to download:",u)}).finally(()=>{setTimeout(()=>{o.removeAttribute("disabled"),o.setAttribute("class",n),o.textContent=r},300)});break}}}),i.querySelector(".alnum-only").addEventListener("input",a=>{const o=a.currentTarget,n=o.value;o.value=n.replace(/[^a-zA-Z0-9\.]/g,"")})}g.setupTester=p,Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});
