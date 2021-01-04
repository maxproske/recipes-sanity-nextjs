import React from 'react'
import PropTypes from 'prop-types'

import { useStore } from '../hooks/useStore'

const convert = require('convert-units')

function Temperature({ temperature, measurement }) {
  const temperatureControl = useStore((state) => state.temperature)
  let temperatureDisplay = temperature

  if (temperatureControl === 'fahrenheit' && measurement === 'celsius') {
    temperatureDisplay = convert(temperature).from('C').to('F')
  } else if (temperatureControl === 'celsius' && measurement === 'fahrenheit') {
    temperatureDisplay = convert(temperature).from('F').to('C')
  }

  temperatureDisplay = temperatureDisplay.toFixed()

  return (
    <span className="font-display font-black text-caramel-800">
      {temperatureDisplay}
      {temperatureControl === 'celsius' ? `ºC` : `ºF`}
    </span>
  )
}

Temperature.propTypes = {
  temperature: PropTypes.number,
  measurement: PropTypes.string,
}

export default Temperature
