import { has, filter, isEmpty, keys, omit } from 'lodash'
import uuid from 'uuid/v4'

const SENSOR_TYPES = [
  'temperature',
  'light',
  'velocity'
]

const SENSOR_VALUE_RANGE = {
  temperature: {
    max: 35, min: 15
  },
  light: {
    max: 25000, min: 0.001
  },
  velocity: {
    max: 100, min: 0
  }
}

/**
 * ArtificalIOT class expects a 'sensorTypes' parameter to
 * include one or more sensor types listed in SENSOR_TYPES
 */
class ArtificialIoT {
  _assignSensors (sensorTypes) {
    // if sensorTypes is empty assign a single sensor
    if (isEmpty(sensorTypes)) {
      sensorTypes = [SENSOR_TYPES[Math.floor(Math.random() * SENSOR_TYPES.length)]]
    }

    sensorTypes.forEach((sensor) => {
      this[sensor] = ''
    })
  }

  static generateSensorValue (sensorType) {
    const max = SENSOR_VALUE_RANGE[sensorType].max
    const min = SENSOR_VALUE_RANGE[sensorType].min
    return Math.random() * (max - min) + min
  }

  static showMinMaxSensorType (sensorType) {
    return SENSOR_VALUE_RANGE[sensorType]
  }

  constructor (sensorTypes = []) {
    this.id = uuid()
    // assigns sensors randomly unless they exist
    if (isEmpty(sensorTypes)) {
      this._assignSensors(filter(SENSOR_TYPES, () => Math.random() >= 0.5))
    } else {
      this._assignSensors(sensorTypes)
    }
  }

  getId () {
    return this.id
  }

  getSensors () {
    // id is not a sensor so exclude it
    return keys(omit(this, 'id'))
  }

  getData () {
    // temperature sensor data
    if (has(this, SENSOR_TYPES[0])) {
      this[SENSOR_TYPES[0]] = `${ArtificialIoT.generateSensorValue(SENSOR_TYPES[0]).toFixed(2)} °C`
    }

    // light sensor data
    if (has(this, SENSOR_TYPES[1])) {
      this[SENSOR_TYPES[1]] = `${ArtificialIoT.generateSensorValue(SENSOR_TYPES[1]).toFixed(3)} lux`
    }

    // velocity sensor data
    if (has(this, SENSOR_TYPES[2])) {
      this[SENSOR_TYPES[2]] = `${ArtificialIoT.generateSensorValue(SENSOR_TYPES[2]).toFixed(2)} m/sec`
    }

    return this
  }
}

export default ArtificialIoT
