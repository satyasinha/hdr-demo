<template>
  <div id="app">
    <interactome :data="devices"></interactome>
    <div id="sidebar">
      <button></button>
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
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
