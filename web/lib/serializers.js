import Temperature from '../components/Temperature'

export const serializers = {
  marks: {
    temperature: ({ mark }) => {
      const { temperature, measurement } = mark
      return <Temperature temperature={temperature} measurement={measurement} />
    },
  },
}
