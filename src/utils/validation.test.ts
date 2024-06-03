import * as Def from '../types/definitions'
import { validatorLandmarkRole, validatorSidebarItem, validatorSidebarRole, validatorRulerFilter, validatorRulerConfig, validatorRulerRole, validatorRelationConfig, validatorEventNode, validatorLayouts, validatorEffects, validatorThemeConfig, validatorTimelineOptions, validateTimelineOptions } from './validation'

// Helper function to simplify testing
const runValidationTest = (validator: any, testCases: { input: any, expected: any }[]) => {
  testCases.forEach(({ input, expected }) => {
    const result = validateTimelineOptions(input, validator);
    expect(result).toEqual(expected)
  })
}

describe('Validator Tests', () => {

  describe('validatorLandmarkRole', () => {
    it('should validate display correctly', () => {
      runValidationTest(validatorLandmarkRole, [
        { input: { display: 'true' }, expected: { display: true } },
        { input: { display: 'false' }, expected: { display: false } },
        { input: { display: '1' }, expected: { display: true } },
        { input: { display: '0' }, expected: { display: false } },
        { input: { display: 'invalid' }, expected: { display: false } },
      ])
    })

    it('should validate label correctly', () => {
      runValidationTest(validatorLandmarkRole, [
        { input: { label: 'test' }, expected: { label: 'test' } },
        { input: { label: 123 }, expected: { label: undefined } },
      ])
    })

    it('should validate id correctly', () => {
      runValidationTest(validatorLandmarkRole, [
        { input: { id: 'test-id' }, expected: { id: 'test-id' } },
        { input: { id: 123 }, expected: { id: undefined } },
      ])
    })

    it('should validate flexDirection correctly', () => {
      runValidationTest(validatorLandmarkRole, [
        { input: { flexDirection: 'row' }, expected: { flexDirection: 'row' } },
        { input: { flexDirection: 'invalid' }, expected: { flexDirection: 'column' } },
      ])
    })

    it('should validate textAlign correctly', () => {
      runValidationTest(validatorLandmarkRole, [
        { input: { textAlign: 'left' }, expected: { textAlign: 'left' } },
        { input: { textAlign: 'invalid' }, expected: { textAlign: undefined } },
      ])
    })
  })

  describe('validatorSidebarItem', () => {
    it('should validate type correctly', () => {
      runValidationTest(validatorSidebarItem, [
        { input: { type: 'text' }, expected: { type: 'text' } },
        { input: { type: 'avatar' }, expected: { type: 'avatar' } },
        { input: { type: 'invalid' }, expected: { type: 'text' } },
      ])
    })

    it('should validate label correctly', () => {
      runValidationTest(validatorSidebarItem, [
        { input: { label: 'test' }, expected: { label: 'test' } },
        { input: { label: 123 }, expected: { label: '' } },
      ])
    })

    it('should validate group correctly', () => {
      runValidationTest(validatorSidebarItem, [
        { input: { group: 'group1' }, expected: { group: 'group1' } },
        { input: { group: 123 }, expected: { group: undefined } },
      ])
    })

    it('should validate src correctly', () => {
      runValidationTest(validatorSidebarItem, [
        { input: { src: 'http://example.com' }, expected: { src: 'http://example.com' } },
        { input: { src: 123 }, expected: { src: undefined } },
      ]);
    });

    it('should validate action correctly', () => {
      runValidationTest(validatorSidebarItem, [
        { input: { action: 'action1' }, expected: { action: 'action1' } },
        { input: { action: 123 }, expected: { action: undefined } },
      ])
    })
  })

  describe('validatorSidebarRole', () => {
    it('should validate placement correctly', () => {
      runValidationTest(validatorSidebarRole, [
        { input: { placement: 'left' }, expected: { placement: 'left' } },
        { input: { placement: 'right' }, expected: { placement: 'right' } },
        { input: { placement: 'both' }, expected: { placement: 'both' } },
        { input: { placement: 'none' }, expected: { placement: 'none' } },
        { input: { placement: 'invalid' }, expected: { placement: 'both' } },
      ])
    })

    it('should validate sticky correctly', () => {
      runValidationTest(validatorSidebarRole, [
        { input: { sticky: true }, expected: { sticky: true } },
        { input: { sticky: false }, expected: { sticky: false } },
        { input: { sticky: undefined }, expected: { sticky: false } },
        { input: { sticky: 'invalid' }, expected: { sticky: false } },
      ])
    })

    it('should validate overlay correctly', () => {
      runValidationTest(validatorSidebarRole, [
        { input: { overlay: true }, expected: { overlay: true } },
        { input: { overlay: false }, expected: { overlay: false } },
        { input: { overlay: undefined }, expected: { overlay: false } },
        { input: { overlay: 'invalid' }, expected: { overlay: false } },
      ])
    })

    it('should validate width correctly', () => {
      runValidationTest(validatorSidebarRole, [
        { input: { width: '200px' }, expected: { width: '200px' } },
        { input: { width: 200 }, expected: { width: 200 } },
        { input: { width: 'invalid' }, expected: { width: '150px' } },
      ])
    })

    it('should validate itemHeight correctly', () => {
      runValidationTest(validatorSidebarRole, [
        { input: { itemHeight: '100px' }, expected: { itemHeight: '100px' } },
        { input: { itemHeight: 100 }, expected: { itemHeight: 100 } },
        { input: { itemHeight: 'invalid' }, expected: { itemHeight: '80px' } },
      ])
    })
  })

  describe('validatorRulerFilter', () => {
    it('should validate decorations correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { decorations: {} }, expected: { decorations: {} } },
        { input: { decorations: 'invalid' }, expected: { decorations: undefined } },
      ])
    })

    it('should validate monthFormat correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { monthFormat: 'numeric' }, expected: { monthFormat: 'numeric' } },
        { input: { monthFormat: 'name' }, expected: { monthFormat: 'name' } },
        { input: { monthFormat: 'invalid' }, expected: { monthFormat: undefined } },
      ])
    })

    it('should validate monthNames correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { monthNames: ['Jan', 'Feb'] }, expected: { monthNames: ['Jan', 'Feb'] } },
        { input: { monthNames: [] }, expected: { monthNames: undefined } },
        { input: { monthNames: 'invalid' }, expected: { monthNames: undefined } },
      ])
    })

    it('should validate dayNames correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { dayNames: ['Mon', 'Tue'] }, expected: { dayNames: ['Mon', 'Tue'] } },
        { input: { dayNames: [] }, expected: { dayNames: undefined } },
        { input: { dayNames: 'invalid' }, expected: { dayNames: undefined } },
      ])
    })

    it('should validate abbreviateMonthNameLength correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { abbreviateMonthNameLength: 3 }, expected: { abbreviateMonthNameLength: 3 } },
        { input: { abbreviateMonthNameLength: 'invalid' }, expected: { abbreviateMonthNameLength: undefined } },
      ])
    })

    it('should validate abbreviateDayNameLength correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { abbreviateDayNameLength: 2 }, expected: { abbreviateDayNameLength: 2 } },
        { input: { abbreviateDayNameLength: 'invalid' }, expected: { abbreviateDayNameLength: undefined } },
      ])
    })

    it('should validate fullStop correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { fullStop: true }, expected: { fullStop: true } },
        { input: { fullStop: false }, expected: { fullStop: false } },
        { input: { fullStop: 1 }, expected: { fullStop: undefined } },
        { input: { fullStop: 'invalid' }, expected: { fullStop: undefined } },
      ])
    })

    it('should validate dayBackgroundColor correctly', () => {
      runValidationTest(validatorRulerFilter, [
        { input: { dayBackgroundColor: true }, expected: { dayBackgroundColor: true } },
        { input: { dayBackgroundColor: false }, expected: { dayBackgroundColor: false } },
        { input: { dayBackgroundColor: 1 }, expected: { dayBackgroundColor: undefined } },
        { input: { dayBackgroundColor: 'invalid' }, expected: { dayBackgroundColor: undefined } },
      ])
    })
  })

  describe('validatorRulerConfig', () => {
    it('should validate rows correctly', () => {
      runValidationTest(validatorRulerConfig, [
        { input: { rows: [ 'year', 'month', 'day' ] }, expected: { rows: [ 'year', 'month', 'day' ] } },
        { input: { rows: [] }, expected: { rows: [ 'day' ] } },
        { input: { rows: 'invalid' }, expected: { rows: [ 'day' ] } },
      ])
    })
  
    it('should validate rowHeight correctly', () => {
      runValidationTest(validatorRulerConfig, [
        { input: { rowHeight: '10px' }, expected: { rowHeight: '10px' } },
        { input: { rowHeight: 10 }, expected: { rowHeight: 10 } },
        { input: { rowHeight: 'invalid' }, expected: { rowHeight: '24px' } },
        { input: { rowHeight: undefined }, expected: { rowHeight: '24px' } },
      ])
    })
  
    it('should validate fontSize correctly', () => {
      runValidationTest(validatorRulerConfig, [
        { input: { fontSize: '10px' }, expected: { fontSize: '10px' } },
        { input: { fontSize: 10 }, expected: { fontSize: 10 } },
        { input: { fontSize: 'invalid' }, expected: { fontSize: '16px' } },
        { input: { fontSize: undefined }, expected: { fontSize: '16px' } },
      ])
    })
  
    it('should validate textColor correctly', () => {
      runValidationTest(validatorRulerConfig, [
        { input: { textColor: 'red' }, expected: { textColor: 'red' } },
        { input: { textColor: '#ff3333' }, expected: { textColor: '#ff3333' } },
        { input: { textColor: 123456 }, expected: { textColor: undefined } },
        { input: { textColor: undefined }, expected: { textColor: undefined } },
        { input: { textColor: 'invalid' }, expected: { textColor: 'invalid' } },
      ])
    })
  
    it('should validate backgroundColor correctly', () => {
      runValidationTest(validatorRulerConfig, [
        { input: { backgroundColor: 'blue' }, expected: { backgroundColor: 'blue' } },
        { input: { backgroundColor: '#3333ff' }, expected: { backgroundColor: '#3333ff' } },
        { input: { backgroundColor: 123456 }, expected: { backgroundColor: undefined } },
        { input: { backgroundColor: undefined }, expected: { backgroundColor: undefined } },
        { input: { backgroundColor: 'invalid' }, expected: { backgroundColor: 'invalid' } },
      ])
    })
  
  })
  
  describe('validatorRulerRole', () => {
    it('should validate placement correctly', () => {
      runValidationTest(validatorRulerRole, [
        { input: { placement: 'both' }, expected: { placement: 'both' } },
        { input: { placement: 'top' }, expected: { placement: 'top' } },
        { input: { placement: 'bottom' }, expected: { placement: 'bottom' } },
        { input: { placement: 'none' }, expected: { placement: 'none' } },
        { input: { placement: 'invalid' }, expected: { placement: 'both' } },
        { input: { placement: undefined }, expected: { placement: 'both' } },
      ])
    })
  
    it('should validate truncateLowers correctly', () => {
      runValidationTest(validatorRulerRole, [
        { input: { truncateLowers: true }, expected: { truncateLowers: true } },
        { input: { truncateLowers: false }, expected: { truncateLowers: false } },
        { input: { truncateLowers: 'invalid' }, expected: { truncateLowers: false } },
        { input: { truncateLowers: undefined }, expected: { truncateLowers: false } },
      ])
    })
  
    it('should validate minGrainWidth correctly', () => {
      runValidationTest(validatorRulerRole, [
        { input: { minGrainWidth: '48px' }, expected: { minGrainWidth: '48px' } },
        { input: { minGrainWidth:  48 }, expected: { minGrainWidth: 48 } },
        { input: { minGrainWidth:  'invalid' }, expected: { minGrainWidth: '48px' } },
        { input: { minGrainWidth:  undefined }, expected: { minGrainWidth: '48px' } },
      ])
    })
  
    it('should validate filters correctly', () => {
      const validFilter: Def.RulerFilter = {
        decorations: { key: { prefix: 'pre', suffix: 'suf' } },
        monthFormat: 'name',
        monthNames: ['January'],
        dayNames: ['Sunday'],
        abbreviateMonthNameLength: 3,
        abbreviateDayNameLength: 2,
        fullStop: true,
        dayBackgroundColor: true,
      }
  
      runValidationTest(validatorRulerRole, [
        { input: { filters: validFilter }, expected: { filters: validFilter } },
        { input: { filters: undefined }, expected: { filters: undefined } },
        { input: { filters: 'invalid' }, expected: { filters: undefined } },
      ])
    })
  
    it('should validate top correctly', () => {
      const validConfig: Def.RulerConfig = {
        rows: ['day'],
        rowHeight: '30px',
        fontSize: '14px',
        textColor: 'red',
        backgroundColor: 'blue',
      }
  
      runValidationTest(validatorRulerRole, [
        { input: { top: validConfig }, expected: { top: validConfig } },
        { input: { top: undefined }, expected: { top: { rows: ['day'] } } },
        { input: { top: 'invalid' }, expected: { top: { rows: ['day'] } } },
      ])
    })
  
    it('should validate bottom correctly', () => {
      const validConfig: Def.RulerConfig = {
        rows: ['day'],
        rowHeight: '30px',
        fontSize: '14px',
        textColor: 'red',
        backgroundColor: 'blue',
      }
  
      runValidationTest(validatorRulerRole, [
        { input: { bottom: validConfig }, expected: { bottom: validConfig } },
        { input: { bottom: undefined }, expected: { bottom: { rows: ['day'] } } },
        { input: { bottom: 'invalid' }, expected: { bottom: { rows: ['day'] } } },
      ])
    })
  })

  describe('validatorRelationConfig', () => {
    it('should validate before correctly', () => {
      runValidationTest(validatorRelationConfig, [
        { input: { before: '123' }, expected: { before: '123' } },
        { input: { before: 123 }, expected: { before: 123 } },
        { input: { before: undefined }, expected: { before: '' } },
        { input: { before: {} }, expected: { before: '' } },
      ])
    })
  
    it('should validate after correctly', () => {
      runValidationTest(validatorRelationConfig, [
        { input: { after: '456' }, expected: { after: '456' } },
        { input: { after: 456 }, expected: { after: 456 } },
        { input: { after: undefined }, expected: { after: '' } },
        { input: { after: [] }, expected: { after: '' } },
      ])
    })
  
    it('should validate lineSize correctly', () => {
      runValidationTest(validatorRelationConfig, [
        { input: { lineSize: 5 }, expected: { lineSize: 5 } },
        { input: { lineSize: undefined }, expected: { lineSize: undefined } },
        { input: { lineSize: 'invalid' }, expected: { lineSize: undefined } },
      ])
    })
  
    it('should validate lineColor correctly', () => {
      runValidationTest(validatorRelationConfig, [
        { input: { lineColor: 'red' }, expected: { lineColor: 'red' } },
        { input: { lineColor: undefined }, expected: { lineColor: undefined } },
        { input: { lineColor: 123 }, expected: { lineColor: undefined } },
      ])
    })
  
    it('should validate curve correctly', () => {
      runValidationTest(validatorRelationConfig, [
        { input: { curve: 'lt' }, expected: { curve: 'lt' } },
        { input: { curve: true }, expected: { curve: true } },
        { input: { curve: 'invalid' }, expected: { curve: false } },
        { input: { curve: undefined }, expected: { curve: false } },
      ])
    })
  })
  
  describe('validatorEventNode', () => {
    it('should validate eventId correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { eventId: 'event1' }, expected: { eventId: 'event1' } },
        { input: { eventId: undefined }, expected: { eventId: undefined } },
        { input: { eventId: 123 }, expected: { eventId: undefined } },
      ])
    })
  
    it('should validate start correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { start: '2023-01-01' }, expected: { start: '2023-01-01' } },
        { input: { start: undefined }, expected: { start: '' } },
      ])
    })
  
    it('should validate end correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { end: '2023-01-02' }, expected: { end: '2023-01-02' } },
        { input: { end: undefined }, expected: { end: undefined } },
      ])
    })
  
    it('should validate row correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { row: 2 }, expected: { row: 2 } },
        { input: { row: undefined }, expected: { row: 0 } },
        { input: { row: 'invalid' }, expected: { row: 0 } },
      ])
    })
  
    it('should validate group correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { group: 'group1' }, expected: { group: 'group1' } },
        { input: { group: undefined }, expected: { group: undefined } },
        { input: { group: 123 }, expected: { group: undefined } },
      ])
    })
  
    it('should validate label correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { label: 'Event Label' }, expected: { label: 'Event Label' } },
        { input: { label: undefined }, expected: { label: undefined } },
        { input: { label: 123 }, expected: { label: undefined } },
      ])
    })
  
    it('should validate textColor correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { textColor: 'blue' }, expected: { textColor: 'blue' } },
        { input: { textColor: undefined }, expected: { textColor: undefined } },
        { input: { textColor: 123 }, expected: { textColor: undefined } },
      ])
    })
  
    it('should validate backgroundColor correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { backgroundColor: 'green' }, expected: { backgroundColor: 'green' } },
        { input: { backgroundColor: undefined }, expected: { backgroundColor: undefined } },
        { input: { backgroundColor: 123 }, expected: { backgroundColor: undefined } },
      ])
    })
  
    it('should validate borderColor correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { borderColor: 'black' }, expected: { borderColor: 'black' } },
        { input: { borderColor: undefined }, expected: { borderColor: undefined } },
        { input: { borderColor: 123 }, expected: { borderColor: undefined } },
      ])
    })
  
    it('should validate borderWidth correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { borderWidth: 2 }, expected: { borderWidth: 2 } },
        { input: { borderWidth: undefined }, expected: { borderWidth: undefined } },
        { input: { borderWidth: 'invalid' }, expected: { borderWidth: undefined } },
      ])
    })
  
    it('should validate classes correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { classes: 'class1' }, expected: { classes: 'class1' } },
        { input: { classes: undefined }, expected: { classes: undefined } },
        { input: { classes: 123 }, expected: { classes: undefined } },
      ])
    })
  
    it('should validate styles correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { styles: 'color: red;' }, expected: { styles: 'color: red;' } },
        { input: { styles: undefined }, expected: { styles: undefined } },
        { input: { styles: 123 }, expected: { styles: undefined } },
      ])
    })
  
    it('should validate image correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { image: 'image.png' }, expected: { image: 'image.png' } },
        { input: { image: undefined }, expected: { image: undefined } },
        { input: { image: 123 }, expected: { image: undefined } },
      ])
    })
  
    it('should validate size correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { size: 'md' }, expected: { size: 'md' } },
        { input: { size: 'lg' }, expected: { size: 'lg' } },
        { input: { size: 24 }, expected: { size: 24 } },
        { input: { size: 'invalid' }, expected: { size: 'md' } },
        { input: { size: undefined }, expected: { size: 'md' } },
      ])
    })
  
    it('should validate remote correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { remote: true }, expected: { remote: true } },
        { input: { remote: false }, expected: { remote: false } },
        { input: { remote: 'invalid' }, expected: { remote: false } },
        { input: { remote: undefined }, expected: { remote: false } },
      ])
    })
  
    it('should validate expiration correctly', () => {
      runValidationTest(validatorEventNode, [
        { input: { expiration: 'always' }, expected: { expiration: 'always' } },
        { input: { expiration: 'none' }, expected: { expiration: 'none' } },
        { input: { expiration: 3600 }, expected: { expiration: 3600 } },
        { input: { expiration: 'invalid' }, expected: { expiration: 'always' } },
        { input: { expiration: undefined }, expected: { expiration: 'always' } },
      ])
    })
  
    it('should validate relation correctly', () => {
      const validRelation: Def.RelationConfig = {
        before: '123',
        after: '456',
        lineSize: 5,
        lineColor: 'red',
        curve: 'lt',
      }
  
      runValidationTest(validatorEventNode, [
        { input: { relation: validRelation }, expected: { relation: validRelation } },
        { input: { relation: undefined }, expected: { relation: undefined } },
        { input: { relation: 'invalid' }, expected: { relation: undefined } },
      ])
    })
  
    it('should validate extends correctly', () => {
      const validExtends = { key: 'value' }
  
      runValidationTest(validatorEventNode, [
        { input: { extends: validExtends }, expected: { extends: validExtends } },
        { input: { extends: undefined }, expected: { extends: undefined } },
        { input: { extends: 'invalid' }, expected: { extends: undefined } },
      ])
    })
  
    it('should validate callback correctly', () => {
      const validCallback = () => {};
  
      runValidationTest(validatorEventNode, [
        { input: { callback: validCallback }, expected: { callback: validCallback } },
        { input: { callback: undefined }, expected: { callback: undefined } },
        { input: { callback: 'invalid' }, expected: { callback: undefined } },
      ])
    })
  })

  describe('validatorLayouts', () => {
    it('should validate elevation correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { elevation: 3 }, expected: { elevation: 3 } },
        { input: { elevation: 10 }, expected: { elevation: 4 } },// Should be capped at max value
        { input: { elevation: undefined }, expected: { elevation: 0 } },
        { input: { elevation: 'invalid' }, expected: { elevation: 0 } },
      ])
    })

    it('should validate outlined correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { outlined: 'inside' }, expected: { outlined: 'inside' } },
        { input: { outlined: 'both' }, expected: { outlined: 'both' } },
        { input: { outlined: 'invalid' }, expected: { outlined: 'inside' } },
        { input: { outlined: undefined }, expected: { outlined: 'inside' } },
      ])
    })

    it('should validate outlineCorner correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { outlineCorner: 'rounded' }, expected: { outlineCorner: 'rounded' } },
        { input: { outlineCorner: 'squared' }, expected: { outlineCorner: 'squared' } },
        { input: { outlineCorner: 'invalid' }, expected: { outlineCorner: 'squared' } },
        { input: { outlineCorner: undefined }, expected: { outlineCorner: 'squared' } },
      ])
    })

    it('should validate outlineStyle correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { outlineStyle: 'dotted' }, expected: { outlineStyle: 'dotted' } },
        { input: { outlineStyle: 'none' }, expected: { outlineStyle: 'none' } },
        { input: { outlineStyle: 'invalid' }, expected: { outlineStyle: 'solid' } },
        { input: { outlineStyle: undefined }, expected: { outlineStyle: 'solid' } },
      ])
    })

    it('should validate hideScrollbar correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { hideScrollbar: true }, expected: { hideScrollbar: true } },
        { input: { hideScrollbar: false }, expected: { hideScrollbar: false } },
        { input: { hideScrollbar: 0 }, expected: { hideScrollbar: true } },
        { input: { hideScrollbar: 'false' }, expected: { hideScrollbar: true } },
        { input: { hideScrollbar: 'invalid' }, expected: { hideScrollbar: true } },
        { input: { hideScrollbar: undefined }, expected: { hideScrollbar: true } },
      ])
    })

    it('should validate eventsBackground correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { eventsBackground: 'grid' }, expected: { eventsBackground: 'grid' } },
        { input: { eventsBackground: 'none' }, expected: { eventsBackground: 'none' } },
        { input: { eventsBackground: 'invalid' }, expected: { eventsBackground: 'plaid' } },
        { input: { eventsBackground: undefined }, expected: { eventsBackground: 'plaid' } },
      ])
    })

    it('should validate width correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { width: 300 }, expected: { width: 300 } },
        { input: { width: '100%' }, expected: { width: '100%' } },
        { input: { width: 'invalid' }, expected: { width: 'auto' } },
        { input: { width: undefined }, expected: { width: 'auto' } },
      ])
    })

    it('should validate height correctly', () => {
      runValidationTest(validatorLayouts, [
        { input: { height: 200 }, expected: { height: 200 } },
        { input: { height: '100%' }, expected: { height: '100%' } },
        { input: { height: 'invalid' }, expected: { height: 'auto' } },
        { input: { height: undefined }, expected: { height: 'auto' } },
      ])
    })
  })

  describe('validatorEffects', () => {
  
    it('should validate presentTime correctly', () => {
      runValidationTest(validatorEffects, [
        { input: { presentTime: true }, expected: { presentTime: true } },
        { input: { presentTime: false }, expected: { presentTime: false } },
        { input: { presentTime: 1 }, expected: { presentTime: false } },
        { input: { presentTime: 'false' }, expected: { presentTime: false } },
        { input: { presentTime: 'invalid' }, expected: { presentTime: false } },
        { input: { presentTime: undefined }, expected: { presentTime: false } },
      ])
    })

    it('should validate defaultAlignment correctly', () => {
      runValidationTest(validatorEffects, [
        { input: { defaultAlignment: 'left' }, expected: { defaultAlignment: 'left' } },
        { input: { defaultAlignment: 3 }, expected: { defaultAlignment: 3 } },
        { input: { defaultAlignment: 'invalid' }, expected: { defaultAlignment: 'latest' } },
        { input: { defaultAlignment: undefined }, expected: { defaultAlignment: 'latest' } },
      ])
    })

    it('should validate hoverEvent correctly', () => {
      runValidationTest(validatorEffects, [
        { input: { hoverEvent: true }, expected: { hoverEvent: true } },
        { input: { hoverEvent: false }, expected: { hoverEvent: false } },
        { input: { hoverEvent: 1 }, expected: { hoverEvent: false } },
        { input: { hoverEvent: 'false' }, expected: { hoverEvent: false } },
        { input: { hoverEvent: 'invalid' }, expected: { hoverEvent: false } },
        { input: { hoverEvent: undefined }, expected: { hoverEvent: false } },
      ])
    })

    it('should validate onClickEvent correctly', () => {
      runValidationTest(validatorEffects, [
        { input: { onClickEvent: 'modal' }, expected: { onClickEvent: 'modal' } },
        { input: { onClickEvent: 'none' }, expected: { onClickEvent: 'none' } },
        { input: { onClickEvent: 'invalid' }, expected: { onClickEvent: 'normal' } },
        { input: { onClickEvent: undefined }, expected: { onClickEvent: 'normal' } },
      ])
    })

    it('should validate cacheExpiration correctly', () => {
      runValidationTest(validatorEffects, [
        { input: { cacheExpiration: 'always' }, expected: { cacheExpiration: 'always' } },
        { input: { cacheExpiration: 'none' }, expected: { cacheExpiration: 'none' } },
        { input: { cacheExpiration: 1234567890 }, expected: { cacheExpiration: 1234567890 } },
        { input: { cacheExpiration: 'invalid' }, expected: { cacheExpiration: 'always' } },
        { input: { cacheExpiration: undefined }, expected: { cacheExpiration: 'always' } },
      ])
    })

  })

  describe('validatorThemeConfig', () => {
    it('should validate name correctly', () => {
      runValidationTest(validatorThemeConfig, [
        { input: { name: 'dark' }, expected: { name: 'dark' } },
        { input: { name: undefined }, expected: { name: undefined } },
      ])
    })

    it('should validate hookChangeModeClass correctly', () => {
      runValidationTest(validatorThemeConfig, [
        { input: { hookChangeModeClass: 'theme-dark' }, expected: { hookChangeModeClass: 'theme-dark' } },
        { input: { hookChangeModeClass: undefined }, expected: { hookChangeModeClass: undefined } },
      ])
    })
  })

  describe('validateTimelineOptions', () => {
    it('should validate "start" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { start: '2023-01-01' }, expected: { start: '2023-01-01' } },
        { input: { start: new Date('2024-02-03') }, expected: { start: new Date('2024-02-03T00:00:00.000Z') } },
        { input: { start: 'invalid date' }, expected: { start: 'invalid date' } },
        { input: { start: undefined }, expected: { start: 'currently' } },
      ])
    })
  
    it('should validate "end" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { end: '2023-12-31' }, expected: { end: '2023-12-31' } },
        { input: { end: new Date('2024-04-29') }, expected: { end: new Date('2024-04-29T00:00:00.000Z') } },
        { input: { end: 'invalid date' }, expected: { end: 'invalid date' } },
        { input: { end: undefined }, expected: { end: 'auto' } },
      ])
    })
  
    it('should validate "timezone" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { timezone: 'Asia/Tokyo' }, expected: { timezone: 'Asia/Tokyo' } },
        { input: { timezone: undefined }, expected: { timezone: 'UTC' } },
      ])
    })
  
    it('should validate "scale" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { scale: 'year' }, expected: { scale: 'year' } },
        { input: { scale: 'invalid' }, expected: { scale: 'day' } },
        { input: { scale: undefined }, expected: { scale: 'day' } },
      ])
    })
  
    it('should validate "file" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { file: 'path/to/file' }, expected: { file: 'path/to/file' } },
        { input: { file: 'http://example.com/filename.json' }, expected: { file: 'http://example.com/filename.json' } },
        { input: { file: 'https://example.com/file.json?queries=value#hash' }, expected: { file: 'https://example.com/file.json?queries=value#hash' } },
        { input: { file: null }, expected: {} },
        { input: { file: undefined }, expected: {} },
      ])
    })
  
    it('should validate "header" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { header: { display: true } }, expected: { header: { display: true } } },
        { input: { header: undefined }, expected: { header: { display: false } } },
      ])
    })
  
    it('should validate "footer" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { footer: { display: true } }, expected: { footer: { display: true } } },
        { input: { footer: undefined }, expected: { footer: { display: false } } },
      ])
    })
  
    it('should validate "sidebar" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { sidebar: { placement: 'left', items: [] } },
          expected: { sidebar: { placement: 'left', items: [] } },
        },
        {
          input: { sidebar: undefined },
          expected: { sidebar: { placement: 'both', sticky: false, overlay: false, width: '150px', itemHeight: '80px', items: [] } },
        },
      ])
    })
  
    it('should validate "ruler" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { ruler: { placement: 'top' } },
          expected: { ruler: { placement: 'top' } },
        },
        {
          input: { ruler: undefined },
          expected: { ruler: { placement: 'both', minGrainWidth: '48px' } },
        },
      ])
    })
  
    it('should validate "events" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { events: [{ start: '2023-01-01', end: '2023-01-02' }] },
          expected: { events: [{ start: '2023-01-01', end: '2023-01-02' }] },
        },
        {
          input: { events: undefined },
          expected: { events: [] },
        },
      ])
    })
  
    it('should validate "layout" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { layout: { width: '100%', height: '400px', hideScrollbar: true } },
          expected: { layout: { width: '100%', height: '400px', hideScrollbar: true } },
        },
        {
          input: { layout: undefined },
          expected: {},
        },
      ])
    })
  
    it('should validate "effects" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { effects: { presentTime: true, defaultAlignment: 'center', hoverEvent: true, onClickEvent: 'modal', cacheExpiration: 'always' } },
          expected: { effects: { presentTime: true, defaultAlignment: 'center', hoverEvent: true, onClickEvent: 'modal', cacheExpiration: 'always' } },
        },
        {
          input: { effects: undefined },
          expected: { effects: { presentTime: false, defaultAlignment: 'latest', hoverEvent: true, onClickEvent: 'normal', cacheExpiration: 'always' } },
        },
      ])
    })
  
    it('should validate "theme" option', () => {
      runValidationTest(validatorTimelineOptions, [
        {
          input: { theme: { name: 'dark', theme: { primary: '#000' }, event: { background: '#fff' } } },
          expected: { theme: { name: 'dark' } },
        },
        {
          input: { theme: undefined },
          expected: {},
        },
      ])
    })
  
    it('should validate "useStorage" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { useStorage: 'localStorage' }, expected: { useStorage: 'localStorage' } },
        { input: { useStorage: 'invalid' }, expected: { useStorage: 'sessionStorage' } },
      ])
    })
  
    it('should validate "zoomable" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { zoomable: true }, expected: { zoomable: true } },
        { input: { zoomable: false }, expected: { zoomable: false } },
        { input: { zoomable: undefined }, expected: { zoomable: false } },
      ])
    })
  
    it('should validate "debug" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { debug: true }, expected: { debug: true } },
        { input: { debug: false }, expected: { debug: false } },
        { input: { debug: undefined }, expected: { debug: false } },
      ])
    })
  
    it('should validate "extends" option', () => {
      runValidationTest(validatorTimelineOptions, [
        { input: { extends: { custom: 'value' } }, expected: { extends: { custom: 'value' } } },
        { input: { extends: undefined }, expected: {} },
      ])
    })
  })

})
