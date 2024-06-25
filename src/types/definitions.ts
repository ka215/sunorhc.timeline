// Type aliases:

//type FixedType = 'bar' | 'point' | 'mixed';
//type Scale = 'millennium' | 'century' | 'decade' | 'lustrum' | 'year' | 'month' | 'week' | 'weekday' | 'day' | 'hour' | 'quarter-hour' | 'half-hour' | 'minute' | 'second' | 'millisecond';
export type Scale = 'year' | 'month' | 'week' | 'weekday' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type SidebarPlacement = 'both' | 'left' | 'right' | 'none';
export type SidebarItemType = 'text' | 'avatar' | 'icon' | 'image';
export type RulerPlacement = 'both' | 'top' | 'bottom' | 'none';
export type RulerMonthFormat = 'numeric' | 'name';
export type PointerSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CacheExpiration = number | 'always' | 'none';
export type UserFunction<T, R> = (input?: T) => R;
export type EventNodes = string | EventNode[];
export type CurveType = 'lt' | 'rt' | 'rb' | 'lb' | 's' | 'z' | 'n' | 'u' | 'auto'; 
export type Outline = 'outside' | 'inside' | 'both' | 'none';
export type Corners = 'rounded' | 'squared';
export type LineStyle = 'solid' | 'dotted' | 'none';
export type EventsBackground = 'striped' | 'grid' | 'toned' | 'plaid' | 'none';
export type Alignment = number | 'left' | 'begin' | 'center' | 'right' | 'end' | 'current' | 'currently' | 'latest';
export type Action = 'normal' | 'modal' | 'custom' | 'none';
export type ModalSize = number | 'small' | 'medium' | 'large' | 'extralarge' | 'full';
export type StorageType = 'localStorage' | 'sessionStorage';

// Interfaces:

export interface LandmarkRole {
  display: boolean;
  label?: string;// Compatible properties of "jQuery.Timeline": `title`
  id?: string;
  flexDirection?: string;
  textAlign?: string;
  textColor?: string;
  textStyles?: string;
  textClass?: string;
}

export interface Sidebars {
  left?: HTMLDivElement;
  right?: HTMLDivElement;
}

export interface SidebarItem {
  // siid: string;// System internal value as unique sidebar item id.
  type: SidebarItemType;// for the "avatar" type, you can set only an image or for an image with text, and for the "image" type, you can set a caption text in addition to the background image; defaults to "text"
  label: string;// if type is "image", inject into element as caption
  group?: string;// set category name for grouping some sidebar items
  src?: string;// used only when type is "avatar" or "image"; inject into element as `style="--bg-image: url({src})"`
  action?: string;// execute this action when click sidebar item; locate to that if set URL
  onClick?: boolean;// toggles execution of click events for sidebar items. If false, the event will not fire even if set the "action"
  textOverflow?: boolean;// inject into an element of text the `data-text-overflow="hidden"` if true; defaults to false
  textPosition?: string;// regex pattern of allowed format is `/^(center|top|bottom)?\s?(center|left|right)?$/i`
  textColor?: string;// inject into an element of text the `data-(text|caption)-color="{color}"` if set color
  textStyles?: string;
  iconClass?: string;
  iconContent?: string;
  iconWrapClass?: string;
}

export interface SidebarRole {
  placement: SidebarPlacement;
  sticky?: boolean;
  overlay?: boolean;
  width?: number | string;
  itemHeight?: number | string;
  items: SidebarItem[];
}

export interface DecorationFormat {
  [key: string]: {
    prefix?: string;
    suffix?: string;
    replacer?: string;
  } | undefined
}

export interface Rulers {
  top?: HTMLDivElement;
  bottom?: HTMLDivElement;
}

export interface RulerFilter {
  decorations?: DecorationFormat;
  monthFormat?: RulerMonthFormat;
  monthNames?: string[];
  dayNames?: string[];
  abbreviateMonthNameLength?: number;
  abbreviateDayNameLength?: number;
  fullStop?: boolean;
  dayBackgroundColor?: boolean;
}

export interface RulerConfig {
  rows: string[];// Compatible properties of "jQuery.Timeline": `lines`
  rowHeight?: number | string;// Compatible properties of "jQuery.Timeline": `height` 
  fontSize?: number | string;
  textColor?: string;// Compatible properties of "jQuery.Timeline": `color`
  backgroundColor?: string;// Compatible properties of "jQuery.Timeline": `background`
  //locale?: string;
  //format?: FormatOptions;
}

