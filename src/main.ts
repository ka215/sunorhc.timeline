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
        //start: '2024-05-01',
        //timezone: 'Asia/Tokyo',
        //type: 'point',
        scale: 'minute',
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
            { type: 'image',  label: '韋叡 - Wei Rui', group: 'group1', src: 'sample_1.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom right', textColor: '#fef3c7' },
            { type: 'image',  label: 'Lyena Loki', group: 'group2', src: 'sample_2.png', action: '', onClick: false, textOverflow: true, textPosition: 'center center', textColor: '#dcfce7' },
            { type: 'image',  label: '浅葱 Felice', group: 'group3', src: 'sample_3.png', action: '', onClick: false, textOverflow: true, textPosition: 'top right', textColor: '#e9d5ff' },
            { type: 'image',  label: '浅葱 Misha', group: 'group4', src: 'sample_4.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: '#f5d0fe' },
            { type: 'image',  label: '高田 美緒', group: 'group5', src: 'sample_5.png', action: '', onClick: false, textOverflow: true, textPosition: 'top left', textColor: '#fda4af' },
            { type: 'image',  label: 'Ysaac Hunter', group: 'group6', src: 'sample_6.png', action: '', onClick: false, textOverflow: true, textPosition: 'bottom left', textColor: '#e0f2fe' },
          ]
        },
        ruler: {
          placement: 'both',
          minGrainWidth: 24,
          filters: {
            decorations: {
              //year: { prefix: '西暦 ', suffix: ' 年' },
              //month: { suffix: '<span style="margin-left: 2px">月</span>' },
              //week: { replacer: '<small class="text-gray-500" style="margin-right: 2px">第</small>%s<small class="text-gray-500" style="margin-left: 2px">週</small>' },//{ prefix: '第', suffix: '週' },
              //hours: { suffix: '時' },
              //minutes: { replacer: '%s<small class="text-gray-500" style="margin-left: 2px">分</small>' },
              //seconds: { suffix: '<small class="text-gray-500" style="margin-left: 2px">秒</small>' },
            },
            monthFormat: 'numeric',
            //monthFormat: 'name',
            //monthNames: ['睦月', '如月', '弥生', '卯月', '皐月', '水無月', '文月', '葉月', '長月', '神無月', '霜月', '師走'],
            //monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            //dayNames: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],// sun = 0
            //abbreviateMonthNameLength: 2,
            abbreviateDayNameLength: 3,
            fullStop: true,
            dayBackgroundColor: true,
          },
          top: {
            rows: [
              'year',
              'month',
              //'week',
              'day',
              'weekday',
              'hours',
              'minutes',
              //'seconds',
              //'milliseconds',
            ]
          },
          bottom: {
            rows: [
              //'milliseconds',
              //'seconds',
              'minutes',
              'hours',
              //'weekday',
              'day',
              //'week',
              'month',
              'year',
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
        },
        theme: { hookChangeModeClass: 'darkmode--activated' },
        header: {
          display: true,
          label: 'Sunorhc.Timeline Demo Type 3',
          id: 'hoge-hoge',
          flexDirection: 'row',
          //textAlign: 'right',
          textColor: '#f59e0b',
          // Properties that duplicate textAlign and textColor settings will be overwritten.
          textStyles: 'font-size: 36px; font-weight: 700; color: #4d7c0f;',
          textClass: 'text-teal-600 dark:text-teal-400',
        },
        footer: {
          display: true,
          label: '&copy; MAGIC METHODS 2024, Powered by Sunorhc.Timeline v1.0.0',
          textColor: 'gray',
          textClass: '',
        },
        //events: './events.json',
        //events: './testMonth.json',
        //events: './testDay.json',
        events: './testHour.json',
        /*
        events: [
          { start: '2024-5-19' },
          { start: '2024-5-22 17:23' },
          { start: '2024-5-31 12:34' },
        ], */
      }
      await SunorhcTimeline.create('myTimelineWithInputOptions', inputOptions as TimelineOptions )
      .then((onFulfilled?: SunorhcTimeline): void => {
        // Continuation processing after instantiation can be chained here.
        console.log('Success:', onFulfilled!.getOptions())
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
