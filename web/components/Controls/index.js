import React, { useState, useEffect } from 'react'
import { ChevronDownSolid } from '@graywolfai/react-heroicons'

import { useStore } from '../../hooks/useStore'
import Toggle from './Toggle'
import Serves from './Serves'
import useBreakpoint from '../../hooks/useBreakpoint'

function Controls() {
  const size = useBreakpoint()
  const [showToggles, setShowToggles] = useState(false)
  useEffect(() => {
    if (size !== 'sm') {
      setShowToggles(false)
    }
  }, [])

  const cup = useStore((state) => state.cup)
  const cupOptions = useStore((state) => state.cupOptions)
  const changeCup = useStore((state) => state.changeCup)
  const standard = useStore((state) => state.standard)
  const standardOptions = useStore((state) => state.standardOptions)
  const changeStandard = useStore((state) => state.changeStandard)
  const temperature = useStore((state) => state.temperature)
  const temperatureOptions = useStore((state) => state.temperatureOptions)
  const changeTemperature = useStore((state) => state.changeTemperature)

  return (
    <div className="flex justify-center w-full bg-caramel-100 bg-opacity-90 border-b border-caramel-200 font-display text-2xs uppercase font-black tracking-widest sticky top-0 mb-8 py-1 z-10">
      <div className="flex items-center w-full max-w-4xl pl-2">
        <Serves />

        <button
          type="button"
          onClick={() => setShowToggles(!showToggles)}
          className={`flex md:hidden items-center uppercase text-2xs font-black tracking-widest ml-auto my-1 mr-2 py-2 px-2 leading-none transition-colors duration-100 
            ${
              showToggles
                ? `text-caramel-900`
                : `text-caramel-500 hover:bg-white hover:text-caramel-600`
            }
          `}
        >
          {showToggles ? `Hide` : `Show`} Controls
          <ChevronDownSolid
            className={`${
              showToggles ? `rotate-180` : ``
            } transform  w-4 h-auto`}
          />
        </button>
        <div
          className={`ml-auto px-2 ${
            showToggles
              ? ` bg-white z-10 absolute top-full -ml-2 w-full text-right border-t border-caramel-200`
              : `hidden`
          } md:flex divide-y md:divide-x md:divide-y-0 divide-caramel-200`}
        >
          <Toggle
            name="cups"
            current={cup}
            options={cupOptions}
            changeFunction={changeCup}
          />
          <Toggle
            name="standard"
            current={standard}
            options={standardOptions}
            changeFunction={changeStandard}
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
