import Temperature from '../components/Temperature'

export const portableTextComponents = {
  marks: {
    temperature: ({ value }) => {
      const { temperature, measurement } = value
      return (
        <Temperature temperature={temperature} measurement={measurement} />
      )
    },
  },
}
