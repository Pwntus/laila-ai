<template lang="pug">
v-app
  ui-app-bar
  v-main
    v-container
      nuxt-page(v-if="inited")
</template>

<script>
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'

export default {
  name: 'App',
  data: () => ({
    inited: false
  }),
  methods: mapActions(useAppStore, ['init']),
  async mounted() {
    try {
      await this.init()
      this.inited = true
    } catch (e) {
      console.log('--- failed to init', e)
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-application
  .v-container
    max-width 1000px
    padding-top 4rem
</style>
