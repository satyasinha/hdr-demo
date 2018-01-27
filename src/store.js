import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, keys, values } from 'lodash'

import ArtificialIoT from './classes/ArtificialIoT'

Vue.use(Vuex)

const INTERVAL = 500

const _buildRelationships = (devices, device) => {
  const relationships = []
  const deviceKeys = keys(device)
  values(devices).forEach((d) => {
    const commonSensors = intersection(keys(d), deviceKeys)
    if (commonSensors.length > 0 && d.id !== device.id) {
      relationships.push(
        {
          source: device.id,
          target: d.id,
          commonSensors
        }
      )
    }
  })

  return relationships
}

const state = {
  // the 'real' devices
  devices: [new ArtificialIoT()],
  // the data capture for the devices
  devicesSensorData: {},
  relatedDevices: []
}

const mutations = {
  addDevice (state, device) {
    // console.log('adding device')
    state.devices.push(device)
  },
  buildRelationships (state, device) {
    // console.log('building relationships')
    const sensorData = device.getSensorData()
    state.relatedDevices = concat(state.relatedDevices, _buildRelationships(state.devicesSensorData, sensorData))
  },
  updateDeviceSensorData (state, update) {
    state.devicesSensorData = {
      ...state.devicesSensorData,
      [update.id]: {
        ...update
      }
    }
  }
}

const getters = {
  nodes: state => values(state.devicesSensorData),
  edges: state => state.relatedDevices
}

const actions = {
  addDevice ({ commit, dispatch, state }) {
    const device = new ArtificialIoT()
    commit('addDevice', device)
    // dispatch('run')
    commit('updateDeviceSensorData', device.getSensorData())
    commit('buildRelationships', device)
  },
  run ({ commit, state }) {
    setInterval(() => {
      state.devices.forEach((device) => {
        commit('updateDeviceSensorData', device.getSensorData())
        commit('buildRelationships', device)
      })
      console.info(state.devicesSensorData)
    }, INTERVAL)
  }
}

export default new Vuex.Store({
  state, getters, mutations, actions
})
