import * as packageJson from '../package.json'
import { TimelineOptions, EventNode, EventNodes } from '@/types/definitions'
import { Timeline } from '@/SunorhcTimeline'

// Set type of handling to dispatch plugin:
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const type: number = Number(urlParams.get('type'))
const creationType: number = !isNaN(type) && type > 0 ? type : 3

switch(creationType) {
  case 1:
    /**
     * Instantiate multiple timeline components at once.
     * However, in this case, events that occur on the timeline are handled by the timeline component that was instantiated last only.
     */
    Timeline.create('myTimelineWithDatasetOptions').then(instance => {
      console.log('Got options of timeline instancenated:', instance.getOptions())
    })
    break
  case 2:
    /**
     * Instantiate specified timeline component individually.
     */
    (async () => {
      const ST = await Timeline.create('myTimelineWithExternalOptions')
      console.log('Got options of timeline instancenated:', ST.getOptions())
    })()
    break
  case 3:
    /**
     * Chain continuation processing to asynchronously instantiated timeline components.
     */
    (async () => {
      // For set auto time
      const autoScale = 'day'
      const autoStartDate = new Date(new Date().getTime() - getScaleTime('month') / 2)
      const autoEndDate = new Date(new Date().getTime() + getScaleTime('month') / 2)
      const autoSidebarPlacement = updateSizeVariable(['left', 'left', 'both'])
      const autoRulerPlacement = updateSizeVariable(['top', 'top', 'both'])
      const inputOptions: Partial<TimelineOptions> = {
        start: autoStartDate,
        //start: new Date(new Date().setHours(new Date().getHours() - 1, 0, 0, 0)),// now before a hour
        //start: new Date(new Date('0001-01-01T00:00:00Z').setUTCFullYear(1)),// When want to use valid date with less than three-digit years
        //start: '164/1/1 0:0:0Z',// Dates with three or more digits can be used normally.
        //start: '2024/6/4 12:30',// for test of minute scale with JST
        //start: '2024-06-04T06:59:30Z',// for test of second scale
        //start: '2024-06-04T06:59:59.950Z',// for test of millisecond scale
        //end: '2024-06-04T07:00:30Z',// for test of second scale or "auto"
        //end: '2024-06-04T07:00:00.049Z',// for test of millisecond scale
        //end: '169/12/31 23:59:59Z',
        //end: new Date(new Date().setDate((new Date().getDate() + 2))),// Next day
        //end: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),// after 24 hours from now
        end: autoEndDate,
        //timezone: 'Asia/Tokyo',
        //scale: 'hour',
        scale: autoScale,
        sidebar: {
          placement: autoSidebarPlacement,
          items: ((sidebarType = 3) => {
            switch(sidebarType) {
              case 1: return [
                { type: 'avatar', label: 'Item Label', group: 'group1', src: '/avatar_01.png', action: './', onClick: true, textOverflow: true, textPosition: 'center', textColor: '' },
                { type: 'avatar', label: '', group: 'group1', src: './avatar_02.png', action: 'https://js2ts.com/', onClick: true, textOverflow: false, textPosition: 'center', textColor: '' },
                { type: 'icon',   label: 'material icon', group: 'group2', src: '', action: 'alert("Clicked!")', onClick: true, textOverflow: true, textPosition: 'center', textColor: '', iconClass: 'material-icons fill-current', iconContent: 'face', iconWrapClass: 'text-gray900 dark:text-gray100' },
                { type: 'icon',   label: 'font awesome', group: 'group2', src: '', action: 'alert("Clicked!!")', onClick: false, textOverflow: false, textPosition: 'center', textColor: '', iconClass: 'fa-regular fa-face-smile _fa-spin', iconContent: '', iconWrapClass: 'text-violet-500 dark:text-violet-400' },
                { type: 'text',   label: 'You can handle by "textOverflow" if might overflow the label of long text.', group: 'group3', src: '', action: '', onClick: false, textOverflow: true, textPosition: 'top left', textColor: 'brown' },
                { type: 'text',   label: 'Full text shown if the "textOverflow" is false.', group: 'group3', src: '', action: '', onClick: false, textOverflow: false, textPosition: 'center', textColor: '' },
                { type: 'image',  label: 'Can put background image', group: 'group4', src: 'avatar_05.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: 'white' },
                { type: 'image',  label: '', group: 'group4', src: './avatar_06.png', action: '', onClick: false, textOverflow: true, textPosition: 'center', textColor: 'gray' },
              ]
              case 2: return [
                { type: 'avatar', label: 'Sasha Ulbricht',  group: 'S.U.', src: './avatar_06.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Naseem Oliver',   group: 'N.O.', src: './avatar_08.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Richard Halley',  group: 'R.H.', src: './avatar_07.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Caryn Tailor',    group: 'C.T.', src: './avatar_01.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Issac Madison',   group: 'I.M.', src: './avatar_02.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Enrique Landon',  group: 'E.L.', src: './avatar_04.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Ilia Naegelen',   group: 'I.N.', src: './avatar_05.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Eleonora Talwar', group: 'E.T.', src: './avatar_09.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
                { type: 'avatar', label: 'Harold Xiang',    group: 'H.X.', src: './avatar_03.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
              ]
              default: return [
                { type: 'image',  label: 'Bottom Right', group: 'group1', src: 'sample_1.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom right', textColor: '#fef3c7' },
                { type: 'image',  label: 'Center Center', group: 'group2', src: 'sample_2.png', action: '', onClick: false, textOverflow: true, textPosition: 'center center', textColor: '#dcfce7' },
                { type: 'image',  label: 'Top Right', group: 'group3', src: 'sample_3.png', action: '', onClick: false, textOverflow: true, textPosition: 'top right', textColor: '#e9d5ff' },
                { type: 'image',  label: 'Bottom Left', group: 'group4', src: 'sample_4.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: '#f5d0fe' },
                { type: 'image',  label: 'Top Left', group: 'group5', src: 'sample_5.png', action: '', onClick: false, textOverflow: true, textPosition: 'top left', textColor: '#fda4af' },
                { type: 'image',  label: 'Bottom Center', group: 'group6', src: 'sample_6.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom center', textColor: '#e0f2fe' },
              ]
            }
          })()
        },
        ruler: {
          placement: autoRulerPlacement,
          minGrainWidth: 60,
          truncateLowers: true,
          firstDayOfWeek: 0,
          filters: {
            decorations: ((type = -1) => {
              switch(type){
                case 1: return {// Japanese
                    year:    { prefix: '西暦 ', suffix: ' 年' },
                    month:   { suffix: '<span style="margin-left: 2px">月</span>' },
                    week:    { replacer: '<small class="text-gray-500" style="margin-right: 2px">第</small>%s<small class="text-gray-500" style="margin-left: 2px">週</small>' },//{ prefix: '第', suffix: '週' },
                    hours:   { suffix: '時' },
                    minutes: { replacer: '%s<small class="text-gray-500" style="margin-left: 2px">分</small>' },
                    seconds: { suffix: '<small class="text-gray-500" style="margin-left: 2px">秒</small>' },
                  };
                case 4: return {// French
                    year: { prefix: 'l\'an ', suffix: ' de notre ère' },// French
                  };
                default: return undefined;
              }
            })(),
            //monthFormat: 'numeric',
            monthFormat: 'name',
            monthNames: ((type = 4) => {
              switch(type){
                case 0:  return ['睦月', '如月', '弥生', '卯月', '皐月', '水無月', '文月', '葉月', '長月', '神無月', '霜月', '師走'];// legacy Japanese
                case 1:  return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];// Japanese
                case 2:  return ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];// German
                case 3:  return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];// Spanish
                case 4:  return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];// French
                default: return undefined;
              }
            })(),
            dayNames: ((type = 4) => {
              switch(type){
                case 1:  return ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];// sun = 0; Japanese
                case 2:  return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];// German
                case 3:  return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];// Spanish
                case 4:  return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];// French
                default: return undefined;
              }
            })(),
            //abbreviateMonthNameLength: 2,
            abbreviateDayNameLength: 3,
            fullStop: true,
            dayBackgroundColor: true,
          },
          top: {
            rows: [
              'year',
              'month',
              'week',
              'day',
              'weekday',
              //'hours',
              //'minutes',
              //'seconds',
              //'milliseconds',
            ]
          },
          bottom: {
            rows: [
              //'milliseconds',
              //'seconds',
              //'minutes',
              //'hours',
              //'weekday',
              'day',
              //'week',
              'month',
              //'year',
            ]
          },
        },
        layout: {
          //elevation: 1,
          outlined: 'inside',
          outlineCorner: 'rounded',
          outlineStyle: 'solid',
          hideScrollbar: true,
          //eventsBackground: 'striped',
          //eventsBackground: 'grid',
          //eventsBackground: 'toned',
          eventsBackground: 'plaid',
          //eventsBackground: 'none',
          //width: 1080,
          //height: 960,
          //height: 750,
          height: 540,
          //height: 480,
          //height: 360,
          //rtl: true,
        } as any,
        effects: {
          presentTime: true,
          defaultAlignment: 'current',
          hoverEvent: true,
          onClickEvent: 'modal',
          template: {
            modal: {
              size: "large",
            },
            details: "<div class=\"mb-2\">\
<h3 class=\"font-bold text-md text-cyan-500\">%label%</h3>\
<small class=\"flex items-center justify-center text-gray-500\"><span>%s.weekday%, %s.day% %s.monthName% %s.year%</span>\
<span class=\"pb-px mx-2 text-gray-400\">&mdash;</span>\
<span>%end|undefined%</span></small>\
</div>\
<hr>\
<p class=\"p-4 text-left\">%content|None%</p>",
            //custom: (...args: any) => console.log('Closure specified directly in the options was called.', ...args),
            custom: 'customFunction',
            tooltip: "<ul class=\"text-left\">\
<li>%start% ～ %end|None%<li>\
<li class=\"flex gap-4\"><span>X: %x%,</span><span>Width: %w|Undefined%</span></li>\
<li class=\"flex gap-4\"><span>Y: %y%,</span><span>Height: %h|Undefined%</span></li>\
<li>EventId: <span style=\"color:#f87171;font-weight:600;\">%eventId%</span></li>\
<li class=\"text-cyan-500 dark:text-cyan-700\">%label|Untitled%</li>\
</ul>",
          },
        } as any,
        theme: { hookChangeModeClass: 'darkmode--activated' },
        header: {
          display: true,
          label: 'Sunorhc.Timeline Demo <small>(Normal Dispatch Type)</small>',
          id: 'headline-title',
          flexDirection: 'row',
          //textAlign: 'right',
          textColor: '#f59e0b',
          // Properties that duplicate textAlign and textColor settings will be overwritten.
          textStyles: 'margin-bottom: 24px; font-size: 36px; font-weight: 700; color: #4d7c0f;',
          textClass: 'text-teal-600 dark:text-teal-400',
        },
        footer: {
          display: true,
          label: `powered by Sunorhc.Timeline v${packageJson.version}`,
          textColor: 'gray',
          textStyles: 'margin-top: 20px;',
          textClass: '',
        },
        //events: './events.json',
        //events: './testYear.json',
        //events: './testYear2.json',
        //events: './testMonth.json',
        //events: './testWeek.json',
        //events: './testDay.json',
        //events: './testHour.json',
        //events: './testMinute.json',
        //events: './testSecond.json',
        //events: './testMillisecond.json',
        /*
        events: [
          { start: '2024-5-19' },
          { start: '2024-5-22 17:23' },
          { start: '2024-5-31 12:34' },
        ], */
        events: generateRandomEventNodes(autoStartDate.toISOString(), autoEndDate.toISOString(), 6, 12),
        zoomable: true,
        extends: {
          zoomScaleTracker: true,
        },
      }
      await Timeline.create('myTimelineWithInputOptions', inputOptions as TimelineOptions )
      .then((onFulfilled?: Timeline): void => {
        // Continuation processing after instantiation can be chained here.

        onFulfilled!.initialized((self: any) => {
          const originOptions = self.getOptions()
          if (!self.options.hasOwnProperty('extends')) {
            self.options.extends = { originOptions: originOptions }
          }
          console.log('initialized!!!', self.options, originOptions)
        })

        console.log('Success:', window.SunorhcTimelineInstances, onFulfilled!.getOptions())
      }, (onRejected?: Error): void => {
        // Error handling when instantiation fails.
        console.error('Error:', onRejected)
      })
    })()
    break
}

