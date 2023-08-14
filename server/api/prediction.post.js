import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, input } = body

  // https://replicate.com/replicate/llama-2-70b-chat
  const prediction = await replicate.predictions.create({
    version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
    input,
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
