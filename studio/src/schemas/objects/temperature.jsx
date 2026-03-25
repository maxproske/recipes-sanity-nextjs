import React from 'react'

const TemperatureRender = ({ children, temperature, measurement }) => (
  <span style={{ backgroundColor: 'yellow' }}>
    {temperature || children}
    {measurement === 'celsius' ? 'ºC' : ''}
    {measurement === 'fahrenheit' ? 'ºF' : ''}
  </span>
)

export default {
  title: 'Temperature',
  name: 'temperature',
  type: 'object',
  description: 'Will convert from ºC to ºF on the front-end',
  icon: () => 'ºC/F',
  components: {
    annotation: TemperatureRender,
  },
  fields: [
    {
      name: 'temperature',
      title: 'Temperature',
      type: 'number',
    },
    {
      name: 'measurement',
      title: 'Measurement',
      type: 'string',
      options: {
        list: [
          { title: 'ºC', value: 'celsius' },
          { title: 'ºF', value: 'fahrenheit' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    },
  ],
}
