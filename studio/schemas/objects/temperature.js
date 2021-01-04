import React from 'react'
import { qF } from '../../../../sanity-quick-fields'

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
  fields: [
    qF('temperature', 'number'),
    qF('measurement', 'string', {
      list: [
        { title: 'ºC', value: 'celsius' },
        { title: 'ºF', value: 'fahrenheit' },
      ],
      direction: 'horizontal',
      layout: 'radio',
    }),
  ],
  blockEditor: {
    icon: () => 'ºC/F',
    render: TemperatureRender,
  },
}
