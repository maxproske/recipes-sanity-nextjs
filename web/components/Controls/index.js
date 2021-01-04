import React from 'react'
import { PlusSmSolid, MinusSmSolid } from '@graywolfai/react-heroicons'

import { useStore } from '../../hooks/useStore'
import Toggle from './Toggle'
import Serves from './Serves'

function Controls() {
  const serves = useStore((state) => state.serves)
  const incrementServes = useStore((state) => state.incrementServes)
  const cup = useStore((state) => state.cup)
  const cupOptions = useStore((state) => state.cupOptions)
  const changeCup = useStore((state) => state.changeCup)
  const weight = useStore((state) => state.weight)
  const weightOptions = useStore((state) => state.weightOptions)
  const changeWeight = useStore((state) => state.changeWeight)
  const temperature = useStore((state) => state.temperature)
  const temperatureOptions = useStore((state) => state.temperatureOptions)
  const changeTemperature = useStore((state) => state.changeTemperature)

  return (
    <div className="flex justify-center w-full bg-caramel-100 bg-opacity-90 border-b border-caramel-200 font-display text-2xs uppercase font-black tracking-widest sticky top-0 mb-8 py-1">
      <div className="flex items-center w-full max-w-4xl pl-2">
        <Serves />
        <div className="ml-auto pr-2 flex divide-x divide-caramel-200">
          <Toggle
            name="cups"
            current={cup}
            options={cupOptions}
            changeFunction={changeCup}
          />
          <Toggle
            name="weight"
            current={weight}
            options={weightOptions}
            changeFunction={changeWeight}
          />
          <Toggle
            name="temperature"
            current={temperature}
            options={temperatureOptions}
            changeFunction={changeTemperature}
          />
        </div>
      </div>
    </div>
  )
}

export default Controls
