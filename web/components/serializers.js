import Temperature from './Temperature'

const serializers = {
  marks: {
    temperature: ({ mark }) => {
      const { temperature, measurement } = mark
      return <Temperature temperature={temperature} measurement={measurement} />
    },
  },
}

export default serializers
