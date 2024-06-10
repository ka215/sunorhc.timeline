import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SunorhcTimeline } from '../src/SunorhcTimeline'
import * as Util from '../src/utils'
import * as packageJson from '../package.json'

// Mock the necessary utilities
vi.mock('./utils', () => ({
  deepMergeObjects: vi.fn(),
  isObject: vi.fn(),
  isEmptyObject: vi.fn(),
  deserialize: vi.fn(),
  validateTimelineOptions: vi.fn(),
  fetchData: vi.fn(),
  setStyles: vi.fn(),
  deepCloneObject: vi.fn(),
}))

describe('SunorhcTimeline', () => {
  const elementId = 'timeline-element'
  let targetElement: HTMLDivElement

  beforeEach(() => {
    document.body.innerHTML = `<div id="${elementId}" data-options='{"start":"2022-01-01","end":"2022-12-31"}'></div>`
    targetElement = document.querySelector<HTMLDivElement>(`#${elementId}`)!
  })

  it('should have a static VERSION property', () => {
    expect(SunorhcTimeline.VERSION).toBe(packageJson.version)
  })

  describe('create method', () => {
    it('should create an instance of SunorhcTimeline', async () => {
      const instance = await SunorhcTimeline.create(elementId, { start: '2023-01-01' })
      expect(instance).toBeInstanceOf(SunorhcTimeline)
      expect(instance.elementId).toBe(elementId)
    })

    it('should handle errors during options initialization', async () => {
      Util.deepMergeObjects.mockImplementationOnce(() => { throw new Error('Test Error') })
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      const instance = await SunorhcTimeline.create(elementId)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create timeline:', expect.any(Error))
      expect(Util.setStyles).toHaveBeenCalledWith(instance.targetElement, { display: 'none' })

      consoleErrorSpy.mockRestore()
    })

    it('should add instance to global window object', async () => {
      await SunorhcTimeline.create(elementId)
      expect(window.SunorhcTimelineInstances[elementId]).toBeInstanceOf(SunorhcTimeline)
    })
  })

  describe('initOptions method', () => {
    let instance: SunorhcTimeline

    beforeEach(async () => {
      instance = await SunorhcTimeline.create(elementId)
    })

    it('should merge options from dataset', async () => {
      Util.deserialize.mockReturnValue({ timezone: 'UTC', scale: 'week' })
      Util.validateTimelineOptions.mockReturnValue({ timezone: 'UTC', scale: 'week' })
      Util.isObject.mockReturnValue(true)
      Util.deepMergeObjects.mockReturnValueOnce(instance.options)

      await instance['initOptions']()
      expect(Util.deepMergeObjects).toHaveBeenCalled()
    })

    it('should merge options from inputOptions', async () => {
      const inputOptions = { start: new Date('2023-01-01'), end: new Date('2023-12-31') }
      instance = await SunorhcTimeline.create(elementId, inputOptions)
      Util.isObject.mockReturnValue(true)
      Util.deepMergeObjects.mockReturnValueOnce(instance.options)
      await instance['initOptions']()
      expect(Util.deepMergeObjects).toHaveBeenCalled()
    })

    it('should fetch and merge options from external file', async () => {
      instance = await SunorhcTimeline.create(elementId, { file: 'config.json' })
      Util.fetchData.mockResolvedValue({ timezone: 'PST', scale: 'month' })
      Util.validateTimelineOptions.mockReturnValue({ timezone: 'PST', scale: 'month' })
      Util.deepMergeObjects.mockReturnValueOnce(instance.options)
      await instance['initOptions']()
      expect(Util.fetchData).toHaveBeenCalled()
      expect(Util.deepMergeObjects).toHaveBeenCalled()
    })
  })

  describe('getOptions method', () => {
    let instance: SunorhcTimeline

    beforeEach(async () => {
      instance = await SunorhcTimeline.create(elementId)
    })

    it('should return cloned options if toClone is true', () => {
      const clonedOptions = { ...instance.options }
      Util.deepCloneObject.mockReturnValue(clonedOptions)
      const options = instance.getOptions(true)
      expect(options).toEqual(clonedOptions)
      expect(Util.deepCloneObject).toHaveBeenCalledWith(instance.options)
    })

    it('should return options directly if toClone is false', () => {
      const options = instance.getOptions(false)
      expect(options).toEqual(instance.options)
      expect(Util.deepCloneObject).not.toHaveBeenCalled()
    })
  })
})
