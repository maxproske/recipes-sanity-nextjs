import create from 'zustand'

const cupOptions = ['Cups', 'Weight', 'Volume']
const weightOptions = ['Metric', 'Imperial']
const temperatureOptions = [
  { value: 'celsius', abbr: 'ºC' },
  { value: 'fahrenheit', abbr: 'ºF' },
]

export const useStore = create((set) => ({
  // Serves
  serves: 1,
  incrementServes: (increment) =>
    set((state) => ({ serves: state.serves + increment })),

  // Cups
  cup: cupOptions[0],
  cupOptions,
  changeCup: (cup) => set(() => ({ cup })),

  // Weights
  weight: weightOptions[0],
  weightOptions,
  changeWeight: (weight) => set(() => ({ weight })),

  // Temperatures
  temperature: temperatureOptions[0].value,
  temperatureOptions,
  changeTemperature: (temperature) => set(() => ({ temperature })),
}))