export interface RulerRole {
  placement: RulerPlacement;
  truncateLowers?: boolean;// Whether to truncate rulers below the updated scale when zooming, default to false.
  firstDayOfWeek?: number;// Weekday number 0 equal Sunday, default to 0 (American format).
  minGrainWidth?: number | string;
  filters?: RulerFilter;
  top?: RulerConfig;
  bottom?: RulerConfig;
}

export interface RelationConfig {
  before: string | number;// Set an event ID or internal UID that you want to connect relation as the immediately preceding event node in chronological order.
  after: string | number;// Set the event ID or internal UID that you want to associate as the immediately following event node in chronological order.
  lineSize?: number;// The thickness of the line connecting event nodes using a pixel value.
  lineColor?: string;// The color of the line connecting event nodes.
  curve: CurveType | boolean;// Whether or not to curve the shape of the line connecting event nodes, or the format of the curve.
  [key: string]: any;// Something configs as optional.
}

export interface EventNode {
  eventId?: string;// Individual event identification name should be unique. If not specified, it will be automatically generated internally.
  uid?: number;// You cannot set externally for the system internal value. This value must be strictly unique in the entire event list.
  x?: number;// System internal value; the horizontal axis coordinate of the event on the timeline container.
  y?: number;// System internal value; the vertical axis coordinate of the event on the timeline container.
  w?: number;// System internal value; the width of event node when has range.
  h?: number;// System internal value; the height of event node when has range.
  s?: DateTimeObject;// System internal value; the start datetime of event node that parsed.
  e?: DateTimeObject;// System internal value; the end datetime of event node that parsed.
  start: string; // The datetime string at the start of the event is required for all events.
  end?: string;// When the end datetime for an event is specified, the event node is displayed as a range event.
  row?: number;// An index number of row (start from 1) in sidebar items. If specified, the event can be forced to place to the row of the specified index number.
  group?: string;// Sidebar group name to which the event belongs. If there is a group enabled on the sidebar side, the event will be placed in that sidebar group's row and grouping will occur.
  label?: string;// Can be specified as the summary title of the event node. If specified, it will be used as the label when displaying the range of the event node.
  content?: string;// If a URL is specified and remote is true, content data will be fetched from the specified URL when fires the open event.
  textColor?: string;// Text color if label is specified.
  backgroundColor?: string;// Background color of the event node.
  borderColor?: string;// Event node border color.
  borderWidth?: number;// Width of the event node border.
  classes?: string;// Class attribute value added to the event node's element. Multiple entries can be specified by separating them with half-width spaces.
  styles?: string;// Adds inline style attributes to event node elements.
  image?: string;// Inserts the specified image into the background of the event node element.
  //margin?: number;
  size?: PointerSize;// You can set the number of pixels or "xs", "sm", "md", "lg", "xl". Default is "md".
  remote?: boolean;// Fetch data from url set in content on open event if true. Default is false.
  expiration?: CacheExpiration;// Set an expiration time cached event; a number is seconds from cached, always abort cache on open if "always", ever cached at no-expires into specific storage if "none".
  relation?: RelationConfig;
  extends?: Record<string, any>;// Converts the specified object into a JSON string and inserts it into the data-event-extends attribute of the event node element.
  callback?: UserFunction<any, void>;// You can register a callback that will be called on the "OpenEvent" event that occurs when the event node is clicked.
}

export interface Layouts {
  elevation?: number;
  outlined?: Outline;
  outlineCorner?: Corners;
  outlineStyle?: LineStyle;
  hideScrollbar?: boolean;// Whether to hide scrollbars for overflow elements in the timeline element. Default to true if omitted.
  eventsBackground?: EventsBackground;
  width: number | string;
  height: number | string;
  rtl?: boolean;// Whether the content direction within the timeline element is right-to-left. Default to false if omitted.
}

export interface Effects {
  presentTime: boolean;// default is false.
  defaultAlignment: Alignment;
  cacheExpiration: CacheExpiration;// Set an expiration time cached all events; a number is seconds from cached, always reset cache when initialize library if "always", ever cached at no-expires into specific storage if "none". Default is "always".
  hoverEvent: boolean;// default is false.
  onClickEvent: Action;
  template?: {
    tooltip?: string;
    modal?: {
      size?:   ModalSize;
      header?: string;
      body?:   string;
      footer?: string;
    },
    details?: string;
    custom?: string | Function;
  };
}

interface ThemeColors {
  [key: string]: any;
}

interface EventColors {
  [key: string]: any;
}

export interface ThemeConfig {
  name?: string;
  theme?: ThemeColors;
  event?: EventColors;
  hookEventColors?: any;
  hookChangeModeClass?: string;
}

