let actionsService

const wreck = { get: jest.fn() }

describe('actionService', () => {
  beforeEach(() => {
    jest.resetModules()
    wreck.get.mockRestore()

    // Setup wreck mocks before requiring actionsService because
    // actionsService calls wreck.defaults() immediately on load
    jest.mock('@hapi/wreck')
    const wreckConstructor = require('@hapi/wreck')
    wreckConstructor.defaults.mockReturnValue(wreck)

    actionsService = require('../../server/services/actionsService')
  })

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })

  describe('getActions', () => {
    test('returns array of actions provided by remote API', async () => {
      const payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule',
                enabled: true,
                facts: [],
                type: 'some-type'
              }
            ]
          }
        ]
      }
      wreck.get.mockResolvedValue({ payload })
      const result = await actionsService.getActions()
      expect(result).toEqual(payload.actions)
    })

    test('creates a rule type field using the first item in each rule types array', async () => {
      const payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule 1',
                enabled: true,
                facts: [],
                types: ['some-type', 'some-other-type']
              },
              {
                id: 2,
                description: 'Test rule 2',
                enabled: true,
                facts: [],
                types: ['some-other-type']
              }
            ]
          }
        ]
      }
      wreck.get.mockResolvedValue({ payload })
      const result = await actionsService.getActions()
      expect(result).toEqual(expect.any(Array))
      expect(result.length).toBe(1)
      expect(result[0].rules.length).toBe(2)
      expect(result[0].rules[0].type).toBe(payload.actions[0].rules[0].types[0])
      expect(result[0].rules[1].type).toBe(payload.actions[0].rules[1].types[0])
    })

    test('does not overwrite an existing rule type field from types array', async () => {
      const payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule',
                enabled: true,
                facts: [],
                type: 'some-type',
                types: ['some-other-type']
              }
            ]
          }
        ]
      }
      wreck.get.mockResolvedValue({ payload })
      const result = await actionsService.getActions()
      expect(result).toEqual(expect.any(Array))
      expect(result.length).toBe(1)
      expect(result[0].rules.length).toBe(1)
      expect(result[0].rules[0].type).toBe(payload.actions[0].rules[0].type)
      expect(result[0].rules[0].type).not.toBe(payload.actions[0].rules[0].types[0])
    })

    test('returns empty array for empty payload', async () => {
      const payload = undefined
      wreck.get.mockResolvedValue({ payload })
      const result = await actionsService.getActions()
      expect(result).toBeDefined()
      expect(result.length).toBe(0)
    })
  })
})
