<template lang="pug">
.conversation-window.rounded-xl(
  :class="{ mobile: $vuetify.display.mobile }"
)
  .conversation-window-message(
    v-for="(item, index) in messages"
    :key="`message-${item.id}`"
    :class="item?.isAssistant ? 'left' : 'right'"
  )
    template(v-if="item?.isAssistant")
      v-avatar(size="40")
        v-img(
          src="/laila.png"
          size="40"
        )
    .conversation-window-text
      span(v-html="markdownToHtml(item.text)")
    template(v-if="!item?.isAssistant")
      v-avatar(size="40")
        v-icon(
          color="black"
          size="40"
        ) mdi-account-circle
  v-text-field(
    @keydown.enter="doCreatePrediction"
    v-model="text"
    placeholder="Message..."
    variant="solo-filled"
    enterkeyhint="send"
    auto-grow hide-details no-resize flat
  )
</template>

<script>
import { mapActions } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { marked } from 'marked'

import useAppStore from '@/stores/app'
import { EventBus } from '@/services'

export default {
  name: 'Window',
  data: () => ({
    loading: false,
    messages: [],
    text: ''
  }),
  methods: {
    ...mapActions(useAppStore, ['createPrediction', 'createSDXL']),
    markdownToHtml(str) {
      return marked.parse(str)
    },
    doScroll() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight
      return window.scrollY >= scrollableHeight
    },
    getInfo() {
      try {
        const info = JSON.parse(localStorage.getItem('info') || '{}')
        for (const [key, value] of Object.entries(info)) {
          if (!value || value == [] || value == '') delete info[key]
        }
        return info
      } catch (e) {
        console.log('--- failed to get info', e)
        return {}
      }
    },
    async webhookChat(payload) {
      const { output, query } = payload
      const { id } = query

      const index = this.messages.findIndex((message) => message.id === id)
      if (index < 0) return

      const doScroll = this.doScroll()

      this.messages[index].text = output.join('')

      if (doScroll) {
        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
      }
    },
    async webhookInfo(payload) {
      const { output } = payload

      try {
        const str = output.join('')
        const json = JSON.parse(str)

        const info = this.getInfo()
        const merged = Object.assign(info, json)
        console.log('--- merged info', merged)
        localStorage.setItem('info', JSON.stringify(merged))
      } catch (e) {
        console.log('--- failed to store info: ', e)
      }
    },
    async webhookImage(payload) {
      const { output } = payload

      try {
        const prompt = output.join('')
        console.log('--- SDXL prompt', prompt)
        if (prompt.toLowerCase().includes('false')) return

        const message_id = uuidv4()
        this.messages.push({
          id: message_id,
          isAssistant: true,
          text: '...'
        })

        await this.createSDXL({
          prompt,
          message_id
        })
      } catch (e) {
        console.log('--- failed to create SDXL image: ', e)
      }
    },
    async webhookSDXL(payload) {
      const { output, query } = payload
      const { id } = query

      const index = this.messages.findIndex((message) => message.id === id)
      if (index < 0) return

      const doScroll = this.doScroll()

      this.messages[index].text = `![An image](${output[0]} "An image")`

      // Todo, scroll after image has loaded
      if (doScroll) {
        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
      }
    },
    async doCreatePrediction() {
      this.loading = true
      try {
        this.messages.push(
          ...[
            {
              id: uuidv4(),
              isAssistant: false,
              text: this.text
            },
            { id: uuidv4(), isAssistant: true, text: '...' }
          ]
        )
        this.text = ''

        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })

        await this.createPrediction({
          info: this.getInfo(),
          messages: this.messages
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    // Initial chat
    this.messages.push({ id: uuidv4(), isAssistant: true, text: '...' })
    this.createPrediction({
      skip_extract: true,
      skip_image: true,
      info: this.getInfo(),
      messages: [
        {
          id: uuidv4(),
          isAssistant: false,
          text: `Please give me a very short welcome back chat, and use any of my personal information if possible!`
        },
        ...this.messages
      ]
    })

    EventBus.$on('webhook:chat', this.webhookChat)
    EventBus.$on('webhook:info', this.webhookInfo)
    EventBus.$on('webhook:image', this.webhookImage)
    EventBus.$on('webhook:sdxl', this.webhookSDXL)
  },
  beforeUnmount() {
    EventBus.$off('webhook:chat', this.webhookChat)
    EventBus.$off('webhook:info', this.webhookInfo)
    EventBus.$off('webhook:image', this.webhookImage)
    EventBus.$off('webhook:sdxl', this.webhookSDXL)
  }
}
</script>

<style lang="stylus" scoped>
.conversation-window
  padding 16px
  background @css { rgb(var(--v-theme-surface)) }

  .conversation-window-message
    margin-bottom 16px
    display grid
    -moz-column-gap 16px
    column-gap 16px
    align-items end

    &.left
      margin-right 112px
      grid-template-columns min-content 1fr
      align-content start

      .conversation-window-text
        span
          background #efefef
          border-radius 16px 16px 16px 0

    &.right
      margin-left 112px
      grid-template-columns 1fr min-content
      align-content end
      text-align right

      .conversation-window-text
        span
          background @css { rgb(var(--v-theme-secondary)) }
          border-radius 16px 16px 0 16px
          color @css { rgb(var(--v-theme-surface)) }

    .conversation-window-text
      span
        padding 16px
        display inline-block

        :deep(hr)
          margin 8px 0
          border 0
          border-top 1px solid #dadada

        :deep(img)
          max-width 100%
          margin-bottom -5px
          border-radius 8px

        :deep(ol), :deep(ul)
          margin-left 16px

          li
            margin 16px 0 0 16px

        :deep(code)
          padding 1px 6px 2px
          font-size 14px
          background #e3e3e3
          border 1px solid #cdcdcd
          border-radius 4px

        :deep(pre)
          margin 16px 0
          padding 8px 16px
          background #333
          color #fff
          border-radius 6px

          code
            padding 0
            background none
            border none

  .v-text-field
    margin-top 16px

    :deep(.v-field)
      border-radius 16px

  &.mobile
    .conversation-window-message
      .v-avatar, .v-icon
        width 24px !important
        height 24px !important
        font-size 24px !important

      &.left, &.right
        margin-left 0 !important
        margin-right 0 !important
</style>
