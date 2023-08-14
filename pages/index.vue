<template lang="pug">
.index
  .hero.d-flex
    .flex-shrink-0
      v-img(
        src="/laila.png"
        min-width="275"
        style="border-radius: 64px"
      )
    .d-flex.flex-column.justify-center
      .text-h2 Hi,<br>I'm <span>Laila</span>.
      .text-h5.text-grey-darken-4.mt-8 I'm your virtual friend. I'll learn from our conversation and remember details about you.
      .mt-8
        v-btn(
          color="secondary"
          variant="flat"
          size="small"
          rounded
        ) Start friendship

  conversation-window
</template>

<style lang="stylus" scoped>
.index
  .hero
    -moz-column-gap 2rem
    column-gap 2rem

    .text-h2
      font-weight 600
      color var(--v-theme-black)

      span
        display inline-block
        color transparent
        -webkit-background-clip text
        background-clip text
        background-image linear-gradient(90deg, #ec4899 0%, #8b5cf6 60%)

    .text-h5
      font-weight 300

  .conversation-window
    margin-top 4rem
</style>
