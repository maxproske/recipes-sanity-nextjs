import { create } from 'zustand'

const cupOptions = ['Cups', 'Weight', 'Volume']
const standardOptions = ['Metric', 'Imperial']
const temperatureOptions = [
  { value: 'celsius', abbr: 'ºC' },
  { value: 'fahrenheit', abbr: 'ºF' },
]

export const useStore = create((set) => ({
  // Serves — really a recipe multiplier (½×, 1×, 2×…). Recipes don't store a
  // yield, so it scales the whole recipe rather than counting servings.
  serves: 1,
  incrementServes: (increment) =>
    set((state) => ({ serves: state.serves + increment })),
  resetServes: () => set(() => ({ serves: 1 })),

  // Cups
  cup: cupOptions[0],
  cupOptions,
  changeCup: (cup) => set(() => ({ cup })),

  // Weights
  standard: standardOptions[0],
  standardOptions,
  changeStandard: (standard) => set(() => ({ standard })),

  // Temperatures
  temperature: temperatureOptions[1].value,
  temperatureOptions,
  changeTemperature: (temperature) => set(() => ({ temperature })),
}))
