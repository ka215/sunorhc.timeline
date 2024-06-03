// Methods for validating option objects with user input.
// Validator Objects:
// validatorLandmarkRole, validatorSidebarItem, validatorSidebarRole, validatorRulerFilter, validatorRulerConfig,
// validatorRulerRole, validatorRelationConfig, validatorEventNode, validatorLayouts, validatorEffects,
// validatorThemeConfig, validatorTimelineOptions 
// Methods:
// validateTimelineOptions

import * as Def from '../types/definitions'


type OptionValidators<T> = {
    //[K in string as keyof T]?: (v: T[K]) => T;
    //[K in Extract<keyof T, any>]?: (value: T[K]) => T[K] | undefined;
    [K in keyof T]?: (v: T[K]) => T[K] | undefined;
};

export const validatorLandmarkRole: OptionValidators<Def.LandmarkRole> = {
    display: (v: boolean | number | string | undefined): boolean => !v || !/^(boolean|number|string)$/.test(typeof v) ? false : /^(0|1|false|true)$/i.test(String(v)) ? /^(1|true)$/i.test(String(v)) : false,
    label:   (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    id:      (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    flexDirection: (v: string | undefined): string => !v || typeof v !== 'string' || !/^(column|row)$/.test(v) ? 'column' : v,
    textAlign: (v: string | undefined): string | undefined => !v || typeof v !== 'string' || !/^(left|center|right)$/i.test(v) ? undefined : v,
    textColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    textStyles: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    textClass: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
}

export const validatorSidebarItem: OptionValidators<Def.SidebarItem> = {
    type: (v: Def.SidebarItemType | undefined): Def.SidebarItemType => !v || typeof v !== 'string' || !/^(text|avatar|image)$/i.test(v) ? 'text' : v as Def.SidebarItemType,
    label: (v: string | undefined): string => !v || typeof v !== 'string' ? '' : v,
    group: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    src: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    action: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    onClick: (v: boolean | number | string | undefined): boolean | undefined => !v || !/^(boolean|number|string)$/.test(typeof v) ? undefined : /^(0|1|false|true)$/i.test(String(v)) ? /^(1|true)$/i.test(String(v)) : false,
    textOverflow: (v: boolean | number | string | undefined): boolean => !v || !/^(boolean|number|string)$/.test(typeof v) ? false : /^(0|1|false|true)$/i.test(String(v)) ? /^(1|true)$/i.test(String(v)) : false,
    textPosition: (v: string | undefined): string | undefined => !v || typeof v !== 'string' || !/^(top|center|bottom)?(\s+)?(left|center|right)?$/i.test(v) ? undefined : v,
    textColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    textStyles: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    iconClass: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    iconContent: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    iconWrapClass: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
}

export const validatorSidebarRole: OptionValidators<Def.SidebarRole> = {
    placement:  (v: string | undefined): Def.SidebarPlacement => !v || typeof v !== 'string' || !/^(both|left|right|none)$/i.test(v) ? 'both' : v.toLowerCase() as Def.SidebarPlacement,
    sticky:     (v: boolean | undefined): boolean => !v || typeof v !== 'boolean' ? false : v,
    overlay:    (v: boolean | undefined): boolean => !v || typeof v !== 'boolean' ? false : v,
    width:      (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? '150px' : (/^\d+(|px)$/.test(String(v)) ? v : '150px'),
    itemHeight: (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? '80px' : (/^\d+(|px)$/.test(String(v)) ? v : '80px'),
    items:      (v: Def.SidebarItem[] | undefined): Def.SidebarItem[] => !v || !Array.isArray(v) || v.length == 0 ? [] as Def.SidebarItem[] : v.map((e: Def.SidebarItem) => validateTimelineOptions<Def.SidebarItem>(e, validatorSidebarItem) as Def.SidebarItem),
}

export const validatorRulerFilter: OptionValidators<Def.RulerFilter> = {
    decorations: (v: Def.DecorationFormat | undefined): Def.DecorationFormat | undefined => !v || typeof v !== 'object' ? undefined : v,
    monthFormat: (v: Def.RulerMonthFormat | undefined): Def.RulerMonthFormat | undefined => !v || typeof v !== 'string' || !/^(numeric|name)$/.test(v) ? undefined : v,
    monthNames: (v: string[] | undefined): string[] | undefined => !v || !Array.isArray(v) ? undefined : (v.length > 0 ? v : undefined),
    dayNames: (v: string[] | undefined): string[] | undefined => !v || !Array.isArray(v) ? undefined : (v.length > 0 ? v : undefined),
    abbreviateMonthNameLength: (v: number | undefined): number | undefined => !v || typeof v !== 'number' ? undefined : v,
    abbreviateDayNameLength: (v: number | undefined): number | undefined => !v || typeof v !== 'number' ? undefined : v,
    fullStop: (v: boolean | undefined): boolean | undefined => typeof v === 'boolean' ? v : undefined,
    dayBackgroundColor: (v: boolean | undefined): boolean | undefined => typeof v === 'boolean' ? v : undefined,
}

export const validatorRulerConfig: OptionValidators<Def.RulerConfig> = {
    rows:      (v: string[] | undefined): string[] => !v || !Array.isArray(v) || v.length == 0 ? [ 'day' ] : v,
    rowHeight: (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? '24px' : (/^\d+(|px)$/.test(String(v)) ? v : '24px'),
    fontSize:  (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? '16px' : (/^\d+(|px)$/.test(String(v)) ? v : '16px'),
    textColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    backgroundColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    //locale:    (v: string | undefined): string => !v || typeof v !== 'string' ? 'en-US' : v,
    //format:    (v: FormatOptions | undefined): FormatOptions | undefined => !v || typeof v !== 'object' ? undefined : v as FormatOptions,
}

export const validatorRulerRole: OptionValidators<Def.RulerRole> = {
    placement:      (v: Def.RulerPlacement | undefined): Def.RulerPlacement => !v || typeof v !== 'string' || !/^(both|top|bottom|none)$/i.test(v) ? 'both' : v.toLowerCase() as Def.RulerPlacement,
    truncateLowers: (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : false,
    minGrainWidth:  (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? '48px' : (/^\d+(|px)$/.test(String(v)) ? v : '48px'),
    filters:        (v: Def.RulerFilter | undefined): Def.RulerFilter | undefined => !v || typeof v !== 'object' ? undefined : validateTimelineOptions<Def.RulerFilter>(v, validatorRulerFilter) as Def.RulerFilter,
    top:            (v: Def.RulerConfig | undefined): Def.RulerConfig => !v || typeof v !== 'object' ? { rows: [ 'day' ] } : validateTimelineOptions<Def.RulerConfig>(v, validatorRulerConfig) as Def.RulerConfig,
    bottom:         (v: Def.RulerConfig | undefined): Def.RulerConfig => !v || typeof v !== 'object' ? { rows: [ 'day' ] } : validateTimelineOptions<Def.RulerConfig>(v, validatorRulerConfig) as Def.RulerConfig,
}

export const validatorRelationConfig: OptionValidators<Def.RelationConfig> = {
    before: (v: string | number | undefined): string | number => !v || !/^(string|number)$/.test(typeof v) ? '' : v,
    after: (v: string | number | undefined): string | number => !v || !/^(string|number)$/.test(typeof v) ? '' : v,
    lineSize: (v: number | undefined): number | undefined => !v || typeof v !== 'number' ? undefined : v,
    lineColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    curve: (v: Def.CurveType | boolean | undefined): Def.CurveType | boolean => typeof v === 'boolean' ? v : (!!v && /^((l|r)(t|b)|s|z|n|u|auto)$/.test(String(v)) ? v : false),
}
  
export const validatorEventNode: OptionValidators<Def.EventNode> = {
    eventId: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    /* System internal values does not validate.:*/
    uid: (v: number | undefined): number | undefined => v || undefined,
    x: (v: number | undefined): number | undefined => v || undefined,
    y: (v: number | undefined): number | undefined => v || undefined,
    w: (v: number | undefined): number | undefined => v || undefined,
    h: (v: number | undefined): number | undefined => v || undefined,
    s: (v: Def.DateTimeObject | undefined): Def.DateTimeObject | undefined => v || undefined,
    e: (v: Def.DateTimeObject | undefined): Def.DateTimeObject | undefined => v || undefined,
    start: (v: string | undefined): string => !v || typeof v !== 'string' ? '' : v,
    end: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    row: (v: number | undefined): number => !v || typeof v !== 'number' ? 0 : v,
    group: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    label: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    content: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    textColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    backgroundColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    borderColor: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    borderWidth: (v: number | undefined): number | undefined => !v || typeof v !== 'number' ? undefined : v,
    classes: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    styles: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    image: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
    size: (v: Def.PointerSize | undefined): Def.PointerSize => !v || !/^(string|number)$/.test(typeof v) ? 'md' : (/^(\d+|xs|sm|md|lg|xl)$/i.test(String(v)) ? v : 'md'),
    remote: (v: boolean | undefined): boolean => !v || typeof v !== 'boolean' ? false : v,
    expiration: (v: Def.CacheExpiration | undefined): Def.CacheExpiration => !v || !/^(string|number)$/.test(typeof v) ? 'always' : (/^(\d+|always|none)$/i.test(String(v)) ? v : 'always'),
    relation: (v: Def.RelationConfig | undefined): Def.RelationConfig | undefined => !v || typeof v !== 'object' ? undefined : validateTimelineOptions<Def.RelationConfig>(v, validatorRelationConfig) as Def.RelationConfig,
    extends: (v: Record<string, any> | undefined): Record<string, any> | undefined => !v || typeof v !== 'object' ? undefined : v,
    callback: (v: Def.UserFunction<any, void> | undefined): Def.UserFunction<any, void> | undefined => !v || typeof v !== 'function' ? undefined : v,
}

export const validatorLayouts: OptionValidators<Def.Layouts> = {
    elevation:     (v: number | undefined): number => !v || typeof v !== 'number' ? 0 : (v > 4 ? 4 : v),// max 4
    outlined:      (v: Def.Outline | undefined): Def.Outline => !v || typeof v !== 'string' || !/^(outside|inside|both|none)$/.test(v) ? 'inside' : String(v) as Def.Outline,
    outlineCorner: (v: Def.Corners | undefined): Def.Corners => !v || typeof v !== 'string' || !/^(rounded|squared)$/.test(v) ? 'squared' : String(v) as Def.Corners,
    outlineStyle:  (v: Def.LineStyle | undefined): Def.LineStyle => !v || typeof v !== 'string' || !/^(solid|dotted|none)$/.test(v) ? 'solid' : String(v) as Def.LineStyle,
    hideScrollbar: (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : true,
    eventsBackground: (v: Def.EventsBackground | undefined): Def.EventsBackground => !v || typeof v !== 'string' || !/^(striped|grid|toned|plaid|none)$/.test(v) ? 'plaid' : String(v) as Def.EventsBackground,
    width:         (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? 'auto' : (typeof v === 'number' ? v : (/^(\d+(px|%|vw)|auto|inherit|(max|min|fit)-content)$/.test(v) ? v : 'auto')),
    height:        (v: number | string | undefined): number | string => !v || !/^(number|string)$/.test(typeof v) ? 'auto' : (typeof v === 'number' ? v : (/^(\d+(px|%|vh)|auto|inherit|(max|min|fit)-content)$/.test(v) ? v : 'auto')),
}

export const validatorEffects: OptionValidators<Def.Effects> = {
    presentTime:      (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : false,
    defaultAlignment: (v: Def.Alignment | undefined): Def.Alignment => !v || !/^(string|number)$/.test(typeof v) || !/^(\d+|left|begin|center|right|end|current(|ly)|latest)$/i.test(String(v)) ? 'latest' : (typeof v === 'string' ? v.toLowerCase() : v) as Def.Alignment,
    //firstDayOfWeek:   (v: number | undefined): number => !v || typeof v !== 'number' ? 0 : (v > 6 ? 6 : (v < 0 ? 0 : Math.floor(v))),// default to 0 (equal Sunday)
    cacheExpiration:  (v: Def.CacheExpiration | undefined): Def.CacheExpiration => !v || !/^(string|number)$/.test(typeof v) || !/^(\d+|always|none)$/i.test(String(v)) ? 'always' : v as Def.CacheExpiration,
    hoverEvent:       (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : false,
    onClickEvent:     (v: Def.Action | undefined): Def.Action => !v || typeof v !== 'string' || !/^(normal|modal|custom|none)$/i.test(v) ? 'normal' : v as Def.Action,
    //stripedGridRow:   (v: boolean | number | string | undefined): boolean | undefined => !v || !/^(boolean|number|string)$/.test(typeof v) ? undefined : /^(0|1|false|true)$/i.test(String(v)) ? /^(1|true)$/i.test(String(v)) : false,
    //horizontalGridStyle: (v: string | undefined): LineStyle | undefined => !v || typeof v !== 'string' || !/^(solid|dotted|none)$/i.test(v) ? undefined : v as LineStyle,
    //verticalGridStyle:   (v: string | undefined): LineStyle | undefined => !v || typeof v !== 'string' || !/^(solid|dotted|none)$/i.test(v) ? undefined : v as LineStyle,
}

export const validatorThemeConfig: OptionValidators<Def.ThemeConfig> = {
    name: (v: string | undefined): string | undefined=> !v || typeof v !== 'string' ? undefined : v,
    //theme: ThemeColors;
    //event: EventColors;
    //hookEventColors: any;
    hookChangeModeClass: (v: string | undefined): string | undefined => !v || typeof v !== 'string' ? undefined : v,
}

export const validatorTimelineOptions: OptionValidators<Def.TimelineOptions> = {
    start:      (v: string | Date | undefined): string | Date => v || 'currently',
    end:        (v: string | Date | undefined): string | Date => v || 'auto',
    timezone:   (v: string | undefined): string => v || 'UTC',
    //type:       (v: string | undefined): FixedType => !v || typeof v !== 'string' || !/^(bar|point|mixed)$/i.test(v) ? 'mixed' : v.toLowerCase() as FixedType,
    //scale:      (v: string | undefined): Scale => !v || typeof v !== 'string' || !/^(millennium|century|decade|lustrum|year|month|week|(week|)day|(quarter|half|)-?hour|minute|second|millisecond)$/i.test(v) ? 'day' : v.toLowerCase() as Scale,
    scale:      (v: Def.Scale | undefined): Def.Scale => !v || typeof v !== 'string' || !/^(year|month|week|(week|)day|hour|minute|second|millisecond)$/i.test(v) ? 'day' : v.toLowerCase() as Def.Scale,
    file:       (v: string | null | undefined): string | undefined => !v ? undefined : (typeof v === 'string' ? v : undefined),
    header:     (v: Def.LandmarkRole | undefined): Def.LandmarkRole => !v || typeof v !== 'object' ? { display: false } : validateTimelineOptions<Def.LandmarkRole>(v, validatorLandmarkRole) as Def.LandmarkRole,
    footer:     (v: Def.LandmarkRole | undefined): Def.LandmarkRole => !v || typeof v !== 'object' ? { display: false } : validateTimelineOptions<Def.LandmarkRole>(v, validatorLandmarkRole) as Def.LandmarkRole,
    //range:      (v: number | string | undefined): number | string => !v || (typeof v !== 'number' && typeof v !== 'string') ? 'auto' : v,
    sidebar:    (v: Def.SidebarRole | undefined): Def.SidebarRole => !v || typeof v !== 'object' ? { placement: 'both', sticky: false, overlay: false, width: '150px', itemHeight: '80px', items: [] } : validateTimelineOptions<Def.SidebarRole>(v, validatorSidebarRole) as Def.SidebarRole,
    ruler:      (v: Def.RulerRole | undefined): Def.RulerRole => !v || typeof v !== 'object' ? { placement: 'both', minGrainWidth: '48px' } : validateTimelineOptions<Def.RulerRole>(v, validatorRulerRole) as Def.RulerRole,
    events:     (v: Def.EventNodes | undefined): Def.EventNodes => !v || !/^(string|object)$/.test(typeof v) ? [] : (Array.isArray(v) ? v.map((node: Def.EventNode) => validateTimelineOptions<Def.EventNode>(node, validatorEventNode) as Def.EventNode) as Def.EventNodes : (typeof v === 'string' ? v as Def.EventNodes : [])),
    //layout:     (v: Layouts | undefined): Layouts => !v || typeof v !== 'object' ? { elevation: 0, outlined: 'inside', hideScrollbar: true, width: 'auto', height: 'auto' } as Layouts : validateTimelineOptions<Layouts>(v, validatorLayouts) as Layouts,
    layout:     (v: Def.Layouts | undefined): Def.Layouts | undefined => !v || typeof v !== 'object' ? undefined : validateTimelineOptions<Def.Layouts>(v, validatorLayouts) as Def.Layouts,
    effects:    (v: Def.Effects | undefined): Def.Effects => !v || typeof v !== 'object' ? { presentTime: false, defaultAlignment: 'latest', cacheExpiration: 'always', hoverEvent: true, onClickEvent: 'normal' } : validateTimelineOptions<Def.Effects>(v, validatorEffects) as Def.Effects,
    theme:      (v: Def.ThemeConfig | undefined): Def.ThemeConfig | undefined => !v || typeof v !== 'object' ? undefined : validateTimelineOptions<Def.ThemeConfig>(v, validatorThemeConfig) as Def.ThemeConfig,
    useStorage: (v: Def.StorageType | undefined): Def.StorageType => !v || typeof v !== 'string' || !/^(session|local)Storage$/i.test(v) ? 'sessionStorage' : v as Def.StorageType,
    zoomable:   (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : false,
    debug:      (v: boolean | undefined): boolean => typeof v === 'boolean' ? v : false,
    extends:    (v: Def.ExtendedOptions | undefined): Def.ExtendedOptions | undefined => !v || typeof v !== 'object' ? undefined : v as Def.ExtendedOptions,
}

export const validateTimelineOptions = <T>(obj: T, validatorObj?: OptionValidators<T>): Partial<T> => {
    const newObj: Partial<T> = {} // New object to be partial of TimelineOptions.
  
    //let validator = !validatorObj || typeof validatorObj !== 'object' || Object.keys(validatorObj).length == 0 ? defaultValidators : validatorObj
    const validator: any = validatorObj || validatorTimelineOptions
  
    for (const key in obj) {
      if (key in validator && typeof validator[key] === 'function') {
        const result = validator[key](obj[key])
        //console.log('Checked Options:', key, obj[key], '->', result)
        if (result !== undefined) {
          newObj[key] = result
        }
      } else {
        // If the property is undefined in validator, remove it from options.
        console.warn(`Property "%c${key}%c" is not defined in the TimelineOptions interface and will be ignored.`, 'color:red;font-weight:bold;', '');
      }
    }
  
    return newObj
}
  