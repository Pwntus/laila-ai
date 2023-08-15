import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, prompt, message_id } = body

  // https://replicate.com/stability-ai/sdxl
  const prediction = await replicate.predictions.create({
    version: 'a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5',
    input: {
      prompt,
      num_inference_steps: 30,
      scheduler: 'K_EULER_ANCESTRAL',
      refine: 'expert_ensemble_refiner',
      high_noise_frac: 0.8
    },
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=sdxl&id=${message_id}`,
    webhook_events_filter: ['completed']
  })

  return prediction
})
