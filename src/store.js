import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, values } from 'lodash'

import ArtificialIoT from './devices/ArtificialIoT'

Vue.use(Vuex)

const initialState = {
  // the 'real' devices
  devices: [],
  edges: [],
  nodes: [],
  schemas: [
    'cascading-effects',
    'research-thoughts',
    'problem-solution',
    'self-organisation',
    'synchronisation'
  ],
  schemaType: '',
  selected: {},
  // the data capture for the devices
  sensorData: {}
}

const mutations = {
  addDevice (state, device) {
    state.devices.push(device)
  },

  addDeviceObject (state, device) {
    const id = device.getId()
    const title = device.getTitle()
    state.nodes.push({ id, title })
  },

  addEdge (state, edge) {
    const { source, target } = edge
    state.edges.push({source: state.nodes[source], target: state.nodes[target]})
  },

  addNode (state, node) {
    state.nodes.push(node)
  },

  buildRelationships (state, device) {
    const relationships = []
    state.devices.forEach(d => {
      const commonSensors = intersection(d.getSensors(), device.getSensors())
      const source = device.getId()
      const target = d.getId()
      if (commonSensors.length > 0 && source !== target) {
        relationships.push({
          source,
          target,
          commonSensors
        })
      }
    })

    state.edges = concat(state.edges, relationships)
  },

  clearDevices (state) {
    state = { ...initialState }
  },

  selectEdge (state, index) {
    state.selected = { ...state.edges[index].commonSensors }
  },

  selectNode (state, index) {
    if (state.schemaType === 'iot') {
      state.selected = {
        title: state.devices[index].getTitle(),
        description: state.devices[index].getDescription(),
        ...state.devices[index].getData()
      }
    } else if (state.schemaType === 'board') {
      state.selected = {
        title: state.nodes[index].title,
        description: state.nodes[index].description || ''
      }
    }
  },

  setSchemaType (state, type) {
    state.schemaType = type
  },

  updateLog (state, update) {
    state.sensorData = {
      ...state.sensorData,
      [update.id]: {
        ...update
      }
    }
  }
}

const getters = {
  edges: state => state.edges,
  logs: state => values(state.sensorData),
  nodes: state => state.nodes,
  schemas: state => state.schemas,
  selected: state => state.selected,
  totalEdges: state => state.edges.length,
  totalNodes: state => state.nodes.length
}

const actions = {
  activateSchema ({ commit, dispatch }, schemaFile) {
    const schema = require(`./schemas/${schemaFile}.json`)
    commit('clearDevices')
    commit('setSchemaType', schema.type)
    if (schema.type === 'iot') {
      schema.nodes.map(node => {
        dispatch('addDevice', node)
      })
    } else if (schema.type === 'board') {
      schema.nodes.map(node => commit('addNode', node))
      schema.edges.map(edge => commit('addEdge', edge))
    }
  },
  addDevice ({ commit }, node) {
    const { sensors, title, description } = node || {}
    const device = new ArtificialIoT(sensors, title, description)
    commit('addDevice', device)
    commit('addDeviceObject', device)
    commit('buildRelationships', device)
  },
  updateLogs ({ commit, state }) {
    state.devices.forEach((device) => {
      commit('updateLog', device.getData())
    })
  },
  selectEdge ({ commit }, index) {
    commit('selectEdge', index)
  },
  selectNode ({ commit }, index) {
    commit('selectNode', index)
  }
}

const state = { ...initialState }

export default new Vuex.Store({
  state, getters, mutations, actions
})
