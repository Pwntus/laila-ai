export default {
  runtimeConfig: {
    replicateApiToken: process.env.REPLICATE_API_TOKEN || ''
  },
  ssr: false,
  nitro: {
    preset: 'vercel-edge'
  },
  sourcemap: {
    server: false,
    client: false
  },
  modules: ['@pinia/nuxt', '@invictus.codes/nuxt-vuetify'],
  plugins: [{ src: '~/plugins/vercel.js', mode: 'client' }],
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#f6f6f6',
              surface: '#ffffff',
              primary: '#333',
              secondary: '##0184ff',
              error: '#FF5252',
              info: '#2196F3',
              success: '#008000',
              warning: '#ffc300',
              black: '#1d1d1f',
              white: '#d6d6d6'
            }
          }
        }
      },
      breakpoint: {
        mobileBreakpoint: 'xs'
      }
    },
    moduleOptions: {
      treeshaking: true,
      useIconCDN: false,
      styles: { configFile: 'assets/style/vuetify.scss' },
      autoImport: true,
      useVuetifyLabs: false
    }
  },
  app: {
    head: {
      title: 'Laila AI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: `I'm your virtual friend. I'll learn from our conversation and remember details about you.`
        },
        {
          property: 'og:title',
          content: 'Laila AI'
        },
        {
          property: 'og:description',
          content: `I'm your virtual friend. I'll learn from our conversation and remember details about you.`
        },
        {
          property: 'og:url',
          content: 'https://laila-ai.com/'
        },
        {
          property: 'og:image',
          content: 'https://laila-ai.com/cover.jpg'
        },
        {
          property: 'twitter:image',
          content: 'https://laila-lai.com/cover.jpg'
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:title',
          content: 'Laila AI'
        },
        {
          property: 'twitter:description',
          content: `I'm your virtual friend. I'll learn from our conversation and remember details about you.`
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          sizes: 'any'
        }
      ]
    }
  }
}
