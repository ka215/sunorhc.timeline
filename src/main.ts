import './styles/main.sass'
import { SunorhcTimeline } from './sunorhc-timeline.ts'
import { setupTester } from './sunorhc-timeline-tester.ts'
import { TimelineOptions } from './types/definitions.ts'

// Set type of handling to dispatch plugin:
const creationType: number = 3

switch(creationType) {
  case 1:
    /**
     * Instantiate multiple timeline components at once.
     * However, in this case, events that occur on the timeline are handled by the timeline component that was instantiated last only.
     */
    const timelineInstances: { [key: string]: any } = {}
    document.querySelectorAll<HTMLDivElement>('[data-appname="sunorhc.timeline"]')!.forEach(async (element: HTMLDivElement): Promise<void> => {
      let id: string = element.id
      if (id !== '') {
        if (id === 'myTimelineWithInputOptions') {
          timelineInstances[id] = await SunorhcTimeline.create(id, {} as TimelineOptions)
        } else {
          timelineInstances[id] = await SunorhcTimeline.create(id)
        }
        console.log(`Got options of "#${id}" timeline:`, timelineInstances[id].getOptions())
      }
    })
    break
  case 2:
    /**
     * Instantiate specified timeline component individually.
     */
    (async () => {
      const ST = await SunorhcTimeline.create('myTimelineWithExternalOptions')
      console.log('Got options of timeline instancenated:', ST.getOptions())
    })()
    break
  case 3:
    /**
     * Chain continuation processing to asynchronously instantiated timeline components.
     */
    (async () => {
      const inputOptions: Partial<TimelineOptions> = {
        start: new Date(new Date().setHours(new Date().getHours() - 1, 0, 0, 0)),// now before a hour
        //start: new Date(new Date('0001-01-01T00:00:00Z').setUTCFullYear(1)),// When want to use valid date with less than three-digit years
        //start: '164/1/1 0:0:0Z',// Dates with three or more digits can be used normally.
        //start: '2024/6/4 12:30',// for test of minute scale with JST
        //start: '2024-06-04T06:59:30Z',// for test of second scale
        //start: '2024-06-04T06:59:59.950Z',// for test of millisecond scale
        //end: '2024-06-04T07:00:30Z',// for test of second scale or "auto"
        //end: '2024-06-04T07:00:00.049Z',// for test of millisecond scale
        //end: '169/12/31 23:59:59Z',
        //end: new Date(new Date().setDate((new Date().getDate() + 2))),// Next day
        end: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),// after 24 hours from now
        //timezone: 'Asia/Tokyo',
        //type: 'point',
        scale: 'hour',
        sidebar: {
          placement: 'both',
          items: [
            /*
            { type: 'avatar', label: 'Item Label', group: 'group1', src: '/avatar_01.png', action: './', onClick: true, textOverflow: true, textPosition: 'center', textColor: '' },
            { type: 'avatar', label: '', group: 'group1', src: './avatar_02.png', action: 'https://js2ts.com/', onClick: true, textOverflow: false, textPosition: 'center', textColor: '' },
            { type: 'icon',   label: 'material icon', group: 'group2', src: '', action: 'alert("Clicked!")', onClick: true, textOverflow: true, textPosition: 'center', textColor: '', iconClass: 'material-icons fill-current', iconContent: 'face', iconWrapClass: 'text-gray900 dark:text-gray100' },
            { type: 'icon',   label: 'font awesome', group: 'group2', src: '', action: 'alert("Clicked!!")', onClick: false, textOverflow: false, textPosition: 'center', textColor: '', iconClass: 'fa-regular fa-face-smile _fa-spin', iconContent: '', iconWrapClass: 'text-violet-500 dark:text-violet-400' },
            { type: 'text',   label: 'You can handle by "textOverflow" if might overflow the label of long text.', group: 'group3', src: '', action: '', onClick: false, textOverflow: true, textPosition: 'top left', textColor: 'brown' },
            { type: 'text',   label: 'Full text shown if the "textOverflow" is false.', group: 'group3', src: '', action: '', onClick: false, textOverflow: false, textPosition: 'center', textColor: '' },
            { type: 'image',  label: 'Can put background image', group: 'group4', src: 'avatar_05.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: 'white' },
            { type: 'image',  label: '', group: 'group4', src: './avatar_06.png', action: '', onClick: false, textOverflow: true, textPosition: 'center', textColor: 'gray' },
            *//*
            { type: 'avatar', label: 'Sasha Ulbricht',  group: 'S.U.', src: './avatar_06.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Naseem Oliver',   group: 'N.O.', src: './avatar_08.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Richard Halley',  group: 'R.H.', src: './avatar_07.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Caryn Tailor',    group: 'C.T.', src: './avatar_01.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Issac Madison',   group: 'I.M.', src: './avatar_02.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Enrique Landon',  group: 'E.L.', src: './avatar_04.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Ilia Naegelen',   group: 'I.N.', src: './avatar_05.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Eleonora Talwar', group: 'E.T.', src: './avatar_09.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            { type: 'avatar', label: 'Harold Xiang',    group: 'H.X.', src: './avatar_03.png', action: '', onClick: false, textOverflow: false, textPosition: 'center', textStyles: 'font-size: 13px; width: 70px; text-align: left;' },
            */
            { type: 'image',  label: 'Bottom Right'/*'韋叡 - Wei Rui'*/, group: 'group1', src: 'sample_1.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom right', textColor: '#fef3c7' },
            { type: 'image',  label: 'Center Center'/*'Lyena Loki'*/, group: 'group2', src: 'sample_2.png', action: '', onClick: false, textOverflow: true, textPosition: 'center center', textColor: '#dcfce7' },
            { type: 'image',  label: 'Top Right'/*'浅葱 Felice'*/, group: 'group3', src: 'sample_3.png', action: '', onClick: false, textOverflow: true, textPosition: 'top right', textColor: '#e9d5ff' },
            { type: 'image',  label: 'Bottom Left'/*'浅葱 Misha'*/, group: 'group4', src: 'sample_4.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: '#f5d0fe' },
            { type: 'image',  label: 'Top Left'/*'高田 美緒'*/, group: 'group5', src: 'sample_5.png', action: '', onClick: false, textOverflow: true, textPosition: 'top left', textColor: '#fda4af' },
            { type: 'image',  label: 'Bottom Center'/*'Ysaac Hunter'*/, group: 'group6', src: 'sample_6.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom center', textColor: '#e0f2fe' },
          ]
        },
        ruler: {
          placement: 'both',
          minGrainWidth: 60,
          truncateLowers: true,
          firstDayOfWeek: 0,
          filters: {
            decorations: {
              //year: { prefix: '西暦 ', suffix: ' 年' },
              year: { prefix: 'l\'an ', suffix: ' de notre ère' },// French
              //month: { suffix: '<span style="margin-left: 2px">月</span>' },
              //week: { replacer: '<small class="text-gray-500" style="margin-right: 2px">第</small>%s<small class="text-gray-500" style="margin-left: 2px">週</small>' },//{ prefix: '第', suffix: '週' },
              //hours: { suffix: '時' },
              //minutes: { replacer: '%s<small class="text-gray-500" style="margin-left: 2px">分</small>' },
              //seconds: { suffix: '<small class="text-gray-500" style="margin-left: 2px">秒</small>' },
            },
            //monthFormat: 'numeric',
            monthFormat: 'name',
            //monthNames: ['睦月', '如月', '弥生', '卯月', '皐月', '水無月', '文月', '葉月', '長月', '神無月', '霜月', '師走'],// legacy Japanese
            //monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],// Japanese
            //monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],// German
            monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],// French
            //monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],// Spanish
            //dayNames: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],// sun = 0; Japanese
            //dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],// German
            dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],// French
            //dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],// Spanish
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
              'hours',
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
              'hours',
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
          //height: 760,
          //height: 960,
          height: 640,
          //rtl: true,
        } as any,
        effects: {
          presentTime: true,
          defaultAlignment: 'current',
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
          label: '<a href="https://github.com/ka215/sunorhc.timeline">Follow us on GitHub</a>, powered by Sunorhc.Timeline v0.9.0',
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
        events: './testHour.json',
        //events: './testMinute.json',
        //events: './testSecond.json',
        //events: './testMillisecond.json',
        /*
        events: [
          { start: '2024-5-19' },
          { start: '2024-5-22 17:23' },
          { start: '2024-5-31 12:34' },
        ], */
        zoomable: true,
      }
      await SunorhcTimeline.create('myTimelineWithInputOptions', inputOptions as TimelineOptions )
      .then((onFulfilled?: SunorhcTimeline): void => {
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


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="sunorhc-timeline-tester"></div>
`

setupTester(document.querySelector<HTMLDivElement>('#sunorhc-timeline-tester')!)
