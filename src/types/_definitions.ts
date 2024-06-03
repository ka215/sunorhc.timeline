type FixedType = 'bar' | 'point' | 'mixed';
type Scale = 'millennium' | 'century' | 'decade' | 'lustrum' | 'year' | 'month' | 'week' | 'weekday' | 'day' | 'hour' | 'quarter-hour' | 'half-hour' | 'minute' | 'second' | 'millisecond';
type Alignment = number | 'left' | 'begin' | 'center' | 'right' | 'end' | 'current' | 'currently' | 'latest';
type SidebarPlacement = 'both' | 'left' | 'right' | 'none';
type RulerPlacement = 'both' | 'top' | 'bottom' | 'none';
type Action = 'normal' | 'modal' | 'custom' | 'none';
type StorageType = 'localStorage' | 'sessionStorage';
type outlineStyle = 'solid' | 'dotted' | 'none';

interface FormatOptions {
  [key: string]: any;
}

interface LandmarkRole {
  display?: boolean;
  label?: string;
  range?: boolean;
  locale?: string;
  format?: FormatOptions;
}

interface SidebarRole {
  placement?: SidebarPlacement;
  sticky?: boolean;
  overlay?: boolean;
  width?: number | string;
  itemHeight?: number | string;
  items?: { [key: string]: any }[];
}

interface RulerConfig {
  rows?: string[];
  rowHeight?: number | string;
  fontSize?: number | string;
  textColor?: string;
  backgroundColor?: string;
  locale?: string;
  format?: FormatOptions;
}

interface RulerRole {
  placement?: RulerPlacement;
  truncateLowers?: boolean;
  minGrainWidth?: number | string;
  top?: RulerConfig;
  bottom?: RulerConfig;
}

interface Event {
  [key: string]: any;
}

type EventNodes = Event[];

interface Layouts {
  elevation?: number;
  outline?: boolean;
  hideScrollbar?: boolean;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}

interface Effects {
  presentTime?: boolean;
  defaultAlignment?: Alignment;
  firstDayOfWeek?: number;
  hoverEvent?: boolean;
  onClickEvent?: Action;
  stripedGridRow?: boolean;
  horizontalGridStyle?: outlineStyle;
  verticalGridStyle?: outlineStyle;
}

interface ThemeColors {
  [key: string]: any;
}

interface EventColors {
  [key: string]: any;
}

interface ThemeConfig {
  name?: string;
  theme?: ThemeColors;
  event?: EventColors;
  hookEventColors?: any;
}

interface ExtedOptions {
  [key: string]: any;
}

export interface TimelineOptions {
  start?: string;
  end?: string;
  timezone?: string;
  type?: FixedType;
  scale?: Scale;
  file?: string | null;
  header?: LandmarkRole;
  footer?: LandmarkRole;
  range?: number | string;
  sidebar?: SidebarRole;
  ruler?: RulerRole;
  events?: string | EventNodes;
  layout?: Layouts;
  effects?: Effects;
  theme?: ThemeConfig;
  useStorage?: StorageType;
  zoomable?: boolean;
  wrapScale?: boolean;
  debug?: boolean;
  extends?: ExtedOptions;
}

export interface Timeline {
  elementId: string;
  targetElement: HTMLDivElement;
  fragmentNode: DocumentFragment;
  options?: TimelineOptions;
}

type OptionValidators<T> = {
  [K in keyof T]?: (value: T[K]) => T[K] | undefined;
};

export const validateTimelineOptions = <T>(obj: T, validatorObj?: OptionValidators<T>): Partial<T> => {
  const newObj: Partial<T> = {}

  const defaultValidators: OptionValidators<T> = {
    start: (v: string | undefined): string => v || 'currently',
    end: (v: string | undefined): string => v || 'auto',
    timezone: (v: string | undefined): string => v || 'UTC',
    type: (v: FixedType | undefined): FixedType => v || 'mixed',
    scale: (v: Scale | undefined): Scale => v || 'day',
    file: (v: string | null | undefined): string | null | undefined => v,
    header: (v: LandmarkRole | undefined): LandmarkRole => v || { display: false },
    footer: (v: LandmarkRole | undefined): LandmarkRole => v || { display: false },
    range: (v: number | string | undefined): number | string => v || 'auto',
    sidebar: (v: SidebarRole | undefined): SidebarRole => v || { placement: 'both', items: [] },
    ruler: (v: RulerRole | undefined): RulerRole => v || { placement: 'both' },
    events: (v: string | EventNodes | undefined): string | EventNodes => v || [],
    layout: (v: Layouts | undefined): Layouts => v || { elevation: 0 },
    effects: (v: Effects | undefined): Effects => v || { presentTime: false },
    theme: (v: ThemeConfig | undefined): ThemeConfig => v || { name: 'default' },
    useStorage: (v: StorageType | undefined): StorageType => v || 'sessionStorage',
    zoomable: (v: boolean | undefined): boolean => !!v,
    wrapScale: (v: boolean | undefined): boolean => v !== undefined ? v : true,
    debug: (v: boolean | undefined): boolean => !!v,
  }

  const validator = validatorObj || defaultValidators

  for (const key in obj) {
    if (key in validator && typeof validator[key] === 'function') {
      const result = validator[key]!(obj[key])
      if (result !== undefined) {
        newObj[key] = result
      }
    } else {
      console.warn(`Property "${key}" is not defined in the TimelineOptions interface and will be ignored.`)
    }
  }

  return newObj
}
