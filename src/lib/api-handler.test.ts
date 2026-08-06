import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ApiError } from './api-error'
import { parseJsonBody } from './api-handler'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

describe('parseJsonBody', () => {
  const schema = z.object({ name: z.string().min(1), age: z.number().positive() })

  it('returns typed data for valid body', async () => {
    const req = makeRequest({ name: 'Alice', age: 30 })
    const result = await parseJsonBody(req, schema)
    expect(result).toEqual({ name: 'Alice', age: 30 })
  })

  it('throws ApiError(400) for invalid JSON', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json'
    })
    await expect(parseJsonBody(req, schema)).rejects.toThrow(ApiError)
    try {
      await parseJsonBody(req, schema)
    } catch (e) {
      expect((e as ApiError).status).toBe(400)
      expect((e as ApiError).message).toBe('Invalid JSON body')
    }
  })

  it('throws ApiError(400) when schema validation fails', async () => {
    const req = makeRequest({ name: '', age: -5 })
    await expect(parseJsonBody(req, schema)).rejects.toThrow(ApiError)
    try {
      await parseJsonBody(req, schema)
    } catch (e) {
      expect((e as ApiError).status).toBe(400)
    }
  })

  it('throws ApiError(400) for missing fields', async () => {
    const req = makeRequest({})
    await expect(parseJsonBody(req, schema)).rejects.toThrow(ApiError)
  })
})

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const err = new ApiError(404, 'Not found')
    expect(err).toBeInstanceOf(Error)
  })

  it('has the correct status', () => {
    const err = new ApiError(403, 'Forbidden')
    expect(err.status).toBe(403)
  })

  it('has the correct message', () => {
    const err = new ApiError(500, 'Internal')
    expect(err.message).toBe('Internal')
  })

  it('has a stack trace', () => {
    const err = new ApiError(400, 'Bad')
    expect(err.stack).toBeDefined()
  })
})
