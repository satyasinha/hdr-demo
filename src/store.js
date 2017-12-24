import Vue from 'vue'
import Vuex from 'vuex'

import ArtificialIoT from './classes/ArtificialIoT'

Vue.use(Vuex)

const INTERVAL = 500

const state = {
  // the 'real' devices
  devices: [new ArtificialIoT()],
  // the data capture for the devices
  devicesSensorData: {}
}

const mutations = {
  addDevice (state) {
    state.devices.push(new ArtificialIoT())
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

const actions = {
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
  state, mutations, actions
})
