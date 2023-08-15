<template lang="pug">
v-app-bar(flat)
  v-app-bar-title Laila AI
  span
  .app-bar-actions
    v-btn(
      href="https://github.com/aurdalgroup/laila-app"
      target="_new"
      color="black"
      variant="flat"
      size="small"
      rounded
    )
      template(#prepend)
        v-icon(color="white" size="large") mdi-github
      | Code
</template>

<style lang="stylus" scoped>
.v-app-bar
  background-color rgba(0, 0, 0, 0.8) !important
  -webkit-backdrop-filter saturate(180%) blur(20px)
  backdrop-filter saturate(180%) blur(20px)
  z-index 100

  :deep(.v-toolbar__content)
    max-width 1000px !important
    margin 0 auto
    padding 4px 16px
    display grid
    grid-template-columns min-content 1fr min-content
    column-gap 16px
    color #d6d6d6

    .v-app-bar-title
      margin 0
</style>
