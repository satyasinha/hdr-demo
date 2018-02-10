import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, values } from 'lodash'

import ArtificialIoT from './devices/ArtificialIoT'

Vue.use(Vuex)

const state = {
  // the 'real' devices
  devices: [],
  deviceObjects: [],
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
  totalEdges: state => state.relatedDevices.length,
  totalNodes: state => state.deviceObjects.length
}

const actions = {
  addDevice ({ commit, dispatch, state }) {
    const device = new ArtificialIoT()
    commit('addDevice', device)
    commit('addDeviceObject', device)
    commit('buildRelationships', device)
  },
  updateLogs ({ commit, state }) {
    state.devices.forEach((device) => {
      commit('updateLog', device.getData())
    })
  }
}

export default new Vuex.Store({
  state, getters, mutations, actions
})
