import React from 'react'
import { SunIcon } from '@heroicons/react/20/solid'

import { useWakeLock } from '../../hooks/useWakeLock'

function KeepAwake() {
  const { supported, enabled, toggle } = useWakeLock()
  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? 'Screen will stay on' : 'Keep screen on while cooking'}
      className={`flex items-center gap-1 uppercase text-2xs font-black tracking-widest my-1 ml-2 py-2 px-2 leading-none transition-colors duration-100 ${
        enabled
          ? 'bg-caramel-800 text-white'
          : 'text-caramel-500 hover:bg-white hover:text-caramel-600'
      }`}
    >
      <SunIcon className="w-4 h-auto" />
      {enabled ? 'Screen on' : 'Keep on'}
    </button>
  )
}

export default KeepAwake
