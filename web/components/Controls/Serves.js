import React from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'

import { useStore } from '../../hooks/useStore'

function Serves() {
  const serves = useStore((state) => state.serves)
  const incrementServes = useStore((state) => state.incrementServes)
  const buttonClasses = `flex items-center justify-center m-1 text-caramel-500 hover:text-caramel-600 hover:bg-white transition-colors duration-100`
  const buttons = [
    {
      increment: serves === 1 ? -0.5 : -1,
      disabled: serves <= 0.5,
      classes: `${buttonClasses} ${
        serves <= 0.5 ? `opacity-25 pointer-events-none` : ``
      }`,
      icon: <MinusIcon className="w-5 h-auto" />,
      sr: `Make less`,
    },
    {
      increment: serves === 0.5 ? +0.5 : 1,
      disabled: false,
      classes: buttonClasses,
      icon: <PlusIcon className="w-5 h-auto" />,
      sr: `Make more`,
    },
  ]

  return (
    <>
      {buttons.map((button, index) => (
        <React.Fragment key={button.increment}>
          <button
            type="button"
            onClick={() => incrementServes(button.increment)}
            className={button.classes}
          >
            {button.icon}
            <span className="sr-only">{button.sr}</span>
          </button>
          {!index && (
            <div
              className="text-caramel-900 text-center p-2 border-l border-r border-caramel-200"
              aria-live="polite"
            >
              {serves === 0.5 ? `½` : serves}× Recipe
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export default Serves
