import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import verification from './verification'

const app = new Hono()

app.route('/', verification)
app.onError((err, _c) => {
  console.warn('Error:', err)
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  if (err instanceof Error) {
    return new Response(err.message, {
      status: 500,
    })
  }
  return new Response('Unknown Internal error', {
    status: 500,
  })
})

export default app
