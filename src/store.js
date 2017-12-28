import Vue from 'vue'
import Vuex from 'vuex'
import { concat, intersection, keys, last, omit, values } from 'lodash'

import ArtificialIoT from './classes/ArtificialIoT'

Vue.use(Vuex)

const INTERVAL = 500

const _buildRelationships = (devices, device) => {
  const relationships = []
  // TODO should not need to omit 'id'
  // but have to so it's not counted as a sensor
  const deviceKeys = keys(omit(device, 'id'))
  values(devices).forEach((d) => {
    const commonSensors = intersection(keys(d), deviceKeys)
    if (commonSensors.length > 0) {
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
  addDevice (state) {
    console.log('adding device')
    state.devices.push(new ArtificialIoT())
  },
  buildRelationships (state) {
    console.log('building relationships')
    const recentDevice = last(state.devices)
    const sensorData = recentDevice.getSensorData()
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
  devices: state => values(state.devicesSensorData)
}

const actions = {
  addDevice ({ commit, state }) {
    commit('addDevice')
    commit('buildRelationships')
  },
  run ({ commit, state }) {
    setInterval(() => {
      state.devices.forEach((device) => {
        commit('updateDeviceSensorData', device.getSensorData())
      })
      console.info(state.devicesSensorData)
    }, INTERVAL)
  }
}

export default new Vuex.Store({
  state, getters, mutations, actions
})
