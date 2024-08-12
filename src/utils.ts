import type { Hook } from '@hono/zod-validator'
import type { Env } from 'hono'

export const zValidatorHook: Hook<any, Env, '', object> = (result, c) => {
  if (result.success) {
    return result.data
  }
  return c.text(result.error.issues.at(0)?.message ?? 'Unknown params error', {
    status: 400,
  })
}
