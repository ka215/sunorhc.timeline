(function(d,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(d=typeof globalThis<"u"?globalThis:d||self,c(d.Sunorhc={}))})(this,function(d){"use strict";function c(n){var p;n.innerHTML=`
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
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="select-outlined" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Outline:</label>
    <div for="select-outlined" class="w-36 h-max border border-blue-500 rounded-lg _focus:ring-blue-500 _focus:border-blue-500 dark:border-gray-600 _dark:focus:ring-blue-500 _dark:focus:border-blue-500">
      <select id="select-outlined" class="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
        <option hidden>Choose Outline</option>
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
        <option hidden>Choose Elevation</option>
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
        <option hidden>Choose Style</option>
        <option value="">Style None</option>
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
    <input type="text" id="grain-width" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="48px" pattern="[A-Za-z0-9.]*" inputmode="latin" />
  </div>
  <div class="flex flex-col items-start w-28 h-max">
    <label for="row-height" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Row Height</label>
    <input type="text" id="row-height" class="alnum-only bg-gray-50 border-solid border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80px" pattern="[A-Za-z0-9.]*" inputmode="latin" />
  </div>
  <div class="flex flex-col items-start w-36 h-max">
    <label for="toggle-scale-tracker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scale Tracker:</label>
    <label class="inline-flex items-center my-2 cursor-pointer">
      <input id="toggle-scale-tracker" type="checkbox" name="scale-tracker" value="1" class="sr-only peer">
      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">On Tracking</span>
    </label>
  </div>
</div>
`;const s=document.querySelectorAll(".sunorhc-timeline-container");window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?(console.log("Dark mode now"),s.forEach(t=>t.classList.add("dark-theme"))):(console.log("Light mode now"),s.forEach(t=>t.classList.remove("dark-theme"))),(p=window==null?void 0:window.matchMedia("(prefers-color-scheme: dark)"))==null||p.addEventListener("change",t=>{const r=t.matches;console.log("Changed mode:",r?"dark":"light",t),s.forEach(o=>r?o.classList.add("dark-theme"):o.classList.remove("dark-theme"))});const f=document.querySelector(".darkmode-toggle");Object.assign(f.style,{zIndex:9999,boxShadow:"0px 5px 20px 1px rgba(0, 0, 0, 0.4)"}),new MutationObserver(t=>{for(const r of t)r.type==="attributes"&&r.attributeName==="class"&&(r.target.classList.contains("darkmode--activated")?(console.log("Toggled to darkmode with darkmode.js",s),s.forEach(e=>e.classList.add("dark-theme"))):(console.log("Toggled to lightmode with darkmode.js",s),s.forEach(e=>e.classList.remove("dark-theme"))))}).observe(document.body,{attributes:!0,childList:!1,subtree:!1}),n.querySelector("#toggle-rtl").addEventListener("change",t=>{const r=t.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[o],a=e.getOptions().layout;a.rtl=r.checked,e.reload({layouts:a})}}),n.querySelector("#select-timezone").addEventListener("change",t=>{const r=t.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[o];console.log("!!!:",r.value),e.reload({timezone:r.value})}}),n.querySelector("#select-outlined").addEventListener("change",t=>{const r=t.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[o],a=e.getOptions().layout;a.outlined=r.value,e.reload({layouts:a})}}),n.querySelector("#select-elevation").addEventListener("change",t=>{document.querySelectorAll(".sunorhc-timeline-container").forEach(o=>{const e=t.currentTarget;o.dataset.timelineElevation=e.value!==""?e.value:""})}),n.querySelector("#select-placement").addEventListener("change",t=>{const r=t.currentTarget,[o,e]=r.value.split(":");if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const a in window.SunorhcTimelineInstances){const l=window.SunorhcTimelineInstances[a],u=l.getOptions();let i=null;o==="sidebar"?(i={sidebar:u.sidebar},i.sidebar.placement=e):(i={ruler:u.ruler},i.ruler.placement=e),console.log("!!!:",o,e,i),l.reload(i)}}),n.querySelector("#select-canvas-layout").addEventListener("change",t=>{document.querySelectorAll(".sunorhc-timeline-nodes").forEach(o=>{const e=t.currentTarget;o.dataset.background=e.value!==""?e.value:""})}),n.querySelector("#select-start-weekday").addEventListener("change",t=>{const r=t.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[o],a=e.getOptions().ruler;a.firstDayOfWeek=Number(r.value),console.log("!!!:",a),e.reload({ruler:a})}}),n.querySelector("#select-alignment").addEventListener("change",t=>{if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const r in window.SunorhcTimelineInstances){const o=t.currentTarget;window.SunorhcTimelineInstances[r].align(o.value,e=>{console.log("Do Alignment:",o.value,e)})}}),n.querySelector("#run-reload").addEventListener("click",()=>{if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const t in window.SunorhcTimelineInstances)document.getElementById(t).classList.add("preparing"),setTimeout(()=>{const o=window.SunorhcTimelineInstances[t].getOptions();let e={effects:{defaultAlignment:"end"}};if(o.hasOwnProperty("extends")&&o.extends.hasOwnProperty("originOptions")){const a=o.extends.originOptions,l={start:a.start,end:a.end,scale:a.scale,sidebar:a.sidebar,ruler:a.ruler},u=parseInt(n.querySelector("#grain-width").value||"48",10),i=parseInt(n.querySelector("#row-height").value||"80",10);isNaN(u)||(l.ruler.minGrainWidth=`${u}px`),isNaN(i)||(l.sidebar.itemHeight=`${i}px`),e={...e,...l},console.log("originOptions:",l,e)}window.SunorhcTimelineInstances[t].reload(e,a=>{console.log("Reloaded:",a),window.scrollTo({left:0,top:a.targetElement.offsetTop,behavior:"smooth"})})},300)}),n.querySelector("#toggle-scale-tracker").addEventListener("change",t=>{const r=t.currentTarget;if(window.hasOwnProperty("SunorhcTimelineInstances"))for(const o in window.SunorhcTimelineInstances){const e=window.SunorhcTimelineInstances[o].getOptions().extends??{};if(e.hasOwnProperty("zoomScaleTracker")&&e.zoomScaleTracker){const a=document.getElementById(o);let l;r.checked?(l=document.createElement("div"),l.classList.add("zoom-scale-coordinates-tracker"),l.setAttribute("style","position: absolute; bottom: 0; left: 0; display: none; flex-wrap: wrap; justify-content: start; text-align: left; font-size: 12px; color: #555; background-color: #fff; border: solid 1px #ddd; border-radius: 4px; width: max-content; max-width: 50%; height: max-content; padding: 2px 4px; z-index: 9999;"),a.querySelector(".sunorhc-timeline-footer").append(l)):(l=a.querySelector(".zoom-scale-coordinates-tracker"),a.querySelector(".sunorhc-timeline-footer").removeChild(l))}}else r.checked=!1}),n.querySelector(".alnum-only").addEventListener("input",t=>{const r=t.currentTarget,o=r.value;r.value=o.replace(/[^a-zA-Z0-9\.]/g,"")})}d.setupTester=c,Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})});
