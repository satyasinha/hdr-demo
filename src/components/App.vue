<template>
  <div id="app">
    <div id="heading">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div id="content">
      <interactome :nodes="nodes" :edges="edges"></interactome>
      <div id="sidebar">
        <button @click="addDevice">Add Device</button>
        <detail></detail>
        <stats></stats>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Detail from './Detail.vue'
import Interactome from './Interactome.vue'
import Stats from './Stats.vue'

export default {
  components: { Detail, Interactome, Stats },
  computed: {
    ...mapGetters([
      'nodes',
      'edges'
    ])
  },
  data () {
    return {
      title: 'Simme',
      description: 'Simme (Simulated Interactome) demonstrates functional interactions between IoT devices via simulated IoT logs being rendered as an Interactome'
    }
  },
  methods: {
    ...mapActions([
      'addDevice'
    ])
  }
}
</script>

<style>
body {
  height: 80vh;
}

#app {
  width: 100%;
  height: 100%;
}

#content {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  height: 100%;
}

#sidebar {
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
