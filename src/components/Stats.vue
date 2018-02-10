<template>
  <div id="stats">
    <div>
      <span>Total nodes: </span>
      <span>{{ totalNodes }}</span>
    </div>
    <div>
      <span>Total edges: </span>
      <span>{{ totalEdges }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'totalEdges',
      'totalNodes'
    ])
  }
}
</script>

<style>
#stats {
  flex-grow: 1;
}
</style>
