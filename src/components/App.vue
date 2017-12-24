<template>
  <div id="app">
    <div id="heading">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div id="content">
      <interactome :data="devices"></interactome>
      <div id="sidebar">
        <button>Add Device</button>
      </div>
    </div>
  </div>
</template>

<script>
import Interactome from './Interactome.vue'
export default {
  components: { Interactome },
  computed: {
    devices () {
      return this.$store.state.devicesSensorData
    }
  },
  data () {
    return {
      title: 'Simme',
      description: 'Simme (Simulated Interactome) demonstrates functional interactions between IoT devices via simulated IoT logs being rendered as an Interactome'
    }
  }
}
</script>

<style>
#content {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

#sidebar {
  width: 150px;
  display: flex;
  flex-direction: column;
}
</style>
