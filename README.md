# Laila AI

![Laila AI](./public/cover.jpg)

## How it works

This app is powered by:

🚀 [Replicate](https://replicate.com/?utm_source=project&utm_campaign=laila-ai), a platform for running machine learning models in the cloud.

🖍️ [Llama 2 13B](https://replicate.com/a16z-infra/llama-2-13b-chat?utm_source=project&utm_campaign=laila-ai), an open-source large language machine learning model from Meta that is fine tuned for chat completions.

▲ [Vercel](https://vercel.com/), a platform for running web apps.

⚡️ Nuxt.js [server-side API routes](server/api), for talking to Replicate's API.

👀 Nuxt.js Vue components, for the browser UI.

🍃 [Vuetify](https://vuetifyjs.com/en/), a component framwork for Vue.

## Development

1. Install a recent version of [Node.js](https://nodejs.org/)
1. Copy your [Replicate API token](https://replicate.com/account?utm_source=project&utm_campaign=laila-ai) and set it in your environment:
   ```
   echo "REPLICATE_API_TOKEN=<your-token-here>" > .env.local
   ```
1. Install dependencies and run the server:
   ```
   npm install
   npm run dev
   ```
1. Open [localhost:3000](http://localhost:3000) in your browser. That's it!