// Methods of automatic random events generation for the tester.

/**
 * Gets the time in milliseconds according to the specified date and time scale.
 * @param {string} scale 
 * @returns 
 */
function getScaleTime(scale: string): number {
  switch(scale) {
    case 'year':
      return Math.floor(365.25 * 24 * 60 * 60 * 1000)
    case 'month':
      return Math.floor(30.4375 * 24 * 60 * 60 * 1000)
    case 'week':
      return 7 * 24 * 60 * 60 * 1000
    case 'day':
      return 24 * 60 * 60 * 1000
    case 'hour':
      return 60 * 60 * 1000
    case 'minutes':
      return 60 * 1000
    case 'second':
      return 1000
    case 'millisecond':
    default:
      return 1
  }
}

/**
 * Get a random datetime within the specified start and end dates.
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Date}
 */
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Gets a random element from the specified array.
 * @param {any[]} arr
 * @returns {any}
 */
function getRandomElementFromArray(arr: any[]): any {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

/**
 * Generate dummy text that looks as natural as possible.
 * @param {number} maxPhrases - The maximum number of phrases (words) that the dummy text may contain.
 * @param {number} phraseLength - The maximum number of characters that will make up the generated dummy phrase.
 * @param {string | undefined} lineBreak - The character to which the line feed code is converted when the dummy 
 *                                         text is separated by paragraphs.
 * @returns {string}
 */
function generateDummyText(maxPhrases: number, phraseLength: number, lineBreak?: string): string {
  // Order based on frequency of alphabetical characters used in English phrases.
  const alphabets = 'etaoinshrdlcumwfgypbvkjxqz'
  const alphabet = [...alphabets].map((char, idx) => char.repeat(alphabets.length - idx)).join('')

  // Closures
  const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
  }
  const weightedRandomChoice = (choices: number[], weights: number[], k: number = 1): number[] | number => {
    const result = []
    const cumulativeWeights = []
    let sum = 0
  
    for (let weight of weights) {
      sum += weight
      cumulativeWeights.push(sum)
    }
  
    for (let i = 0; i < k; i++) {
      const rand = Math.random() * sum
      for (let j = 0; j < cumulativeWeights.length; j++) {
        if (rand < cumulativeWeights[j]) {
          result.push(choices[j])
          break
        }
      }
    }
  
    return result.length === 1 ? result[0] : result
  }
  const getRandomChar = (): string => {
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  const getRandomPhrase = (length: number): string => {
    let phrase = ''
    for (let i = 0; i < length; i++) {
      phrase += getRandomChar()
    }
    return phrase
  }
  
  maxPhrases = Math.ceil(getRandomArbitrary(Math.floor(Math.abs(Math.sin(getRandomArbitrary(1, phraseLength) + 1) * maxPhrases)), maxPhrases))

  const choicesPhraseLength = Array.from({ length: phraseLength }, (_, index) => index + 1)
  const weightedValue = 5.2// Average number of letters in an English word (source by Google Books Ngram).
  const weightedPhraseLength = choicesPhraseLength.map(x => Math.floor((1 / Math.abs(x - weightedValue)) * 10))

  const choicesWords = Array.from({ length: 20 }, (_, index) => index + 1)
  const averageWords = 17// Average number of words in a typical English sentence (source by Google Books Ngram).
  const weightedWords = choicesWords.map(x => {
    const w = Math.floor((1 / Math.abs(x - averageWords)) * 10)
    return w > 10 ? 20 : w
  })

  let phrases = []
  let phrase = ''
  let result = ''
  let separater = ''
  let paragraphs = 0
  let sentences = 0
  let words = 0
  for (let i = 0; i < maxPhrases; i++) {
    if (words > (weightedRandomChoice(choicesWords.slice(7), weightedWords.slice(7), 1) as number)) {
      separater = '.'
    } else {
      separater = ' '
    }
    phrase = getRandomPhrase(weightedRandomChoice(choicesPhraseLength, weightedPhraseLength, 1) as number)
    if (separater === '.') {
      result += phrase + separater
      result = result.trim()
      if (result.length > 0) {
        phrases.push(result.charAt(0).toUpperCase() + result.slice(1))
      }
      result = ''
      sentences++
      words = 0
    } else {
      if (phrase.length === 1) {
        // A one-letter phrase is joined to the next phrase with an apostrophe.
        result += phrase + "'"
      } else {
        result += phrase + separater
        words++
      }
    }
    if (sentences >= getRandomArbitrary(3, 5)) {
      phrases.push("\n")
      paragraphs++
      sentences = 0
    }
  }

  result = result.trim()
  if (result.length > 0) {
    phrase = result.charAt(0).toUpperCase() + result.slice(1)
    // If the sentence ends with an apostrophe, "s" is forcibly added.
    phrase += /'$/.test(phrase) ? 's' : ''
    phrases.push(phrase + '.')
  }

  result = phrases.join(' ')

  if (!!lineBreak) {
    result = result.replace(/\n/g, lineBreak)
  }

  return result
}

/**
 * Generates a random collection of events on the timeline, avoiding overlapping events.
 * @param {string} startDate - A datetime string representing the start date and time of the timeline on which the 
 *                             generated event will be placed.
 * @param {string} endDate - A datetime string representing the end date and time of the timeline on which the generated 
 *                           event will be placed.
 * @param {number} maxRows - The maximum number of rows in the timeline that the generated event will be placed on.
 * @param {number} numberOfEvents - The number of events to generate.
 * @returns {EventNodes}
 */
function generateRandomEventNodes(
  startDate: string,
  endDate: string,
  maxRows: number,
  numberOfEvents: number,
): EventNodes {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const eventNodes: EventNodes = []
  
  for (let i = 0; i < numberOfEvents; i++) {
    let eventStart: Date
    let eventEnd: Date
    let row: number
    let overlap: boolean
    const size = getRandomElementFromArray(['xs', 'sm', 'md', 'lg', 'xl'])

    do {
      overlap = false
      eventStart = getRandomDate(start, end)
      eventEnd = getRandomDate(eventStart, end)
      row = Math.floor(Math.random() * maxRows) + 1

      for (const event of eventNodes) {
        const existingStart = new Date(event.start)
        const existingEnd = new Date(event.end ?? event.start)

        if (
          row === event.row && 
          (eventStart < existingEnd && eventEnd > existingStart)
        ) {
          overlap = true
          break
        }
      }
    } while (overlap)
    
    const eventNode: EventNode = {
      start: eventStart.toISOString(),
      end: eventEnd.toISOString(),
      row: row,
      label: `Event ${i + 1} [Size: ${size}]`,
      //content: generateRandomText(20, 10),
      content: generateDummyText(200, 10, '<br>'),
      textColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      borderWidth: 1,// Math.floor(Math.random() * 5) + 1,
      classes: '',
      styles: '',
      image: '',
      size: size,
      remote: false
    }

    eventNodes.push(eventNode)
  }

  return eventNodes
}

/**
 * Returns the elements of a given array depending on the browser window size.
 * @param {any[]} vars
 * @returns {any}
 */
function updateSizeVariable(vars: any[]): any {
  const width = window.innerWidth
  if (width <= 600) {
    // for small size as likes smart device.
    return vars[0]
  } else if (width <= 1024) {
    // for medium size as likes tablet device.
    return vars[1]
  } else {
    // for large size as likes pc etc.
    return vars[2]
  }
}

