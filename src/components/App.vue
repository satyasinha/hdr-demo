<template>
  <div id="app">
    <div id="heading">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div id="content">
      <interactome :nodes="nodes" :edges="edges"></interactome>
      <div id="sidebar">
        <select v-model="selected">
          <option disabled value="">Select a Schema</option>
          <option  v-for="(schema, index) in schemas" :key="index">
            {{ schema }}
          </option>
        </select>
        <button @click="addDevice()">Add Device</button>
        <detail></detail>
        <stats></stats>
      </div>
    </div>
  </div>
</template>

<script>
// import { map } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import Detail from './Detail.vue'
import Interactome from './Interactome.vue'
import Stats from './Stats.vue'

export default {
  components: { Detail, Interactome, Stats },
  computed: {
    ...mapGetters([
      'edges',
      'logs',
      'nodes',
      'schemas'
    ])
  },
  data () {
    return {
      title: 'Simme',
      description: 'Simme (Simulated Interactome) demonstrates functional interactions between IoT devices via sim  ulated IoT logs being rendered as an Interactome',
      selected: ''
    }
  },
  methods: {
    ...mapActions([
      'activateSchema',
      'addDevice',
      'updateLogs'
    ])
  },

  watch: {
    selected: function (schema) {
      console.log('watching selected', schema)
      this.activateSchema(schema)
    }
  },

  mounted () {
    setInterval(function () {
      this.updateLogs()
      // map(this.logs, log => {
      //   console.log(JSON.stringify(log))
      // })
    }.bind(this), 1000)
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
