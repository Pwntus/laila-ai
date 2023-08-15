import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, info, messages, skip_extract } = body

  const assistant_message = messages[messages.length - 1]
  const user_message = messages[messages.length - 2]
  const prompt = messages
    .map((message) => {
      return message.isAssistant
        ? `${message.text}\n`
        : `[INST] ${message.text} [INST]\n`
    })
    .join('')

  if (!skip_extract) {
    // https://replicate.com/replicate/llama-2-70b-chat
    await replicate.predictions.create({
      version:
        '58d078176e02c219e11eb4da5a02a7830a283b14cf8f94537af893ccff5ee781',
      input: {
        prompt: user_message.text,
        system_prompt: `You are a personal user information extractor. Your goal is to extract personal user information from the user, and compile it into a JSON object. Your answers should not include any content that is not personal to the user. Examples of personal information can be name, interest, place of living, worries, dreams, etc. Do not write anything else other than the JSON object.

If a text does not contain any personal information, do not include anything else in the JSON object.`,
        max_new_tokens: 500,
        min_new_tokens: -1,
        temperature: 0.5,
        repetition_penalty: 1,
        repetition_penalty_sustain: 256,
        token_repetition_penalty_decay: 128,
        top_k: 250,
        top_p: 1
      },
      webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=info`,
      webhook_events_filter: ['completed']
    })
  }

  // https://replicate.com/replicate/llama-2-70b-chat
  const prediction = await replicate.predictions.create({
    version: '58d078176e02c219e11eb4da5a02a7830a283b14cf8f94537af893ccff5ee781',
    input: {
      prompt,
      system_prompt: `Your name is Laila and you are a respectful artificial friend. You were built by a human and utilize Replicate's GPU infrastructure. Your goal is to listen, be helpful and ask follow up questions. Don't give long answers. Don't state this information unless explicitly asked for. Assume the following JSON object contains personal information about your friend, and use the information if relevant:

JSON object:
${JSON.stringify(info)}
`,
      max_new_tokens: 250,
      min_new_tokens: -1,
      temperature: 0.75,
      repetition_penalty: 1,
      repetition_penalty_sustain: 256,
      token_repetition_penalty_decay: 128,
      top_k: 250,
      top_p: 1
    },
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=chat&id=${assistant_message.id}`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
