import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, values } from 'lodash'

import ArtificialIoT from './devices/ArtificialIoT'

Vue.use(Vuex)

const state = {
  // the 'real' devices
  devices: [],
  deviceObjects: [],
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
    state.deviceObjects.push({ id })
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
  selectEdge (state, index) {
    state.selected = { ...state.relatedDevices[index].commonSensors }
  },
  selectNode (state, index) {
    state.selected = { ...state.devices[index] }
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
  selected: state => state.selected,
  totalEdges: state => state.relatedDevices.length,
  totalNodes: state => state.deviceObjects.length
}

const actions = {
  addDevice ({ commit }) {
    const device = new ArtificialIoT()
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

export default new Vuex.Store({
  state, getters, mutations, actions
})
