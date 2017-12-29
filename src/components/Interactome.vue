<template>
  <svg width="80%" height="100%"></svg>
</template>

<script>
import Interactome from '../classes/Interactome'

export default {
  props: ['nodes', 'edges'],
  watch: {
    nodes: function (newNodes) {
      // TODO resize d3 somehow....
      // console.log('element: ', this.$el.clientWidth, this.$el.clientHeight)
      // console.log('nodes are being added', newNodes)
      this.Interactome.arrangeNodes(newNodes)
    },
    edges: function (newEdges) {
      console.log('edges: ', newEdges)
      this.Interactome.arrangeEdges(newEdges)
    }
  },
  mounted: function () {
    this.Interactome = new Interactome(this.$el, this.$el.clientWidth, this.$el.clientHeight)
  }
}
</script>