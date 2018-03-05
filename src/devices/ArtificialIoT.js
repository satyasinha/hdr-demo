import uuid from 'uuid/v4'

import DEFAULT from '../schemas/default.json'

const DEFAULT_SENSORS = DEFAULT.nodes[0].sensors

/**
 * ArtificalIoT class expects a 'sensorTypes' parameter to
 * include one or more sensor types listed in SENSOR_TYPES
 */
class ArtificialIoT {
  static generateSensorValue (max, min, digits) {
    const value = Math.random() * (max - min) + min
    return value.toFixed(digits)
  }

  constructor (sensors = [DEFAULT_SENSORS[Math.floor(Math.random() * DEFAULT_SENSORS.length)]]) {
    this.id = uuid()
    this.sensors = sensors
    this.fetchData()
  }

  getId () {
    return this.id
  }

  getSensors () {
    return this.sensors.map(sensor => sensor.type)
  }

  getData () {
    return this.data
  }

  fetchData () {
    const data = { id: this.id }

    this.sensors.forEach(sensor => {
      const value = ArtificialIoT.generateSensorValue(
        parseInt(sensor.max),
        parseInt(sensor.min),
        parseInt(sensor.digits)
      )
      data[sensor.type] = `${value} ${sensor.units}`
    })

    this.data = data
  }
}

export default ArtificialIoT
