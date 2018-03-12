import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, values } from 'lodash'

import ArtificialIoT from './devices/ArtificialIoT'

Vue.use(Vuex)

const initialState = {
  // the 'real' devices
  devices: [],
  deviceObjects: [],
  schemas: [
    'cascading-effects',
    'problem-solution',
    'self-organisation',
    'synchronisation'
  ],
  selected: {},
  // the data capture for the devices
  sensorData: {},
  relatedDevices: []
}

const mutations = {
  addDevice (state, device) {
    state.devices.push(device)
  },

  addDeviceObject (state, device) {
    const id = device.getId()
    const title = device.getTitle()
    state.deviceObjects.push({ id, title })
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
    state.relatedDevices = concat(state.relatedDevices, relationships)
  },

  clearDevices (state) {
    state = { ...initialState }
  },

  selectEdge (state, index) {
    state.selected = { ...state.relatedDevices[index].commonSensors }
  },

  selectNode (state, index) {
    state.selected = {
      title: state.devices[index].getTitle(),
      description: state.devices[index].getDescription(),
      ...state.devices[index].getData()
    }
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
  edges: state => state.relatedDevices,
  logs: state => values(state.sensorData),
  nodes: state => state.deviceObjects,
  schemas: state => state.schemas,
  selected: state => state.selected,
  totalEdges: state => state.relatedDevices.length,
  totalNodes: state => state.deviceObjects.length
}

const actions = {
  activateSchema ({ commit, dispatch }, schemaFile) {
    const schema = require(`./schemas/${schemaFile}.json`)
    commit('clearDevices')
    if (schema.type === 'iot') {
      schema.nodes.map(node => {
        dispatch('addDevice', node)
      })
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
