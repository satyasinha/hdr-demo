<template>
  <div id="app">
    <div id="heading">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div id="container" ref="container">
      <div id="content">
      <interactome
        :edges="edges"
        :height="interactomeHeight"
        :nodes="nodes"
        :width="interactomeWidth"
      ></interactome>
      </div>
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
      description: 'Simme (Simulated Interactome) demonstrates functional interactions between IoT devices via simulated IoT logs being rendered as an Interactome',
      interactomeHeight: 400,
      interactomeWidth: 500,
      selected: ''
    }
  },
  methods: {
    ...mapActions([
      'activateSchema',
      'addDevice',
      'updateLogs'
    ]),
    onResize () {
      this.interactomeHeight = this.$refs.container.clientHeight - 5
      this.interactomeWidth = this.$refs.container.clientWidth - 150
      console.log('height: ', this.interactomeHeight)
      console.log('width: ', this.interactomeWidth)
    }
  },

  watch: {
    selected: function (schema) {
      console.log('watching selected', schema)
      this.activateSchema(schema)
    }
  },

  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()

    setInterval(function () {
      this.updateLogs()
      // map(this.logs, log => {
      //   console.log(JSON.stringify(log))
      // })
    }.bind(this), 1000)
  },

  beforeDestroy () {
    console.log('destroying!')
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style>

body {
  height: 90vh;
}

#app {
  width: 100%;
  height: 100%;
}

#container {
  height: calc(100% - 100px);
  display: flex;
}

#content {
  flex: 1;
}

#sidebar {
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
