<template lang="pug">
v-app
  ui-app-bar
  v-main
    v-container
      nuxt-page
</template>

<script>
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'

export default {
  name: 'App',
  methods: mapActions(useAppStore, ['init']),
  mounted() {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
.v-application
  .v-container
    max-width 1000px
    padding-top 4rem
    padding-bottom 4rem
</style>
