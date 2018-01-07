<template>
  <svg width="80%" height="100%"></svg>
</template>

<script>
import Interactome from '../classes/Interactome'

export default {
  props: ['data'],
  watch: {
    data: function (newData) {
      // TODO resize d3 somehow....
      // console.log('element: ', this.$el.clientWidth, this.$el.clientHeight)
      this.Interactome.arrangeData(newData)
    }
  },
  mounted: function () {
    this.Interactome = new Interactome(this.$el, this.$el.clientWidth, this.$el.clientHeight)
  }
}
</script>