export interface ExtendedOptions {
  zoomScaleTracker?: boolean;
  [key: string]: any;
}

export interface TimelineOptions {
  start: string | Date;// Compatible properties of "jQuery.Timeline": `startDatetime`
  end: string | Date;// Compatible properties of "jQuery.Timeline": `endDatetime`
  timezone: string;
  //type: FixedType;
  scale: Scale;
  file?: string | null;
  header: LandmarkRole;// Compatible properties of "jQuery.Timeline": `headline`
  footer: LandmarkRole;
  //range: number | string;
  sidebar: SidebarRole;
  ruler: RulerRole;
  events: string | EventNodes;// Compatible properties of "jQuery.Timeline": `eventData`; By specifying the URL strings, event data can be loaded asynchronously when the timeline is initialized.
  layout: Layouts;
  effects: Effects;
  theme: ThemeConfig;// Compatible properties of "jQuery.Timeline": `colorScheme`
  useStorage: StorageType;// Compatible properties of "jQuery.Timeline": `storage`
  zoomable: boolean;// Compatible properties of "jQuery.Timeline": `zoom`
  //wrapScale: boolean;
  debug: boolean;
  extends?: ExtendedOptions;
}

export interface TimelineBaseClass {
  elementId: string;
  targetElement: HTMLDivElement;
  fragmentNode: DocumentFragment;
  options?: TimelineOptions;
}

export interface DateTimeObject {
  year: number;
  month: number;
  monthName: string;
  day: number;
  weekday: string;
  weeks: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  ISO: string;
  ts: number;
  cept: number;
  y: (digit?: number) => string;
  m: (digit?: number) => string;
  mn:(digit?: number, addPeriod?: boolean) => string;
  d: (digit?: number) => string;
  w: (digit?: number) => string;
  wd:(digit?: number, addPeriod?: boolean) => string;
  h: (digit?: number) => string;
  mi:(digit?: number) => string;
  s: (digit?: number) => string;
  ms:(digit?: number) => string;
}

export interface Particles {
  years: number;
  months: number;
  weeks: number;
  days: number;
  weekdays: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface Measures {
  startDate: DateTimeObject;
  endDate: DateTimeObject;
  particles: Particles;
  injectTo: DOMRect;
  container: DOMRect;
  containerWidth: number;
  containerHeight: number;
  containerTop: number;
  containerLeft: number;
  bodyHeight?: number;
  sidebarWidth: number;
  sidebarHeight: number;
  sidebarVisibleHeight?: number;
  sidebarOffsetTop: number;
  sidebarOffsetBottom: number;
  sidebarItemHeight: number;
  sidebarItems: number;
  rulerVisibleWidth: number;
  rulerActualWidth: number;
  rulerTopRows: number;
  rulerBottomRows: number;
  rulerTopHeight: number;
  rulerBottomHeight: number;
  rulerMaxCols: number;
}

export interface RulerOptions {
  globalScale: Scale;
  timezone: string;
  scale: Scale;
  order: number;
  minGrainWidth: number;
  placement: RulerPlacement;
  firstDayOfWeek: number;
  config: RulerConfig;
  filters: RulerFilter;
  maxCols: number;
  startDate: DateTimeObject;
  endDate: DateTimeObject;
}

export interface StageRange {
  width: number;
  height: number;
  minScaleWidth: number;
  maxRows: number;
  rowHeight: number;
  startDate: DateTimeObject;
  sts?: number;// unit is seconds as timestamp
  scept?: number;// unit is seconds as C.E. epoch time
  endDate: DateTimeObject;
  ets?: number;// unit is second as timestamp
  ecept?: number;// unit is seconds as C.E. epoch time
  //baseY?: number;// Base point Y coordinate of one event in the stage range.
  //baseX?: number;// Base point X coordinate of one event in the stage range.
}

export interface EventChecker {
  containerSize: {
    width: number;
    height: number
  };
  eventX: number;
  eventY: number;
  eventWidth: number;
  eventHeight: number;
  eventDisplayArea: number;
  startBeforeRange: boolean;
  startAfterRange: boolean;
  endBeforeRange: boolean;
  endAfterRange: boolean;
  isOutOfRange: boolean;
  eventLessThanRow: boolean;
  eventExceedingRows: boolean;
  isOutOfRows: boolean;
  isEnableEvent: boolean;
}

export interface ZoomScaleOptions {
  prevScale?: Scale;
  scale: Scale;
  start: string | Date;// To be allowed the numeric string as timestamp.
  end: string | Date;// To be allowed the numeric string as timestamp.
  ruler?: RulerRole;
}