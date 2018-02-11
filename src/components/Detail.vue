<template>
  <div id="detail">
    {{ selected }}
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'selected'
      ])
    }
  }
</script>

<style>
#detail {
  flex-grow: 1;
}
</style>
